module Incentknow.Pages.Snapshot where

import Prelude

import Data.Array (index, length, range)
import Data.Foldable (for_)
import Data.Int (fromString)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Maybe.Utils (flatten)
import Data.Newtype (unwrap)
import Data.Nullable (toMaybe)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Halogen (SubscriptionId)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.Atoms.Inputs (button)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Ids (ContentDraftId(..), ContentId(..))
import Incentknow.HTML.Utils (css, link, link_, maybeElem)
import Incentknow.Organisms.Content.Viewer as Content
import Incentknow.Organisms.ContentList as ContentList
import Incentknow.Route (Route(..), SnapshotDiff(..))
import Incentknow.Templates.Page (section, tabPage)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { draftId :: ContentDraftId
    , changeId :: ChangeId
    , snapshotDiff :: SnapshotDiff
    }

type State
  = { draftId :: ContentDraftId
    , changeId :: ChangeId
    , beforeSnapshotId :: Maybe SnapshotId
    , afterSnapshotId :: SnapshotId
    , beforeSnapshot :: Maybe Snapshot
    , afterSnapshot :: Maybe Snapshot
    , work :: Maybe Work
    , workSubId :: Maybe SubscriptionId
    }

data Action
  = Initialize
  | InitializeSnapshot
  | HandleInput Input
  | ChangeWork (Maybe Work)

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( content :: Content.Slot Unit
    , contentList :: ContentList.Slot String
    )

component :: forall q o m. Behaviour m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , receive = Just <<< HandleInput
            , handleAction = handleAction
            }
    }

setSnapshotDiff :: SnapshotDiff -> State -> State
setSnapshotDiff diff state = case diff of
  SnapshotDiff beforeId afterId ->
    state
      { beforeSnapshotId = Just beforeId
      , afterSnapshotId = afterId
      }
  InitialSnapshot afterId ->
    state
      { beforeSnapshotId = Nothing
      , afterSnapshotId = afterId
      }

initialState :: Input -> State
initialState input = case input.snapshotDiff of
  SnapshotDiff beforeId afterId ->
    { workId: input.workId
    , changeId: input.changeId
    , beforeSnapshotId: Just beforeId
    , afterSnapshotId: afterId
    , beforeSnapshot: Nothing
    , afterSnapshot: Nothing
    , work: Nothing
    , workSubId: Nothing
    }
  InitialSnapshot afterId ->
    { workId: input.workId
    , changeId: input.changeId
    , beforeSnapshotId: Nothing
    , afterSnapshotId: afterId
    , beforeSnapshot: Nothing
    , afterSnapshot: Nothing
    , work: Nothing
    , workSubId: Nothing
    }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  maybeElem state.work \work ->
    maybeElem state.afterSnapshot \snapshot ->
      section "page-content"
        [ HH.slot (SProxy :: SProxy "content") unit Content.component { format: work.format, value: snapshot.data } absurd
        ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.workSubId \subId -> do
      H.unsubscribe subId
    id <- subscribeAPI (ChangeWork <<< toMaybe) $ onSnapshotWork (unwrap state.workId)
    H.modify_ _ { workSubId = Just id }
    handleAction InitializeSnapshot
  InitializeSnapshot -> do
    state <- H.get
    for_ state.beforeSnapshotId \snapshotId -> do
      beforeSnapshot <- executeAPI $ getSnapshot state.workId state.changeId snapshotId
      H.modify_ _ { beforeSnapshot = beforeSnapshot }
    afterSnapshot <- executeAPI $ getSnapshot state.workId state.changeId state.afterSnapshotId
    H.modify_ _ { afterSnapshot = afterSnapshot }
  ChangeWork work -> H.modify_ _ { work = work }
  HandleInput input -> do
    state <- H.get
    if state.workId == input.workId then do
      H.modify_  $ (setSnapshotDiff input.snapshotDiff) <<< _ { changeId = input.changeId }
      handleAction InitializeSnapshot
    else do
      H.modify_ $ (setSnapshotDiff input.snapshotDiff) <<< _ { workId = input.workId, changeId = input.changeId }
      handleAction Initialize
