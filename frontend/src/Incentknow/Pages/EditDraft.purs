module Incentknow.Pages.EditDraft where

import Prelude

import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Inputs (button)
import Incentknow.Data.Ids (ContentDraftId, MaterialDraftId)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.DraftExplorer as DraftExplorer
import Incentknow.Organisms.DraftHistory as DraftHistory
import Incentknow.Organisms.EditContent as EditContent
import Incentknow.Organisms.EditMaterial as EditMaterial
import Incentknow.Route (EditContentTarget(..), EditMaterialTarget(..), EditTarget(..), Route(..))
import Incentknow.Templates.Main (centerLayout)
import Incentknow.Templates.Page (section)

type State
  = { target :: EditTarget }

data Action
  = Initialize
  | HandleInput EditTarget
  | Navigate Route
  | ContentEvent EditContent.Output
  | MaterialEvent EditMaterial.Output

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( editContent :: EditContent.Slot Unit
    , editMaterial :: EditMaterial.Slot Unit
    , draftExplorer :: DraftExplorer.Slot Unit
    , draftHistory :: DraftHistory.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q EditTarget o m
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

initialState :: EditTarget -> State
initialState target = { target }

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  centerLayout 
    { css: "page-edit-draft"
    , leftSide: 
        [ HH.slot (SProxy :: SProxy "draftExplorer") unit DraftExplorer.component 
            { selectedDraftId:
                case state.target of
                  ContentTarget (TargetDraft draftId) -> Just (Left draftId)
                  MaterialTarget (MaterialTargetDraft draftId) -> Just (Right draftId)
                  _ -> Nothing
            } 
            absurd
        ]
    , rightSide:
        [ --HH.slot (SProxy :: SProxy "draftHistory") unit DraftHistory.component 
          --  { draftId: 
          --      case state.target of
          --        ContentTarget (TargetDraft draftId) -> Just draftId
          --        _ -> Nothing
          --  } absurd
        ]
    }
    [ section ("page-edit-draft-selector" <> if isContent then " selector-content" else " selector-material")
          [ button "New" (Navigate $ EditDraft $ ContentTarget $ TargetBlank Nothing Nothing)
         --, button "Material" (Navigate $ EditDraft $ MaterialTarget $ MaterialTargetBlank Nothing)
          ]
      , case state.target of
          ContentTarget target ->
            HH.slot (SProxy :: SProxy "editContent") unit EditContent.component target (Just <<< ContentEvent)
          MaterialTarget target ->
            HH.slot (SProxy :: SProxy "editMaterial") unit EditMaterial.component target (Just <<< MaterialEvent)
    ]
  where
  isContent = 
    case state.target of
      ContentTarget _ -> true
      MaterialTarget _ -> false

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput target -> do
    H.modify_ _ { target = target }
  ContentEvent (EditContent.UpdatedDraft draftId data2) -> do
    _ <- H.query (SProxy :: SProxy "draftExplorer") unit $ H.tell $ DraftExplorer.UpdateContentDraft draftId data2
    pure unit
  MaterialEvent (EditMaterial.UpdatedDraft draftId data2) -> do
    _ <- H.query (SProxy :: SProxy "draftExplorer") unit $ H.tell $ DraftExplorer.UpdateMaterialDraft draftId data2
    pure unit
  ContentEvent (EditContent.CreatedDraft draftId) -> do
    _ <- H.query (SProxy :: SProxy "draftExplorer") unit $ H.tell $ DraftExplorer.SelectItem $ Left draftId
    pure unit
  MaterialEvent (EditMaterial.CreatedDraft draftId) -> do
    _ <- H.query (SProxy :: SProxy "draftExplorer") unit $ H.tell $ DraftExplorer.SelectItem $ Right draftId
    pure unit
  Navigate route -> navigate route