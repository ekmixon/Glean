#include <utility>

#include <folly/Range.h>

#include <rocksdb/db.h>
#include <rocksdb/filter_policy.h>
#include <rocksdb/slice_transform.h>
#include <rocksdb/table.h>
#include <rocksdb/utilities/backupable_db.h>

#include "glean/rocksdb/rocksdb.h"
#include "glean/rocksdb/stats.h"
#ifdef FACEBOOK
#include "glean/facebook/rocksdb/rocksdb.h"
#endif
#include "glean/rts/binary.h"
#include "glean/rts/factset.h"
#include "glean/rts/nat.h"

namespace facebook {
namespace glean {
namespace rocks {

using namespace rts;

namespace {

[[noreturn]] void error(const rocksdb::Status& s) {
  rts::error("rocksdb: " + s.ToString());
}

void check(const rocksdb::Status& status) {
  if (!status.ok()) {
    error(status);
  }
}

folly::ByteRange byteRange(const rocksdb::Slice& slice) {
  return folly::ByteRange(
    reinterpret_cast<const unsigned char *>(slice.data()), slice.size());
}

rocksdb::Slice slice(const folly::ByteRange& range) {
  return rocksdb::Slice(
    reinterpret_cast<const char *>(range.data()), range.size());
}

rocksdb::Slice slice(binary::Output& output) {
  return slice(output.bytes());
}

template<typename T>
rocksdb::Slice toSlice(const T& x) {
  return rocksdb::Slice(
    reinterpret_cast<const char *>(&x), sizeof(x));
}

template<typename T>
T fromSlice(const rocksdb::Slice& slice) {
  assert(slice.size() == sizeof(T));
  T x;
  std::memcpy(&x, slice.data(), slice.size());
  return x;
}

binary::Input input(const rocksdb::Slice& slice) {
  return binary::Input(byteRange(slice));
}

}


namespace {

struct Family {
private:
  template<typename F>
  Family(const char *n, F&& o)
    : index(families.size()), name(n), options(std::forward<F>(o))
  {
    families.push_back(this);
  }

  Family(const Family&) = delete;
  Family& operator=(const Family&) = delete;

  static std::vector<const Family *> families;

public:
  size_t index;
  const char *name;
  std::function<void(rocksdb::ColumnFamilyOptions&)> options;

  static const Family admin;
  static const Family entities;
  static const Family keys;
  static const Family stats;
  static const Family meta;

  static size_t count() { return families.size(); }

  static const Family * FOLLY_NULLABLE family(const std::string& name) {
    for (auto p : families) {
      if (name == p->name) {
        return p;
      }
    }
    return nullptr;
  }

  static const Family * FOLLY_NULLABLE family(size_t i) {
    return i < families.size() ? families[i] : nullptr;
  }
};

std::vector<const Family *> Family::families;

const Family Family::admin("admin", [](auto& opts){
  opts.OptimizeForPointLookup(100); });
const Family Family::entities("entities", [](auto& opts){
  // NOTE: Setting inplace_update_support=true leads to rocksdb assertion
  // failures when iteration backwards.
  opts.inplace_update_support = false;
  opts.OptimizeForPointLookup(100); });
const Family Family::keys("keys", [](auto& opts) {
  opts.prefix_extractor.reset(
    rocksdb::NewFixedPrefixTransform(sizeof(Id::word_type))); });
const Family Family::stats("stats", [](auto& opts) {
  opts.OptimizeForPointLookup(10); });
const Family Family::meta("meta", [](auto&) {});

enum class AdminId : uint32_t {
  NEXT_ID,
  VERSION,
  STARTING_ID
};

const char *admin_names[] = {
  "NEXT_ID",
  "VERSION",
  "STARTING_ID"
};

struct ContainerImpl final : Container {
  Mode mode;
  rocksdb::WriteOptions writeOptions;
  std::unique_ptr<rocksdb::DB> db;
  std::vector<rocksdb::ColumnFamilyHandle *> families;

  ContainerImpl(
      const std::string& path,
      Mode m,
      folly::Optional<std::shared_ptr<Cache>> cache) {
    mode = m;
    rocksdb::Options options;
    if (mode == Mode::Create ) {
      options.error_if_exists = true;
      options.create_if_missing = true;
    } else {
      options.error_if_exists = false;
      options.create_if_missing = false;
    }

    options.inplace_update_support = true;
    options.allow_concurrent_memtable_write = false;

    {
      rocksdb::BlockBasedTableOptions table_options;
      if (cache) {
        table_options.block_cache = std::move(cache.value());
      }
      table_options.filter_policy.reset(
        rocksdb::NewBloomFilterPolicy(10, false));
      table_options.whole_key_filtering = true;
      options.table_factory.reset(
        rocksdb::NewBlockBasedTableFactory(table_options));
    }

#ifdef FACEBOOK
    localOptions(options);
#endif

    // options.IncreaseParallelism();
    // options.compression = rocksdb::CompressionType::kNoCompression;
    // writeOptions.sync = false;
    // writeOptions.disableWAL = true;

    families.resize(Family::count(), nullptr);
    std::vector<std::string> names;
    if (mode != Mode::Create) {
      check(rocksdb::DB::ListColumnFamilies(options,path,&names));
    }

    std::vector<rocksdb::ColumnFamilyDescriptor> existing;
    std::vector<rocksdb::ColumnFamilyHandle**> ptrs;
    for (const auto& name : names) {
      if (name != rocksdb::kDefaultColumnFamilyName) {
        if (auto family = Family::family(name)) {
          rocksdb::ColumnFamilyOptions opts(options);
          family->options(opts);
          existing.push_back(rocksdb::ColumnFamilyDescriptor(name, opts));
          ptrs.push_back(&families[family->index]);
        } else {
          rts::error("Unknown column family '{}'", name);
        }
      }
    }
    existing.push_back(
      rocksdb::ColumnFamilyDescriptor(
        rocksdb::kDefaultColumnFamilyName, options));
    ptrs.push_back(nullptr);

    std::vector<rocksdb::ColumnFamilyHandle*> hs;
    rocksdb::DB *db_ptr;
    check(rocksdb::DB::Open(
      options,
      path,
      existing,
      &hs,
      &db_ptr
    ));
    if (!db_ptr) {
      rts::error("got nullptr from rocksdb");
    } else {
      db.reset(db_ptr);
    }

    assert(hs.size() == ptrs.size());
    for (size_t i = 0; i < ptrs.size(); ++i) {
      if (ptrs[i] != nullptr) {
        *ptrs[i] = hs[i];
      } else {
        db->DestroyColumnFamilyHandle(hs[i]);
      }
    }

    for (size_t i = 0; i < families.size(); ++i) {
      if (families[i] == nullptr) {
        auto family = Family::family(i);
        assert(family != nullptr);

        rocksdb::ColumnFamilyOptions opts(options);
        family->options(opts);
        check(db->CreateColumnFamily(
          opts,
          family->name,
          &families[i]));
      }
    }
  }

  ContainerImpl(const ContainerImpl&) = delete;
  ContainerImpl(ContainerImpl&& other) = default;
  ContainerImpl& operator=(const ContainerImpl&) = delete;
  ContainerImpl& operator=(ContainerImpl&&) = delete;

  ~ContainerImpl() override {
    close();
  }

  void close() noexcept override {
    if (db) {
      for (auto handle : families) {
        if (handle) {
          try {
            db->DestroyColumnFamilyHandle(handle);
          } catch(const std::exception& e) {
            LOG(ERROR) << e.what();
          } catch(...) {
            LOG(ERROR) << "unknown error while closing column family";
          }
        }
      }
      families.resize(0);
      db.reset();
    }
  }

  void requireOpen() const {
    if (!db) {
      rts::error("rocksdb: database is closed");
    }
  }

  rocksdb::ColumnFamilyHandle *family(const Family& family) const {
    assert(family.index < families.size());
    return families[family.index];
  }


  void writeData(folly::ByteRange key, folly::ByteRange value) override {
    requireOpen();
    check(db->Put(
      writeOptions,
      family(Family::meta),
      slice(key),
      slice(value)));
  }

  bool readData(
      folly::ByteRange key,
      std::function<void(folly::ByteRange)> f) override {
    requireOpen();
    rocksdb::PinnableSlice val;
    auto s = db->Get(
      rocksdb::ReadOptions(),
      family(Family::meta),
      slice(key),
      &val);
    if (s.IsNotFound()) {
      return false;
    } else {
      check(s);
      f(byteRange(val));
      return true;
    }
  }

  void optimize() override {
    for (auto handle : families) {
      if (handle) {
        const auto nlevels = db->NumberLevels(handle);
        if (nlevels != 2) {
          rocksdb::CompactRangeOptions copts;
          copts.change_level = true;
          copts.target_level = 1;
          check(db->CompactRange(copts, handle, nullptr, nullptr));
        }
      }
    }
  }

  static std::unique_ptr<rocksdb::BackupEngine> backupEngine(
      const std::string& path) {
    rocksdb::BackupEngine *p;
    check(rocksdb::BackupEngine::Open(
      rocksdb::Env::Default(),
      rocksdb::BackupableDBOptions(path),
      &p));
    return std::unique_ptr<rocksdb::BackupEngine>(p);
  }

  void backup(const std::string& path) override {
    requireOpen();
    check(backupEngine(path)->CreateNewBackup(db.get(), true));
  }

  std::unique_ptr<Database> openDatabase(Id start, int32_t version) && override;
};

struct DatabaseImpl final : Database {
  int64_t db_version;
  ContainerImpl container_;
  Id starting_id;
  Id next_id;
  AtomicPredicateStats stats_;

  explicit DatabaseImpl(ContainerImpl c, Id start, int64_t version)
      : container_(std::move(c)) {
    starting_id = Id::fromWord(getAdminValue(
      AdminId::STARTING_ID,
      start.toWord(),
      container_.mode == Mode::Create,
      []{}));

    next_id = Id::fromWord(getAdminValue(
      AdminId::NEXT_ID,
      start.toWord(),
      container_.mode == Mode::Create,
      [mode = container_.mode] {
        if (mode != Mode::Create) {
          rts::error("corrupt database - missing NEXT_ID");
        }
      }));

    db_version = getAdminValue(
      AdminId::VERSION,
      version,
      container_.mode == Mode::Create,
      []{});

    if (db_version != version) {
      rts::error("unexpected database version {}", db_version);
    }

    stats_.set(loadStats());
  }

  DatabaseImpl(const DatabaseImpl&) = delete;
  DatabaseImpl& operator=(const DatabaseImpl&) = delete;
  DatabaseImpl(DatabaseImpl&&) = delete;
  DatabaseImpl& operator=(DatabaseImpl&&) = delete;

  Container& container() noexcept override {
    return container_;
  }

  template<typename T, typename F>
  T getAdminValue(AdminId id, T def, bool write, F&& notFound) {
    container_.requireOpen();
    rocksdb::PinnableSlice val;
    binary::Output key;
    key.fixed(id);
    auto s = container_.db->Get(
      rocksdb::ReadOptions(),
      container_.family(Family::admin),
      slice(key),
      &val);
    if (!s.IsNotFound()) {
      check(s);
      binary::Input value = input(val);
      auto result = value.fixed<T>();
      if (!value.empty()) {
        rts::error("corrupt database - invalid {}",
          admin_names[static_cast<uint32_t>(id)]);
      }
      return result;
    } else {
      notFound();
      if (write) {
        binary::Output value;
        value.fixed(def);
        check(container_.db->Put(
          container_.writeOptions,
          container_.family(Family::admin),
          slice(key),
          slice(value)));
      }
      return def;
    }
  }

  PredicateStats loadStats() {
    container_.requireOpen();
    PredicateStats stats;
    std::unique_ptr<rocksdb::Iterator> iter(
      container_.db->NewIterator(
        rocksdb::ReadOptions(),
        container_.family(Family::stats)
      )
    );
    if (!iter) {
      rts::error("rocksdb: couldn't allocate iterator");
    }

    for (iter->SeekToFirst(); iter->Valid(); iter->Next()) {
      binary::Input key(byteRange(iter->key()));
      stats[key.fixed<Pid>()] = fromSlice<MemoryStats>(iter->value());
      assert(key.empty());
    }
    auto s = iter->status();
    if (!s.IsNotFound()) {
      check(s);
    }
    return stats;
  }

  rts::Id startingId() const override {
    return starting_id;
  }

  rts::Id firstFreeId() const override {
    return next_id;
  }

  Id idByKey(Pid type, folly::ByteRange key) override {
    if (count(type).high() == 0) {
      return Id::invalid();
    }

    container_.requireOpen();
    rocksdb::PinnableSlice out;
    binary::Output k;
    k.fixed(type);
    k.put(key);
    auto s = container_.db->Get(
      rocksdb::ReadOptions(),
      container_.family(Family::keys),
      slice(k),
      &out);
    if (s.IsNotFound()) {
      return Id::invalid();
    } else {
      check(s);
      binary::Input value = input(out);
      auto id = value.fixed<Id>();
      assert(value.empty());
      return id;
    }
  }

  bool lookupById(Id id, rocksdb::PinnableSlice &val) const {
    if (id < startingId() || id >= firstFreeId()) {
      return false;
    }
    binary::Output key;
    if (db_version <= 2) {
      key.fixed(id);
    } else {
      key.nat(id.toWord());
    }
    val.Reset();
    auto s = container_.db->Get(
      rocksdb::ReadOptions(),
      container_.family(Family::entities),
      slice(key),
      &val
    );
    if (s.IsNotFound()) {
      return false;
    } else {
      check(s);
      return true;
    }
  }

  static rts::Fact::Ref decomposeFact(Id id, const rocksdb::Slice& data) {
    auto inp = input(data);
    const auto ty = inp.packed<Pid>();
    const auto key_size = inp.packed<uint32_t>();
    return
      rts::Fact::Ref{id, ty, rts::Fact::Clause::from(inp.bytes(), key_size)};
  }

  Pid typeById(Id id) override {
    container_.requireOpen();
    rocksdb::PinnableSlice val;
    if (lookupById(id, val)) {
      return input(val).packed<Pid>();
    } else {
      return Pid::invalid();
    }
  }

  bool factById(Id id, std::function<void(Pid, Fact::Clause)> f) override {
    container_.requireOpen();
    rocksdb::PinnableSlice val;
    if (lookupById(id, val)) {
      auto ref = decomposeFact(id, val);
      f(ref.type, ref.clause);
      return true;
    } else {
      return false;
    }
  }

  struct SeekIterator final : rts::FactIterator {
    SeekIterator(
        folly::ByteRange start,
        size_t prefix_size,
        Pid type,
        const DatabaseImpl *db)
      : upper_bound_(binary::lexicographicallyNext({start.data(), prefix_size}))
      , upper_bound_slice_(
          reinterpret_cast<const char *>(upper_bound_.data()),
          upper_bound_.size())
      , type_(type)
      , db_(db)
    {
      assert(prefix_size <= start.size());
      // both upper_bound_slice_ and options_ need to be alive for the duration
      // of the iteration
      options_.iterate_upper_bound = &upper_bound_slice_;
      iter_.reset(
        db->container_.db->NewIterator(
          options_,
          db->container_.family(Family::keys)));
      if (iter_) {
        iter_->Seek(slice(start));
      } else {
        rts::error("rocksdb: couldn't allocate iterator");
      }
    }

    void next() override {
      iter_->Next();
      auto s = iter_->status();
      if (!s.IsNotFound()) {
        check(s);
      }
    }

    Fact::Ref get(Demand demand) override {
      if (iter_->Valid()) {
        auto key = input(iter_->key());
        auto ty = key.fixed<Pid>();
        assert(ty == type_);
        auto value = input(iter_->value());
        auto id = value.fixed<Id>();
        assert(value.empty());

        if (demand == KeyOnly) {
          return Fact::Ref{id, type_, Fact::Clause::fromKey(key.bytes())};
        } else {
          auto found = db_->lookupById(id, slice_);
          assert(found);
          return decomposeFact(id, slice_);
        }
      } else {
        return Fact::Ref::invalid();
      }
    }

    const std::vector<unsigned char> upper_bound_;
    const rocksdb::Slice upper_bound_slice_;
    const Pid type_;
    rocksdb::ReadOptions options_;
    std::unique_ptr<rocksdb::Iterator> iter_;
    const DatabaseImpl *db_;
    rocksdb::PinnableSlice slice_;
  };

  std::unique_ptr<rts::FactIterator> seek(
      Pid type, folly::ByteRange start, size_t prefix_size) override {
    assert(prefix_size <= start.size());
    if (count(type).high() == 0) {
      return std::make_unique<EmptyIterator>();
    }

    container_.requireOpen();
    binary::Output out;
    out.fixed(type);
    const auto type_size = out.size();
    out.put(start);
    return std::make_unique<SeekIterator>(
      out.bytes(),
      type_size + prefix_size,
      type,
      this);
  }

  // Legacy DBs don't store fact ids as 8 byte little-endian numbers so we can't
  // seek over those in lexicographic order. Instead, just look up each fact id
  // in the DB (much slower).
  template<typename Direction>
  struct LegacyEnumerateIterator final : rts::FactIterator {
    LegacyEnumerateIterator(Id from, Id stop, const DatabaseImpl *db)
        : stop_(stop)
        , db_(db) {
      find(from);
    }

    void next() override {
      find(Direction::advance(id_));
    }

    Fact::Ref get(Demand) override {
      return Direction::more(id_, stop_)
        ? decomposeFact(id_, slice_)
        : Fact::Ref::invalid();
    }

    void find(Id from) {
      for (id_ = from;
          Direction::more(id_, stop_) && !db_->lookupById(id_, slice_);
          id_ = Direction::advance(id_))
      {}
    }

    Id id_;
    Id stop_;
    const DatabaseImpl *db_;
    rocksdb::PinnableSlice slice_;
  };

  template<typename Direction>
  struct EnumerateIterator final : rts::FactIterator {
    static std::vector<char> encode(Id id) {
      std::vector<char> v(rts::MAX_NAT_SIZE);
      const auto n = rts::storeNat(
        reinterpret_cast<unsigned char *>(v.data()),
        id.toWord());
      v.resize(n);
      return v;
    }

    explicit EnumerateIterator(Id start, Id bound, const DatabaseImpl *db)
      : bound_(encode(bound))
      , bound_slice_(bound_.data(), bound_.size())
    {
      // both the slice and options_ need to be alive for the duration
      // of the iteration
      options_.*Direction::iterate_bound = &bound_slice_;
      iter_.reset(
        db->container_.db->NewIterator(
          options_,
          db->container_.family(Family::entities)));

      auto st = encode(start);
      if (iter_) {
        (iter_.get()->*Direction::seek)({st.data(), st.size()});
      } else {
        rts::error("rocksdb: couldn't allocate iterator");
      }
    }

    void next() override {
      (iter_.get()->*Direction::next)();
      auto s = iter_->status();
      if (!s.IsNotFound()) {
        check(s);
      }
    }

    Fact::Ref get(Demand demand) override {
      return iter_->Valid()
        ? decomposeFact(
            Id::fromWord(
              loadTrustedNat(
                reinterpret_cast<const unsigned char *>(
                  iter_->key().data())).first),
                  iter_->value())
        : Fact::Ref::invalid();
    }
    const std::vector<char> bound_;
    const rocksdb::Slice bound_slice_;
    rocksdb::ReadOptions options_;
    std::unique_ptr<rocksdb::Iterator> iter_;
  };

  struct Forward {
    static std::pair<Id,Id> bounds(
        Id from, Id upto, Id starting_id, Id next_id) {
      if (from >= next_id || (upto && upto <= starting_id)) {
        return {Id::invalid(), Id::invalid()};
      } else {
        return {
          std::max(from, starting_id),
          upto && upto <= next_id ? upto : next_id
        };
      }
    }

    static inline constexpr auto iterate_bound =
      &rocksdb::ReadOptions::iterate_upper_bound;
    static inline constexpr auto seek = &rocksdb::Iterator::Seek;
    static inline constexpr auto next = &rocksdb::Iterator::Next;

    // legacy iterator support
    static Id advance(Id id) { return id + 1; }
    static bool more(Id current, Id stop) { return current < stop; }
  };

  struct Backward {
    static std::pair<Id,Id> bounds(
        Id from, Id downto, Id starting_id, Id next_id) {
      if (downto >= next_id || (from && from <= starting_id)) {
        return {Id::invalid(), Id::invalid()};
      } else {
        return {
          (from && from <= next_id ? from : next_id) - 1,
          std::max(downto, starting_id)
        };
      }
    }

    static inline constexpr auto iterate_bound =
      &rocksdb::ReadOptions::iterate_lower_bound;
    static inline constexpr auto seek = &rocksdb::Iterator::SeekForPrev;
    static inline constexpr auto next = &rocksdb::Iterator::Prev;

    // legacy iterator support
    static Id advance(Id id) { return id - 1; }
    static bool more(Id current, Id stop) { return current >= stop; }
  };

  template<typename Direction>
  std::unique_ptr<rts::FactIterator> makeEnumerateIterator(Id from, Id to) {
    container_.requireOpen();
    const auto [start, bound] = Direction::bounds(
      from, to, startingId(), firstFreeId());
    if (!start) {
      return std::make_unique<rts::EmptyIterator>();
    } else if (db_version <= 2) {
      return std::make_unique<LegacyEnumerateIterator<Direction>>(
        start, bound, this);
    } else {
      return std::make_unique<EnumerateIterator<Direction>>(start, bound, this);
    }
  }

  std::unique_ptr<rts::FactIterator> enumerate(Id from, Id upto) override {
    return makeEnumerateIterator<Forward>(from, upto);
  }

  std::unique_ptr<rts::FactIterator> enumerateBack(
      Id from, Id downto) override {
    return makeEnumerateIterator<Backward>(from, downto);
  }

  rts::Interval count(Pid pid) const override {
    return stats_.count(pid);
  }

  PredicateStats stats() const override {
    return stats_.get();
  }

  void commit(rts::FactSet& facts) override {
    container_.requireOpen();

    if (facts.empty()) {
      return;
    }

    if (facts.startingId() < next_id) {
      rts::error("batch inserted out of sequence ({} < {})",
        facts.startingId(),
        next_id);
    }

    rocksdb::WriteBatch batch;

    // NOTE: We do *not* support concurrent writes so we don't need to protect
    // stats_ here because nothing should be able to replace it while we're
    // running
    const auto& old_stats = stats_.unprotected();
    PredicateStats new_stats(old_stats);

    for (auto iter = facts.enumerate(); auto fact = iter->get(); iter->next()) {
      assert(fact.id >= next_id);

      uint64_t mem = 0;
      auto put = [&](auto family, const auto& key, const auto& value) {
        check(batch.Put(
          family,
          key,
          value
        ));
        mem += key.size();
        mem += value.size();
      };

      {
        binary::Output k;
        if (db_version <= 2) {
          k.fixed(fact.id);
        } else {
          k.nat(fact.id.toWord());
        }
        binary::Output v;
        v.packed(fact.type);
        v.packed(fact.clause.key_size);
        v.put({fact.clause.data, fact.clause.size()});

        put(container_.family(Family::entities), slice(k), slice(v));
      }

      {
        binary::Output k;
        k.fixed(fact.type);
        k.put(fact.key());
        binary::Output v;
        v.fixed(fact.id);

        put(container_.family(Family::keys), slice(k), slice(v));
      }

      new_stats[fact.type] += MemoryStats::one(mem);
    }

    const auto first_free_id = facts.firstFreeId();
    check(batch.Put(
      container_.family(Family::admin),
      toSlice(AdminId::NEXT_ID),
      toSlice(first_free_id)));

    for (const auto& x : new_stats) {
      if (x.second != old_stats.get(x.first)) {
        check(batch.Put(
          container_.family(Family::stats),
          toSlice(x.first.toWord()),
          toSlice(x.second)));
      }
    }

    check(container_.db->Write(container_.writeOptions, &batch));
    next_id = first_free_id;

    stats_.set(std::move(new_stats));
  }
};

std::unique_ptr<Database> ContainerImpl::openDatabase(
    Id start, int32_t version) && {
  return std::make_unique<DatabaseImpl>(std::move(*this), start, version);
}

}

std::unique_ptr<Container> open(
    const std::string& path,
    Mode mode,
    folly::Optional<std::shared_ptr<Cache>> cache) {
  return std::make_unique<ContainerImpl>(path, mode, std::move(cache));
}

std::shared_ptr<Cache> newCache(size_t capacity) {
  return rocksdb::NewLRUCache(capacity);
}

void restore(const std::string& target, const std::string& source) {
  check(
    ContainerImpl::backupEngine(source)
    ->RestoreDBFromLatestBackup(target,target));
}

}
}
}