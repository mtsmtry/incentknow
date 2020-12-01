module Incentknow.Main where

import Prelude

import Control.Coroutine as CR
import Control.Coroutine.Aff (emit)
import Control.Coroutine.Aff as CoroutineAff
import Data.Foldable (traverse_)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Aff.AVar as AVar
import Effect.Class (liftEffect)
import Effect.Console (log)
import Halogen as H
import Halogen.Aff as HA
import Halogen.VDom.Driver (runUI)
import Incentknow.AppM (runAppM)
import Incentknow.Router as Router
import Routing.PushState (makeInterface)
import Web.Event.EventTarget (addEventListener, eventListener)
import Web.HTML (window)
import Web.HTML.Event.PopStateEvent as HCE
import Web.HTML.Event.PopStateEvent.EventTypes as HCET
import Web.HTML.Location (pathname, search)
import Web.HTML.Window as Window


-- A producer coroutine that emits messages whenever the window emits a
-- `hashchange` event.
popStateProducer :: CR.Producer HCE.PopStateEvent Aff Unit
popStateProducer = CoroutineAff.produce \emitter -> do
  listener <- eventListener (traverse_ (emit emitter) <<< HCE.fromEvent)
  liftEffect $
    window
      >>= Window.toEventTarget
      >>> addEventListener HCET.popstate listener false

-- A consumer coroutine that takes the `query` function from our component IO
-- record and sends `ChangeRoute` queries in when it receives inputs from the
-- producer.
popStateConsumer
  :: (forall a. Router.Query a -> Aff (Maybe a))
  -> CR.Consumer HCE.PopStateEvent Aff Unit
popStateConsumer query = CR.consumer \event -> do
  path <- liftEffect $ window >>= Window.location >>= pathname
  params <- liftEffect $ window >>= Window.location >>= search
  let url = path <> params
  H.liftEffect $ log url
  void $ query $ H.tell $ Router.ChangeRoute url
  pure Nothing

main :: Effect Unit
main = HA.runHalogenAff do
  globalMessage <- AVar.empty
  pushStateInterface <- H.liftEffect $ makeInterface
  let
    environment = { globalMessage, pushStateInterface }
    component = H.hoist (runAppM environment) Router.component
  body <- HA.awaitBody
  io <- runUI component unit body
  CR.runProcess (popStateProducer CR.$$ popStateConsumer io.query)
