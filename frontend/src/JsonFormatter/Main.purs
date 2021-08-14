module JsonFormatter where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Foldable (traverse_)
import Data.Function.Uncurried (Fn2, runFn2)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Class (class MonadEffect, liftEffect)
import Halogen (RefLabel(..))
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Web.DOM (Element)

foreign import setFormatterImpl :: Fn2 Element Json (Effect Unit)

setFormatter :: Element -> Json -> Effect Unit
setFormatter element json = runFn2 setFormatterImpl element json

type Input
  = { value :: Json }

type State
  = { value :: Json }

data Action
  = Initialize
  | HandleInput Input

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. MonadEffect m =>  H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { value: input.value }

div_ :: RefLabel
div_ = RefLabel "div"

render :: forall m. State -> H.ComponentHTML Action ChildSlots m
render state = HH.div [ HP.ref div_ ] []

handleAction :: forall o m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    H.getRef div_
      >>= traverse_ \div-> do
        state <- H.get
        liftEffect $ setFormatter div state.value
  HandleInput input -> do
    state <- H.get
    when (input.value /= state.value) do
      H.getRef div_
        >>= traverse_ \div-> do
          H.modify_ _ { value = input.value }
          liftEffect $ setFormatter div input.value
