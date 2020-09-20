module JsonRPC where

import Prelude

import Control.Coroutine as CR
import Control.Coroutine.Aff (close, emit)
import Control.Coroutine.Aff as CRA
import Control.Monad.Except (runExcept)
import Data.Argonaut.Core (Json, jsonNull, stringify)
import Data.Argonaut.Decode (decodeJson, getField)
import Data.Argonaut.Encode (encodeJson)
import Data.Argonaut.Parser (jsonParser)
import Data.Either (Either(..), either)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff, Error, runAff_)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Random (randomInt)
import Foreign (F, Foreign, unsafeToForeign, readString)
import Foreign.Object as Object
import Halogen.Aff (runHalogenAff)
import Web.Event.EventTarget as EET
import Web.Socket.Event.EventTypes as WSET
import Web.Socket.Event.MessageEvent as ME
import Web.Socket.WebSocket as WS

genId = randomInt 0 1000000000

notify :: WS.WebSocket -> String -> Json -> Effect Unit
notify socket method params = do
  id <- liftEffect genId
  let
    values =
      [ Tuple "jsonrpc" $ encodeJson "2.0"
      , Tuple "method" $ encodeJson method
      , Tuple "params" $ params
      , Tuple "id" $ encodeJson id
      ]
  let
    request = stringify $ encodeJson $ Object.fromFoldable values
  WS.sendString socket request

request :: forall m. WS.WebSocket -> String -> Json -> (Either Error Json -> Effect Unit) -> Effect Unit
request socket method params callback = do
  id <- genId
  let
    values =
      [ Tuple "jsonrpc" $ encodeJson "2.0"
      , Tuple "method" $ encodeJson method
      , Tuple "params" $ params
      , Tuple "id" $ encodeJson id
      ]
  let
    request = stringify $ encodeJson $ Object.fromFoldable values
  WS.sendString socket request
  runAff_ callback $ CR.runProcess (wsProducer socket id CR.$$ CR.await)

getResponse msg = do
  json <- jsonParser msg
  response <- decodeJson json
  responseId <- getField response "id"
  result <- getField response "result"
  pure { id: responseId, result: result }

wsProducer :: WS.WebSocket -> Int -> CR.Producer Json Aff Json
wsProducer socket id = do
  CRA.produce \emitter -> do
    listener <-
      EET.eventListener \ev -> do
        for_ (ME.fromEvent ev) \msgEvent ->
          for_ (readHelper readString (ME.data_ msgEvent)) \msg -> do
            case getResponse msg of
              Right response ->
                if response.id == id then
                  close emitter response.result
                else
                  emit emitter jsonNull
              Left _ -> emit emitter jsonNull
    EET.addEventListener
      WSET.onMessage
      listener
      false
      (WS.toEventTarget socket)
  where
  readHelper :: forall a b. (Foreign -> F a) -> b -> Maybe a
  readHelper read = either (const Nothing) Just <<< runExcept <<< read <<< unsafeToForeign