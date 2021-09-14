module Incentknow.Organisms.DraftExplorer where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Array (catMaybes, foldr, length)
import Data.Array as A
import Data.DateTime.Utils (fromTimestampToString)
import Data.Either (Either(..))
import Data.Map.Internal as M
import Data.Maybe (Maybe(..), maybe)
import Data.String (joinWith, take, trim)
import Data.String as S
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Incentknow.API (cancelContentDraft, cancelMaterialDraft, getMyContentDrafts, getMyMaterialDrafts)
import Incentknow.API.Execution (Fetch, Remote(..), callCommand, callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.Atoms.Icon (icon, remoteWith)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (FocusedFormat, MaterialData(..), RelatedContentDraft, RelatedMaterialDraft)
import Incentknow.Data.EntityUtils (getBlockDataOptions)
import Incentknow.Data.Ids (ContentDraftId, MaterialDraftId)
import Incentknow.HTML.Utils (css, link, whenElem)
import Incentknow.Molecules.ContextMenu (ContentMenuItem(..))
import Incentknow.Molecules.ContextMenu as ContextMenu
import Incentknow.Route (EditContentTarget(..), EditMaterialTarget(..), EditTarget(..), Route(..))
import Incentknow.Templates.Page (sectionWithHeader)
import Test.Unit.Console (consoleLog)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { selectedDraftId :: Maybe (Either ContentDraftId MaterialDraftId) }

type State
  = { drafts :: Remote (Array (RelatedContentDraft))
    , materialDrafts :: Remote (Array (RelatedMaterialDraft))
    , selectedDraftId :: Maybe (Either ContentDraftId MaterialDraftId)
    , hoverItem :: Maybe (Either MaterialDraftId ContentDraftId)
    }

type DraftSet
  = { format :: FocusedFormat
    , drafts :: Array (RelatedContentDraft)
    }

data Query a
  = Reload a
  | SelectItem (Either ContentDraftId MaterialDraftId) a
  | UpdateContentDraft ContentDraftId Json a
  | UpdateMaterialDraft MaterialDraftId MaterialData a

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
  | MouseEnterItem (Either MaterialDraftId ContentDraftId)
  | MouseLeaveItem
  | ContextMenuInvoked (Either MaterialDraftId ContentDraftId) String

type Slot p
  = H.Slot Query Void p

type ChildSlots
  = ( contextMenuContent :: ContextMenu.Slot ContentDraftId
    , contextMenuMaterial :: ContextMenu.Slot MaterialDraftId
    )

component :: forall o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML Query Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval 
        { initialize = Just Initialize
        , receive = Just <<< HandleInput
        , handleAction = handleAction
        , handleQuery = handleQuery
        }
    }

initialState :: Input -> State
initialState input = 
  { drafts: Loading
  , materialDrafts: Loading
  , selectedDraftId: input.selectedDraftId
  , hoverItem: Nothing
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  sectionWithHeader "org-draft-explorer"
    [ HH.text "Drafts" ]
    [ whenElem (state.selectedDraftId == Nothing) \_->
        renderNew
    , remoteWith state.drafts \drafts-> 
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
              [ icon "far fa-plus" ]
          ]
      , HH.div [ css "drafts" ]
          (map renderDraft item.drafts)
      ]

  renderNew :: H.ComponentHTML Action ChildSlots m
  renderNew =
    HH.div 
      [ css $ "new-draft"
      ]
      [ HH.div [ css "name" ]
          [ HH.text "新規作成"
          ]
      ]

  renderDraft :: RelatedContentDraft -> H.ComponentHTML Action ChildSlots m
  renderDraft draft =
    HH.div 
      [ css $ "draft" <> if Just (Left draft.draftId) == state.selectedDraftId then " selected" else "" 
      , HE.onMouseEnter $ \_-> Just $ MouseEnterItem $ Right draft.draftId
      , HE.onMouseLeave $ \_-> Just MouseLeaveItem
      ]
      [ HH.div [ css "name" ]
        [ link Navigate (EditDraft $ ContentTarget $ TargetDraft draft.draftId) []
          [ HH.text common.title
          ]
        ]
      , HH.div [ css "menu" ]
          [ HH.slot (SProxy :: SProxy "contextMenuContent") draft.draftId ContextMenu.component
              { items: [ EventItem "trash" "削除" $ \_-> toUnit $ callCommand $ cancelContentDraft draft.draftId ]
              , visibleButton: state.hoverItem == Just (Right draft.draftId)
              }
              (Just <<< ContextMenuInvoked (Right draft.draftId))
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
    HH.div 
      [ css $ "draft" <> if Just (Right draft.draftId) == state.selectedDraftId then " selected" else "" 
      , HE.onMouseEnter $ \_-> Just $ MouseEnterItem $ Left draft.draftId
      , HE.onMouseLeave $ \_-> Just MouseLeaveItem
      ]
      [ HH.div [ css "name" ]
          [ link Navigate (EditDraft $ MaterialTarget $ MaterialTargetDraft draft.draftId) []
            [ HH.text $ normalizeName draft.displayName 
            ]
          ]
      , HH.div [ css "menu" ]
          [ HH.slot (SProxy :: SProxy "contextMenuMaterial") draft.draftId ContextMenu.component
              { items: [ EventItem "trash" "削除" $ \_-> toUnit $ callCommand $ cancelMaterialDraft draft.draftId ]
              , visibleButton: state.hoverItem == Just (Left draft.draftId)
              }
              (Just <<< ContextMenuInvoked (Left draft.draftId))
          ]
      ]

  toUnit :: forall a. Aff a -> Aff Unit
  toUnit src = do
    _ <- src
    pure unit

  normalizeName :: String -> String
  normalizeName name = if S.length (trim name) == 0 then "無名" else name

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    callbackQuery FetchedDrafts $ getMyContentDrafts unit
    callbackQuery FetchedMaterialDrafts $ getMyMaterialDrafts unit
  ContextMenuInvoked (Right contentDraftId) method -> do
    callbackQuery FetchedDrafts $ getMyContentDrafts unit
    state <- H.get
    when (method == "削除" && state.selectedDraftId == (Just $ Left contentDraftId)) do
      navigate $ EditDraft $ ContentTarget $ TargetBlank Nothing Nothing
  ContextMenuInvoked (Left materialDraftId) method -> do
    callbackQuery FetchedMaterialDrafts $ getMyMaterialDrafts unit
    state <- H.get
    when (method == "削除" && state.selectedDraftId == (Just $ Right materialDraftId)) do
      navigate $ EditDraft $ ContentTarget $ TargetBlank Nothing Nothing
  HandleInput input -> H.modify_ _ { selectedDraftId = input.selectedDraftId }
  Navigate event route -> navigateRoute event route
  FetchedDrafts fetch -> do
    forRemote fetch \drafts->
      H.modify_ _ { drafts = drafts }
  FetchedMaterialDrafts fetch -> do
    forRemote fetch \drafts->
      H.modify_ _ { materialDrafts = drafts }
  MouseEnterItem item -> H.modify_ _ { hoverItem = Just item }
  MouseLeaveItem -> H.modify_ _ { hoverItem = Nothing }

handleQuery :: forall o m a. Behaviour m => MonadAff m =>  Query a -> H.HalogenM State Action ChildSlots o m (Maybe a)
handleQuery = case _ of
  Reload k -> do
    handleAction Initialize
    pure $ Just k
  SelectItem (Right materialDraftId) k -> do
    H.modify_ _ { selectedDraftId = Just $ Right materialDraftId }
    callbackQuery FetchedMaterialDrafts $ getMyMaterialDrafts unit
    pure $ Just k
  SelectItem (Left contentDraftId) k -> do
    H.modify_ _ { selectedDraftId = Just $ Left contentDraftId }
    callbackQuery FetchedDrafts $ getMyContentDrafts unit
    pure $ Just k
  UpdateContentDraft draftId data2 k -> do
    H.modify_ \x-> x { drafts = map (\y-> map (\draft-> if draft.draftId == draftId then draft { data = data2 } else draft) y) x.drafts }
    pure $ Just k
  UpdateMaterialDraft draftId data2 k -> do
    H.modify_ \x-> x { materialDrafts = map (\y-> map (\draft-> if draft.draftId == draftId then draft { displayName = getDisplayName data2 } else draft) y) x.materialDrafts }
    pure $ Just k

getDisplayName :: MaterialData -> String
getDisplayName = case _ of
  PlaintextMaterialData x -> x
  DocumentMaterialData doc -> trim $ take 140 $ joinWith " " $ catMaybes $ (map (_.data >>> getBlockDataOptions >>> _.text) doc.blocks)