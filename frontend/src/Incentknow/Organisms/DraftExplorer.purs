module Incentknow.Organisms.DraftExplorer where

import Prelude

import Data.Array (catMaybes, foldr, length)
import Data.Array as A
import Data.DateTime.Utils (fromTimestampToString, toString)
import Data.Either (Either(..))
import Data.Map.Internal as M
import Data.Maybe (Maybe(..), maybe)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getMyContentDrafts, getMyMaterialDrafts)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (icon, remoteWith)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (FocusedFormat, RelatedContentDraft, RelatedMaterialDraft)
import Incentknow.Data.Ids (ContentDraftId, MaterialDraftId)
import Incentknow.HTML.Utils (css, link, whenElem)
import Incentknow.Route (EditContentTarget(..), EditMaterialTarget(..), EditTarget(..), Route(..))
import Incentknow.Templates.Page (sectionWithHeader)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { selectedDraftId :: Maybe (Either ContentDraftId MaterialDraftId) }

type State
  = { drafts :: Remote (Array (RelatedContentDraft))
    , materialDrafts :: Remote (Array (RelatedMaterialDraft))
    , selectedDraftId :: Maybe (Either ContentDraftId MaterialDraftId)
    }

type DraftSet
  = { format :: FocusedFormat
    , drafts :: Array (RelatedContentDraft)
    }

toDraftSets :: Array (RelatedContentDraft) -> Array DraftSet
toDraftSets drafts = catMaybes $ map (\(Tuple k v)-> map (\f-> { format: f, drafts: v }) $ M.lookup k formats) $ M.toUnfoldable draftsByFormat
  where
  draftsByFormat = foldr (\x-> M.alter (\v-> Just $ maybe [x] (\v2-> v2 <> [x]) v) x.format.formatId) M.empty drafts
  formatIds = A.fromFoldable $ M.keys formats
  formats = M.fromFoldable $ map (\x-> Tuple x.format.formatId x.format) drafts

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route
  | FetchedDrafts (Fetch (Array RelatedContentDraft))
  | FetchedMaterialDrafts (Fetch (Array RelatedMaterialDraft))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { drafts: Loading, materialDrafts: Loading, selectedDraftId: input.selectedDraftId }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  sectionWithHeader "org-draft-explorer"
    [ HH.text "Drafts" ]
    [ remoteWith state.drafts \drafts-> 
        HH.div [ css "box" ]
          (map renderDraftSet $ toDraftSets drafts)
    , remoteWith state.materialDrafts \drafts-> 
        whenElem (length drafts > 0) \_->
          HH.div [ css "box" ]
            [ renderMaterialDraftSet drafts ]
    ]
  where
  renderDraftSet :: DraftSet -> H.ComponentHTML Action ChildSlots m
  renderDraftSet item =
    HH.div [ css "draft-set" ]
      [ HH.div [ css "item" ] 
          [ icon "fas fa-caret-down"
          , HH.text $ item.format.space.displayName <> " - " <> item.format.displayName
          , link Navigate (EditDraft $ ContentTarget $ TargetBlank (Just item.format.space.spaceId) (Just item.format.currentStructure.structureId))
              [ css "creation" ]
              [ icon "far fa-plus-circle" ]
          ]
      , HH.div [ css "drafts" ]
          (map renderDraft item.drafts)
      ]

  renderDraft :: RelatedContentDraft -> H.ComponentHTML Action ChildSlots m
  renderDraft draft =
    HH.div [ css $ "draft" <> if Just (Left draft.draftId) == state.selectedDraftId then " selected" else "" ]
      [ link Navigate (EditDraft $ ContentTarget $ TargetDraft draft.draftId) []
          [ HH.text $ maybe (show $ fromTimestampToString draft.createdAt) _.text common.titleProperty 
          ]
      ]
    where
    common = getContentSemanticData draft.data draft.format

  renderMaterialDraftSet :: Array RelatedMaterialDraft -> H.ComponentHTML Action ChildSlots m
  renderMaterialDraftSet drafts =
    HH.div [ css "draft-set" ]
      [ HH.div [ css "item" ] 
          [ icon "fas fa-caret-down"
          , HH.text "Material"
          , link Navigate (EditDraft $ MaterialTarget $ MaterialTargetBlank Nothing)
              [ css "creation" ]
              [ icon "far fa-plus-circle" ]
          ]
      , HH.div [ css "drafts" ]
          (map renderMaterialDraft drafts)
      ]

  renderMaterialDraft :: RelatedMaterialDraft -> H.ComponentHTML Action ChildSlots m
  renderMaterialDraft draft =
    HH.div [ css $ "draft" <> if Just (Right draft.draftId) == state.selectedDraftId then " selected" else "" ]
      [ link Navigate (EditDraft $ MaterialTarget $ MaterialTargetDraft draft.draftId) []
          [ HH.text $ draft.displayName 
          ]
      ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    callbackQuery FetchedDrafts $ getMyContentDrafts
    callbackQuery FetchedMaterialDrafts $ getMyMaterialDrafts
  HandleInput input -> H.modify_ _ { selectedDraftId = input.selectedDraftId }
  Navigate event route -> navigateRoute event route
  FetchedDrafts fetch -> do
    forRemote fetch \drafts->
      H.modify_ _ { drafts = drafts }
  FetchedMaterialDrafts fetch -> do
    forRemote fetch \drafts->
      H.modify_ _ { materialDrafts = drafts }