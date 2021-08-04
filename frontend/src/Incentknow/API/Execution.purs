module Incentknow.API.Execution where

import Prelude

import Control.Promise (Promise, toAff)
import Data.Either (Either(..), either)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Aff, attempt)
import Effect.Aff.Class (class MonadAff, liftAff)
import Halogen (HalogenM)
import Halogen as H
import Halogen.Query.EventSource as ES
import Incentknow.AppM (class Behaviour, Message(..), message)
import Test.Unit.Console (consoleError)

{- 
  Functions to execute an API

  Functions that starts with "__" are used from only auto generated API code or them.
-}

-- An API to query including method name to using caches
data QueryAPI a
  = QueryAPI String (Promise a)

instance mapQueryAPI :: Functor QueryAPI where
  map f (QueryAPI name api) = QueryAPI name $ mapPromise f api

-- Create a query API
__queryAPI :: forall a. String -> Promise a -> QueryAPI a
__queryAPI name api = QueryAPI name (__runAPI name api)

-- An API to command
data CommandAPI a
  = CommandAPI (Promise a)

instance mapCommandAPI :: Functor CommandAPI where
  map f (CommandAPI api) = CommandAPI $ mapPromise f api

-- Create a command API
__commandAPI :: forall a. String -> Promise a -> CommandAPI a
__commandAPI name api = CommandAPI (__runAPI name api)

-- Preprocess and postprocess of only access to the server
__runAPI :: forall a. String -> Promise a -> Promise a
__runAPI name api = api

-- A type to fetch from the server or cache that can return a value once or twice
type Callback a
  = (a -> Effect Unit) -> Effect Unit

-- Query using caches
--foreign import query :: forall a. QueryAPI a -> Callback a

-- Fetched item with fetching property
data Remote a
  = Loading
  | LoadingForServer
  | Holding a
  | Missing String

-- Returned response from a query
data Fetch a
  = FromCache a
  | FromServer a
  | FailedCache String
  | FailedServer String

foreign import showError :: forall a. a -> String

defaultIconUrl :: String
defaultIconUrl = ""

foreign import makeQueryCallback :: forall a. String -> Promise a -> Callback { result :: a, from :: String } 

toQueryCallback :: forall a. QueryAPI a -> Callback (Fetch a)
toQueryCallback (QueryAPI name api) = mapCallback toFetch $ makeQueryCallback name api

toFetch :: forall a. { result :: a, from :: String } -> Fetch a
toFetch { result, from } = case from of
  "server" -> FromServer result
  "sache" -> FromCache result
  _ -> FailedServer ""

callQuery :: forall a. QueryAPI a -> Aff (Either String a)
callQuery (QueryAPI name api) = callAPI api

callCommand :: forall a. CommandAPI a -> Aff (Either String a)
callCommand (CommandAPI api) = callAPI api

callAPI :: forall a. Promise a -> Aff (Either String a)
callAPI = toAff >>> attempt >>> (map $ either (showError >>> Left) Right) >>> liftAff

foreign import mapPromise :: forall a b. (a -> b) -> Promise a -> Promise b

mapCallback :: forall a b. (a -> b) -> Callback a -> Callback b
mapCallback f callback fun = callback $ fun <<< f

promptCallback :: forall a. a -> Callback a
promptCallback item fun = fun item

instance functorRemote :: Functor Remote where
  map f = case _ of
    Loading -> Loading
    LoadingForServer -> LoadingForServer
    Holding x -> Holding $ f x
    Missing msg -> Missing msg

derive instance rqRemote :: Eq a => Eq (Remote a)

toMaybe :: forall a. Remote a -> Maybe a
toMaybe = case _ of
  Loading -> Nothing
  LoadingForServer -> Nothing
  Holding item -> Just item
  Missing _ -> Nothing

forRemote :: forall a m. Behaviour m => Fetch a -> (Remote a -> m Unit) -> m Unit
forRemote fetch fun = do
  case fetch of
    FromCache item -> fun $ Holding item
    FromServer item -> fun $ Holding item
    FailedCache _ -> fun $ LoadingForServer
    FailedServer error -> do
      fun $ Missing error
      H.liftEffect $ consoleError $ "forRemomee:" <> error

forItem :: forall a m. Behaviour m => Fetch a -> (a -> m Unit) -> m Unit
forItem fetch fun = do
  forRemote fetch \remote ->
    for_ (toMaybe remote) \item ->
      fun item

callbackQuery ::
  forall state action slots output item m.
  MonadAff m =>
  (Fetch item -> action) ->
  QueryAPI item ->
  HalogenM state action slots output m Unit
callbackQuery action query = callbackAPI action $ toQueryCallback query

executeCommand :: forall a m. Behaviour m => MonadAff m => CommandAPI a -> m (Maybe a)
executeCommand (CommandAPI api) = executeAPI api

executeAPI :: forall a m. Behaviour m => MonadAff m => Promise a -> m (Maybe a)
executeAPI promise = do
  result <- H.liftAff $ callAPI promise
  case result of
    Right response -> pure $ Just response
    Left error -> do
      message $ Error error
      pure Nothing

callbackAPI ::
  forall state action slots output item m.
  MonadAff m =>
  (item -> action) ->
  Callback item ->
  HalogenM state action slots output m Unit
callbackAPI action onChange = do
  _ <-
    H.subscribe
      $ ES.effectEventSource \emitter -> do
          unsubscrive <- onChange (\item -> ES.emit emitter $ action item)
          mempty unsubscrive
  pure unit
