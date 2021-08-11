module Incentknow.Organisms.Material.SlotEditor where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Data.Ids (MaterialDraftId)
import Incentknow.Data.Property (MaterialObject(..), toMaterialObjectFromDraftId)
import Incentknow.Organisms.Material.Editor as Editor
import Incentknow.Route (Route)

type Input 
  = { value :: Maybe MaterialObject }

type Output
    = Maybe MaterialObject

type State
  = { materialObject :: Maybe MaterialObject
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeDraftId MaterialDraftId

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( editor :: Editor.Slot Unit
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
  { materialObject: input.value
  }

editor_ = SProxy :: SProxy "editor"

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.slot (SProxy :: SProxy "editor") unit Editor.component 
    { value: case state.materialObject of 
        Just (MaterialObjectDraft draft) -> Just draft
        _ -> Nothing
    } (Just <<< ChangeDraftId)

changeRoute :: forall o m. Behaviour m => Route -> H.HalogenM State Action ChildSlots o m Unit
changeRoute route = do
  navigate route

handleAction :: forall m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  HandleInput input -> do
    state <- H.get
    H.put $ initialState input
  Initialize -> pure unit
  ChangeDraftId draftId -> do
    -- H.modify_ _ { materialObject = Just draftId }
    H.raise $ Just $ toMaterialObjectFromDraftId draftId
  