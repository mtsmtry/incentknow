module Incentknow.Organisms.Material.SlotEditor where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (MaterialType)
import Incentknow.Data.Ids (MaterialDraftId)
import Incentknow.Data.Property (MaterialObject(..), fromJsonToMaterialObject, fromMaterialObjectToJson, getMaterialObjectId, toMaterialObjectFromDraftId)
import Incentknow.Organisms.Material.EditorFromDraft as EditorFromDraft

type Input 
  = { value :: Maybe Json, materialType :: MaterialType }

type Output
    = Maybe Json

type State
  = { materialObject :: Maybe Json
    , materialType :: MaterialType
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeDraftId MaterialDraftId

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( editor :: EditorFromDraft.Slot Unit
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
  , materialType: input.materialType
  }

editor_ = SProxy :: SProxy "editor"

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.slot (SProxy :: SProxy "editor") unit EditorFromDraft.component 
    { value: case map fromJsonToMaterialObject state.materialObject of 
        Just (MaterialObjectDraft draft) -> Just draft
        _ -> Nothing
    , materialType: state.materialType
    } (Just <<< ChangeDraftId)

handleAction :: forall m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  HandleInput input -> do
    state <- H.get
    when (map getMaterialObjectId state.materialObject /= map getMaterialObjectId input.value) do
      H.put $ initialState input
  Initialize -> pure unit
  ChangeDraftId draftId -> do
    -- H.modify_ _ { materialObject = Just draftId }
    H.raise $ Just $ fromMaterialObjectToJson $ toMaterialObjectFromDraftId draftId
  