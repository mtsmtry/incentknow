module Incentknow.Pages.DraftList where

import Prelude

import Data.Argonaut.Core (toString)
import Data.Array (catMaybes, filter, head, range)
import Data.Map (Map)
import Data.Map as M
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (wrap)
import Data.Nullable (notNull, null, toMaybe)
import Data.String as String
import Data.String.CodeUnits (charAt, fromCharArray)
import Data.Symbol (SProxy(..))
import Data.Traversable (for, for_)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Effect.Random (randomInt)
import Halogen (liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.API (getMyContentDrafts, getMyMaterialDrafts)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, executeAPI, executeCommand, forRemote)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (button, pulldown)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (ContentChangeType(..), ContentEditingState(..), FocusedFormat, RelatedContentDraft, RelatedMaterialDraft)
import Incentknow.Data.Property (mkProperties)
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Molecules.TypeMenu as TypeMenu
import Incentknow.Organisms.ListView (ListViewItem)
import Incentknow.Organisms.ListView as ListView
import Incentknow.Route (ContentTab(..), EditTarget(..), MaterialEditTarget(..), Route(..))
import Incentknow.Templates.Page (tabGrouping)

data DraftTab
  = DraftMain
  | DraftCommitted
  | DraftDrafting
  | DraftDeleted

derive instance eqDraftTab :: Eq DraftTab

type Input
  = {}

type State
  = { drafts :: Remote (Array RelatedContentDraft)
    , materialDrafts :: Remote (Array RelatedMaterialDraft)
    , tab :: DraftTab
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate Route
  | ChangeTab DraftTab
  | FetchedDrafts (Fetch (Array RelatedContentDraft))
  | FetchedMaterialDrafts (Fetch (Array RelatedMaterialDraft))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( listView :: ListView.Slot Unit
    )

component :: forall o q m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
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
  { drafts: Loading
  , materialDrafts: Loading
  , tab: DraftDrafting
  }

toListViewItem :: RelatedContentDraft -> Maybe ListViewItem
toListViewItem draft = map (\format -> toItem draft format) maybeFormat
  where
  maybeFormat = Just draft.format --M.lookup draft.info.structureId state.formats

  toItem :: RelatedContentDraft -> FocusedFormat -> ListViewItem
  toItem draft format =
    { user: Nothing
    , datetime: Just draft.updatedAt
    , title: common.title
    , format: Just format
    , route: EditContent $ TargetDraft draft.draftId
    }
    where
    common = getContentSemanticData draft.data format

toListViewItemFromMaterial :: RelatedMaterialDraft -> Maybe ListViewItem
toListViewItemFromMaterial draft =
  Just
    { user: Nothing
    , datetime: Just draft.updatedAt
    , title: draft.displayName
    , format: Nothing
    , route: EditMaterial $ MaterialTargetDraft draft.draftId
    }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  tabGrouping
    { tabs: [ DraftDrafting, DraftCommitted, DraftDeleted, DraftMain ]
    , onChangeTab: ChangeTab
    , currentTab: state.tab
    , showTab:
        case _ of
          DraftMain -> "全て"
          DraftDrafting -> "作業中"
          DraftCommitted -> "作業終了"
          DraftDeleted -> "ゴミ箱"
    }
    []
    [ case state.tab of
        DraftMain ->
          remoteWith state.drafts \drafts ->
            remoteWith state.materialDrafts \materialDrafts ->
              HH.slot (SProxy :: SProxy "listView") unit ListView.component
                { items: catMaybes $ (map toListViewItem drafts) <> (map toListViewItemFromMaterial materialDrafts) }
                absurd
        DraftDrafting ->
          remoteWith state.drafts \drafts ->
            remoteWith state.materialDrafts \materialDrafts ->
              HH.slot (SProxy :: SProxy "listView") unit ListView.component
                { items: catMaybes $ (map toListViewItem $ filter (\x -> x.isEditing) drafts)
                  <> (map toListViewItemFromMaterial $ filter (\x -> x.isEditing) materialDrafts) }
                absurd
        DraftCommitted ->
          remoteWith state.drafts \drafts ->
            remoteWith state.materialDrafts \materialDrafts ->
              HH.slot (SProxy :: SProxy "listView") unit ListView.component
                { items: catMaybes $ (map toListViewItem $ filter (\x -> not x.isEditing) drafts)
                  <> (map toListViewItemFromMaterial $ filter (\x -> not x.isEditing) materialDrafts) }
                absurd
        DraftDeleted ->
          remoteWith state.drafts \drafts ->
            HH.slot (SProxy :: SProxy "listView") unit ListView.component
              { items: catMaybes $ map toListViewItem $ filter (\x -> x.changeType == ContentChangeTypeRemove) drafts }
              absurd
    ]

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    callbackQuery FetchedDrafts $ getMyContentDrafts
    callbackQuery FetchedMaterialDrafts $ getMyMaterialDrafts
  --workingDrafts <- executeAPI $ getMyDrafts { state: notNull "working" }
  FetchedDrafts fetch -> do
    forRemote fetch \drafts ->
      H.modify_ _ { drafts = drafts }
  FetchedMaterialDrafts fetch -> do
    forRemote fetch \drafts ->
      H.modify_ _ { materialDrafts = drafts }
  HandleInput props -> handleAction Initialize
  Navigate route -> navigate route
  ChangeTab tab -> H.modify_ _ { tab = tab }
