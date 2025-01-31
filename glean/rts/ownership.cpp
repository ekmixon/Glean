// Copyright (c) Facebook, Inc. and its affiliates.

#include "glean/rts/lookup.h"
#include "glean/rts/inventory.h"
#include "glean/rts/ownership.h"
#include "glean/rts/ownership/pool.h"
#include "glean/rts/ownership/setu32.h"
#include "glean/rts/ownership/triearray.h"
#include "glean/rts/ownership/uset.h"

#include <folly/container/F14Map.h>
#include <folly/container/F14Set.h>
#include <folly/Hash.h>
#include <folly/experimental/EliasFanoCoding.h>

#include <immintrin.h>
#include <xxhash.h>

#include <algorithm>
#include <initializer_list>
#include <limits>
#include <type_traits>

using namespace folly::compression;

namespace facebook {
namespace glean {
namespace rts {

namespace {

/**
 * Fill ownership data from an iterator
 *
 * Takes the Unit -> FactId mapping provided by the
 * OwnershipUnitIterator and populates the TrieArray with it, making
 * a FactId -> Set(Unit) mapping.
 */
FOLLY_NOINLINE TrieArray<Uset> fillOwnership(OwnershipUnitIterator* iter) {
  struct Stats {
    size_t units = 0;
    size_t intervals = 0;

    void bump(size_t us, size_t is) {
      units += us;
      const auto old_intervals = intervals;
      intervals += is;
      if ((old_intervals / 5000000) != (intervals / 5000000)) {
        dump();
      }
    }

    void dump() {
      LOG(INFO)
        << units << " units, "
        << intervals << " intervals";
    }
  };

  TrieArray<Uset> utrie;
  uint32_t last_unit = 0;
  Stats stats;
  while(const auto d = iter->get()) {
    const auto data = d.value();
    CHECK_GE(data.unit,last_unit);

    utrie.insert(
      data.ids.begin(),
      data.ids.end(),
      [&](Uset * FOLLY_NULLABLE prev, uint32_t refs) {
        if (prev != nullptr) {
          if (prev->refs == refs) {
            // Do an in-place append if possible (determined via reference
            // count).
            prev->set.append(data.unit);
            return prev;
          } else {
            auto entry = std::make_unique<Uset>(SetU32(prev->set, SetU32::copy_capacity), refs);
            entry->set.append(data.unit);
            prev->refs -= refs;
            return entry.release();
          }
        } else {
          auto entry = std::make_unique<Uset>(SetU32(), refs);
          entry->set.append(data.unit);
          return entry.release();
        }
      }
    );

    stats.bump(stats.units == 0 || data.unit > last_unit ? 1 : 0, data.ids.size());
    last_unit = data.unit;
  }

  stats.dump();

  return utrie;
}

/** Move the sets from the trie to `Usets`. */
FOLLY_NOINLINE Usets collectUsets(TrieArray<Uset>& utrie) {
  Usets usets;
  size_t visits = 0;
  utrie.foreach([&](Uset *entry) -> Uset* {
    ++visits;

    // entry->link() caches usets.add(entry) below
    Uset* p = static_cast<Uset*>(entry->link());

    // visited this Uset before?
    if (p == nullptr) {
      p = usets.add(entry);
      entry->link(p);
    }

    // duplicate set? Update the Trie to point to the canonical one.
    if (p != entry) {
      entry->drop();
      return p;
    } else {
      return nullptr;
    }
  });

  usets.foreach([](Uset *entry) {
    entry->link(nullptr);
  });

  LOG(INFO)
    << visits << " visits, "
    << usets.size() << " usets";
  return usets;
}

/** Transitively complete `Usets` by assigning an ownership unit to facts which
 * are transitively referenced by a fact already belonging to that unit.
 *
 * The resulting `Usets` will contain exactly those sets (the "promoted" ones)
 * which describe the ownership of at least one fact.
 */
FOLLY_NOINLINE void completeOwnership(std::vector<Uset *> &facts, Usets& usets,
                                      const Inventory &inventory,
                                      Lookup &lookup) {
  struct Stats {
    Usets& usets;
    size_t total_facts = 0;
    size_t owned_facts = 0;

    void bumpTotal() {
      ++total_facts;
    }

    void bumpOwned() {
      ++owned_facts;
      if (owned_facts%1000000 == 0) {
        dump();
      }
    }

    void dump() {
      auto ustats = usets.statistics();
      LOG(INFO)
        << owned_facts << " of " << total_facts << " facts, "
        << usets.size() << " usets, "
        << ustats.promoted << " promoted, "
        << ustats.bytes << " bytes, "
        << ustats.adds << " adds, "
        << ustats.dups << " dups";
    }
  };

  Stats stats{usets};

  std::vector<Id> refs;
  Traverser tracker([&](Id id, Pid) {
    refs.push_back(id);
  });

  if (facts.size() == 0) {
    return;
  }

  // Iterate over facts backwards - this ensures that we get all dependencies.
  const auto max_id = Id::fromWord(facts.size());
  for (auto iter = lookup.enumerateBack(max_id);
      auto fact = iter->get();
      iter->next()) {
    stats.bumpTotal();

    // `set == nullptr` means that the fact doesn't have an ownership set - we
    // might want to make that an error eventually?
    if (auto set = facts[fact.id.toWord()]) {
      // TODO: Store the set in the DB and assign it to the current fact.
      usets.promote(set);

      // Collect all references to facts
      const auto *predicate = inventory.lookupPredicate(fact.type);
      assert(predicate);
      predicate->traverse(tracker, fact.clause);

      // For each fact we reference, add our ownership set to what we've
      // computed for it so far. Use the `link` field to avoid computing the
      // same set union multiple times.
      //
      // TODO: Try adding a fixed-size LRU (or LFU?) cache for set unions?
      std::vector<Uset *> touched;
      for (const auto id : refs) {
        auto& me = facts[id.toWord()];
        if (me == nullptr) {
          // The fact didn't have ownership info before, assign the set to it.
          me = set;
          usets.use(me, 1);
        } else if (const auto added = static_cast<Uset *>(me->link())) {
          // The fact did have ownership info and we've already computed the
          // union for that particular set.
          usets.use(added);
          usets.drop(me);
          me = added;
        } else {
          // Compute the union.
          const auto p = usets.merge(me, set);
          me->link(p);
          touched.push_back(me);
          me = p;
        }
      }

      // Reset the link fields. Note that we always add 1 refcount for sets we
      // store in `touched` (to avoid having dangling references there) so drop
      // it here.
      for (const auto p : touched) {
        p->link(nullptr);
        usets.drop(p);
      }

      touched.clear();
      refs.clear();
      // TODO: We can drop the current's fact ownership info here - could shrink
      // the vector.
      // facts.shrink(fact.id);
      stats.bumpOwned();
    }
  }

  stats.dump();
}

}

UsetId MemoryOwnership::getUset(Id id) {
  // facts_.size() might be smaller than the total number of facts
  // if there were some unowned facts at the end, so we need a
  // bounds check.
  return id.toWord() < facts_.size() ? facts_[id.toWord()] : INVALID_USET;
}

std::unique_ptr<OwnershipSetIterator> MemoryOwnership::getSetIterator() {
  struct MemorySetIterator : OwnershipSetIterator {
    MemorySetIterator(uint32_t i, std::vector<MutableUnitSet>& sets) :
      i_(i), sets_(sets) {}

    size_t size() override { return sets_.size(); }

    folly::Optional<std::pair<UnitId,UnitSet*>> get() override {
      if (i_ >= sets_.size()) {
        return folly::none;
      } else {
        uint32_t i = i_++;
        assert(!sets_.empty()); // be gone, linter
        return std::pair<UnitId,UnitSet*>(
            i,
            reinterpret_cast<UnitSet*>(&sets_[i]));
      }
    }

    uint32_t i_;
    std::vector<MutableUnitSet>& sets_;
  };

  return std::make_unique<MemorySetIterator>(0, sets_);
}

std::unique_ptr<Slice> slice(
    Ownership *ownership,
    const std::vector<UnitId>& units,
    bool exclude) {
  auto iter = ownership->getSetIterator();
  using Reader = EliasFanoReader<
    folly::compression::EliasFanoEncoderV2<uint32_t,uint32_t>>;
  std::vector<bool> members(iter->size(), false);
  if (!units.empty()) {
    assert(!members.empty());
    while (auto pair = iter->get()) {
      auto i = pair->first;
      VLOG(5) << "slice set: " << i;
      auto reader = Reader(*pair->second);
      if (exclude) {
        // we want members[i] = false iff sets_[i] is a subset of units,
        // indicating that the fact is owned by excluded units only.
        if (!reader.next()) {
          // empty ownership set... include these facts I guess?
          members[i] = true;
          continue;
        }
        auto it = units.begin();
        do {
          it = std::lower_bound(it, units.end(), reader.value());
          if (it == units.end() || reader.value() < *it) {
            // owned by a unit we didn't exclude
            VLOG(5) << "present: " << reader.value();
            members[i] = true;
            break;
          }
          // reader.value() == *it; advance both
          it++;
        } while (reader.next());
        // if the loop condition fails, the set only contains
        // excluded units.
      } else {
        if (!reader.skipTo(units[0])) {
          continue;
        }
        for (auto unit : units) {
          if (reader.value() < unit) {
            if (!reader.skipTo(unit)) {
              break;
            }
          }
          if (reader.value() == unit) {
            VLOG(5) << "present: " << unit;
            members[i] = true;
            break;
          }
        }
      }
    }
  }
  return std::make_unique<Slice>(std::move(members));
}

std::unique_ptr<MemoryOwnership> computeOwnership(
    const Inventory& inventory,
    Lookup& lookup,
    OwnershipUnitIterator *iter) {
  LOG(INFO) << "filling ownership";
  auto utrie = fillOwnership(iter);
  LOG(INFO) << "collecting units";
  auto usets = collectUsets(utrie);
  // TODO: Should `completeOwnership` work with the trie rather than a
  // flat vector?
  auto facts = utrie.flatten();
  LOG(INFO) << "completing ownership (" << facts.size() << ")";
  completeOwnership(facts, usets, inventory, lookup);
  LOG(INFO) << "finalizing sets";

  std::vector<UsetId> factOwners(facts.size());
  for (uint32_t i = Id::lowest().toWord(); i < facts.size(); i++) {
    factOwners[i] = facts[i] ? facts[i]->id : INVALID_USET;
  }

  auto sets = usets.toEliasFano();
  LOG(INFO) << "finished ownership";

  return std::make_unique<MemoryOwnership>(
      std::move(sets),
      std::move(factOwners));
}

}
}
}
