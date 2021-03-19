-- | Collecting the variables mentioned by a term
module Glean.Query.Vars (
    VarSet,
    varsOf
  ) where

import qualified Data.IntSet as IntSet
import Data.IntSet (IntSet)

import Glean.Query.Codegen
import Glean.Query.Flatten.Types
import Glean.RTS.Term hiding (Match(..))

type VarSet = IntSet

class VarsOf a where
  varsOf :: a -> VarSet -> VarSet

instance VarsOf FlatStatement where
  varsOf (FlatStatement _ lhs rhs) r = varsOf lhs (varsOf rhs r)
  varsOf (FlatDisjunction stmtss) r = foldr varsStmts r stmtss
    where varsStmts stmts r = foldr (\g r -> foldr varsOf r g) r stmts

instance VarsOf Generator where
  varsOf (FactGenerator _ key val) r = varsOf key $! varsOf val r
  varsOf (TermGenerator exp) r = varsOf exp r
  varsOf (DerivedFactGenerator _ key val) r = varsOf key $! varsOf val r
  varsOf (ArrayElementGenerator _ arr) r = varsOf arr r
  varsOf (PrimCall _ args) r = foldr varsOf r args

instance VarsOf m => VarsOf (Term m) where
  varsOf t r = case t of
    Byte{} -> r
    Nat{} -> r
    ByteArray{} -> r
    String{} -> r
    Ref x -> varsOf x r
    Tuple xs -> foldr varsOf r xs
    Array xs -> foldr varsOf r xs
    Alt _ x -> varsOf x r

instance VarsOf (Match () Var) where
  varsOf m r = case m of
    MatchWild{} -> r
    MatchNever{} -> r
    MatchFid{} -> r
    MatchBind (Var _ v _) -> IntSet.insert v r
    MatchVar (Var _ v _) -> IntSet.insert v r
    MatchAnd a b -> varsOf a $! varsOf b r
    MatchPrefix _ t -> varsOf t r
    MatchSum alts -> foldr varsOf r [ t | Just t <- alts ]
    MatchExt{} -> r