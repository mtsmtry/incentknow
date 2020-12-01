module Incentknow.Api.Utils where

import Prelude

import Affjax.RequestBody (RequestBody(..))
import Control.Promise (Promise, toAff)
import Data.Either (Either(..), either)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), maybe)
import Data.Nullable (Nullable)
import Data.Nullable as N
import Effect (Effect)
import Effect.Aff (Aff, attempt, forkAff)
import Effect.Aff.Class (class MonadAff, liftAff)
import Halogen (HalogenM(..), SubscriptionId)
import Halogen as H
import Halogen.Query.EventSource as ES
import Incentknow.AppM (class Behaviour, Message(..), message)
import Test.Unit.Console (consoleError)

foreign import showError :: forall a. a -> String

defaultIconUrl = ""

callApi :: forall a. Promise a -> Aff (Either String a)
callApi = toAff >>> attempt >>> (map $ either (showError >>> Left) Right) >>> liftAff

data Remote a
  = Loading
  | LoadingForServer
  | Holding a
  | Missing String

instance functorRemote :: Functor Remote where
  map f = case _ of
    Loading -> Loading
    LoadingForServer -> LoadingForServer
    Holding x -> Holding $ f x
    Missing msg -> Missing msg

derive instance rqRemote :: Eq a => Eq (Remote a)

foreign import toCallbackApi :: forall a. Promise a -> (a -> Effect Unit) -> Effect Unit

data Fetch a
  = FromCache a
  | FromServer a
  | FailedCache String
  | FailedServer String

toMaybe :: forall a. Remote a -> Maybe a
toMaybe = case _ of
  Loading -> Nothing
  LoadingForServer -> Nothing
  Holding item -> Just item
  Missing _ -> Nothing

forFetch :: forall a m. Behaviour m => Fetch a -> (Remote a -> m Unit) -> m Unit
forFetch fetch fun = do
  case fetch of
    FromCache item -> fun $ Holding item
    FromServer item -> fun $ Holding item
    FailedCache _ -> fun $ LoadingForServer
    FailedServer error -> do
      fun $ Missing error
      H.liftEffect $ consoleError $ "forFetch:" <> error

forFetchItem :: forall a m. Behaviour m => Fetch a -> (a -> m Unit) -> m Unit
forFetchItem fetch fun = do
  forFetch fetch \remote->
    for_ (toMaybe remote) \item->
      fun item

fetchApi :: forall state action slots output item m. MonadAff m => 
  (Fetch item -> action)
  -> Promise item
  -> HalogenM state action slots output m Unit
fetchApi action onChange = callbackApi (action <<< FromServer) $ toCallbackApi onChange

executeApi :: forall a m. Behaviour m => MonadAff m => Promise a -> m (Maybe a)
executeApi promise = do
  result <- H.liftAff $ callApi promise
  case result of
    Right response -> pure $ Just response
    Left error -> do
      message $ Error error
      pure Nothing

callbackApi :: forall state action slots output item m. MonadAff m => 
  (item -> action)
  -> ((item -> Effect Unit) -> Effect Unit)
  -> HalogenM state action slots output m Unit
callbackApi action onChange = do
  _ <- H.subscribe $ ES.effectEventSource \emitter-> do
    unsubscrive <- onChange (\item -> ES.emit emitter $ action item)
    mempty unsubscrive
  pure unit