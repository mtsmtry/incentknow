module Data.Map.Utils where

import Prelude

import Affjax.RequestBody (RequestBody(..))
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode (decodeJson)
import Data.Array (concat, cons, filter, foldl, fromFoldable, length, singleton, uncons)
import Data.Either (Either)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Maybe.Utils (fromEither)
import Data.Tuple (Tuple(..))
import Foreign.Object as F

mergeFromArray :: forall a b. (a -> String) -> (b -> String) -> Array a -> Array b -> Map String (Tuple (Maybe a) (Maybe b))
mergeFromArray getAId getBId as bs = foldl add map1 bs
  where
  map1 :: Map String (Tuple (Maybe a) (Maybe b))
  map1 = M.fromFoldable $ map (\x -> Tuple (getAId x) $ Tuple (Just x) Nothing) as

  add :: Map String (Tuple (Maybe a) (Maybe b)) -> b -> Map String (Tuple (Maybe a) (Maybe b))
  add m b = M.alter (fun b) (getBId b) m

  fun :: b -> Maybe (Tuple (Maybe a) (Maybe b)) -> Maybe (Tuple (Maybe a) (Maybe b))
  fun b = case _ of
    Just (Tuple a _) -> Just $ Tuple a $ Just b
    Nothing -> Just $ Tuple Nothing $ Just b

decodeToMap :: Json -> Maybe (Map String Json)
decodeToMap json = fromEither $ do
  obj <- decodeJson json
  pure $ M.fromFoldable $ (F.toUnfoldable obj :: Array _)
