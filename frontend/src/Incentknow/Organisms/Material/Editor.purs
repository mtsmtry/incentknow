module Incentknow.Organisms.Material.Editor where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (MaterialData(..))
import Incentknow.Organisms.Document.Editor as DocumentEditor

type Input 
  = { value :: MaterialData }

type Output
    = MaterialData

type State
  = { data :: MaterialData
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeData MaterialData

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( documentEditor :: DocumentEditor.Slot Unit
    )

component :: forall q m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input =
  { data: input.value
  }

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  case state.data of
    DocumentMaterialData doc ->
      HH.slot (SProxy :: SProxy "documentEditor") unit DocumentEditor.component { value: doc }
        (Just <<< ChangeData <<< DocumentMaterialData)
    _ -> HH.text ""

handleAction :: forall m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  HandleInput input -> H.put $ initialState input
  Initialize -> pure unit
  ChangeData vl -> do
    H.modify_ _ { data = vl }
    H.raise vl