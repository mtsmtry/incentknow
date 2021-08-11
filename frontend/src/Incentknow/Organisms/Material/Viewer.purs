module Incentknow.Organisms.Material.Viewer where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Data.Entities (FocusedMaterial)
import Incentknow.Data.Property (MaterialObject)
import Incentknow.Molecules.PlainTextViewer as PlainTextViewer
import Incentknow.Route (Route)

type Input 
  = { value :: MaterialObject }

type State
  = { material :: MaterialObject
    }

data Action
  = Initialize
  | HandleInput Input

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( plainTextViewer :: PlainTextViewer.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
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
  { material: input.value
  }

editor_ = SProxy :: SProxy "editor"

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
   HH.slot (SProxy :: SProxy "plainTextViewer") unit PlainTextViewer.component { value: "" } absurd

changeRoute :: forall o m. Behaviour m => Route -> H.HalogenM State Action ChildSlots o m Unit
changeRoute route = do
  navigate route

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put $ initialState input