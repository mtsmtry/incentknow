module Incentknow.Template where

import Prelude
import Data.Maybe (Maybe(..))
import Halogen as H
import Halogen.HTML as HH

type Input
  = {}

type State
  = {}

data Action
  = Initialize
  | HandleInput Input

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()


-- initialize: 再レンダリングされたときに呼ばれる
-- receive: Inputが変更されたときに呼ばれる
component :: forall q o m. H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          $ H.defaultEval
              { initialize = Just Initialize
              , handleAction = handleAction
              , receive = Just <<< HandleInput
              }
    }

initialState :: Input -> State
initialState input = {}

render :: forall m. State -> H.ComponentHTML Action ChildSlots m
render state = HH.div [] []

handleAction :: forall o m. Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> pure unit
