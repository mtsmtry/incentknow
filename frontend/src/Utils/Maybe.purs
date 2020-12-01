module Data.Maybe.Utils where

import Prelude

import Data.Array (cons, uncons)
import Data.Either (Either, either)
import Data.Maybe (Maybe(..))

flatten :: forall a. Maybe (Maybe a) -> Maybe a
flatten = case _ of
  Just (Just x) -> Just x
  _ -> Nothing

allJust :: forall a. Array (Maybe a) -> Maybe (Array a)
allJust array = case uncons array of
  Just { head: Just head, tail: tail } -> map (cons head) $ allJust tail
  Just { head: Nothing, tail: tail } -> Nothing
  _ -> Just []

fromEither :: forall l r. Either l r -> Maybe r
fromEither = either (const Nothing) (\x-> Just x)