module Incentknow.Organisms.Material.SlotEditor where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (MaterialData, MaterialType)
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
  = H.Slot Query Output p

type ChildSlots
  = ( editor :: EditorFromDraft.Slot Unit
    )

data Query a
  = GetUpdation (Tuple MaterialDraftId MaterialData -> a)

component :: forall m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML Query Input Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , handleAction = handleAction
            , handleQuery = handleQuery
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
  
handleQuery :: forall o m a. Query a -> H.HalogenM State Action ChildSlots o m (Maybe a)
handleQuery = case _ of
  GetUpdation k -> do
    result <- H.query (SProxy :: SProxy "editor") unit $ H.request EditorFromDraft.GetUpdation
    pure $ map k result
  