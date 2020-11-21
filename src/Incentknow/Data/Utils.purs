module Incentknow.Data.Utils where

import Prelude

import Data.Array (range)
import Data.Maybe (fromMaybe)
import Data.String as String
import Data.String.CodeUnits (charAt, fromCharArray)
import Data.Traversable (for)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Random (randomInt)

generateId :: forall m. MonadEffect m => Int -> m String
generateId len = do
  let
    str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  seeds <- for (range 1 len) $ \_ -> liftEffect $ randomInt 0 (String.length str - 1)
  pure $ fromCharArray $ map (fromMaybe 'a' <<< flip charAt str) seeds