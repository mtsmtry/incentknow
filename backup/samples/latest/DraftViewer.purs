module Incentknow.Widgets.DraftViewer where

import Prelude

import Data.Array (sortBy)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), isNothing, maybe)
import Data.Maybe.Utils (flatten)
import Data.Newtype (unwrap)
import Data.Nullable (toMaybe)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen (SubscriptionId)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Data.Ids (ContentDraftId(..))
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, link, maybeElem)
import Incentknow.Route (SnapshotDiff(..))
import Incentknow.Route as R
import Incentknow.Templates.Page (section)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { draftId :: ContentDraftId, route :: R.Route }

type State
  = { draftId :: ContentDraftId
    , route :: R.Route
    , work :: Maybe Work
    , snapshots :: Array Snapshot
    , workSubId :: Maybe SubscriptionId
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeDraft (Maybe Work)
  | ChangeSnapshots (Array Snapshot)
  | Navigate MouseEvent R.Route

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
initialState input =
  { workId: input.workId
  , work: Nothing
  , route: input.route
  , snapshots: []
  , workSubId: Nothing
  }

render :: forall m. State -> H.ComponentHTML Action ChildSlots m
render state =
  section "wid-work-viewer"
    [ maybeElem state.work \work ->
        HH.div []
          $ [ link Navigate (maybe (R.EditWork work.workId) R.EditContent $ toMaybe work.contentId)
                []
                [ HH.div [ css $ if isLatest then "snapshot snapshot_active" else "snapshot" ] [ HH.text "最新の状態" ] ]
            ]
          <> (map renderItem state.snapshots)
    ]
  where
  renderItem :: Snapshot -> H.ComponentHTML Action ChildSlots m
  renderItem snapshot =
    maybeElem (flatten $ map (\work -> toMaybe work.workingChangeId) state.work) \changeId ->
      link Navigate (R.Snapshot state.workId changeId (InitialSnapshot snapshot.snapshotId)) []
        [ HH.div [ css $ if isSnapshot snapshot.snapshotId then "snapshot snapshot_active" else "snapshot" ] [ dateTime snapshot.timestamp ] ]

  isSnapshot :: SnapshotId -> Boolean
  isSnapshot snapshotId = case state.route of
    R.Snapshot _ _ (SnapshotDiff snapshotId2 _) -> snapshotId == snapshotId2
    R.Snapshot _ _ (InitialSnapshot snapshotId2) -> snapshotId == snapshotId2
    _ -> false

  isLatest = case state.route of
    R.EditContent _ -> true
    R.EditWork _ -> true
    _ -> false

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.workSubId \subId ->
      H.unsubscribe subId
    subId <- subscribeApi (ChangeWork <<< toMaybe) $ onSnapshotWork $ unwrap state.workId
    H.modify_ _ { workSubId = Just subId }
  ChangeWork maybeWork -> do
    state <- H.get
    H.modify_ _ { work = maybeWork }
    when (isNothing state.work) do
      for_ maybeWork \work -> do
        for_ (toMaybe work.workingChangeId) \changeId -> do
          subscribeApi ChangeSnapshots $ onSnapshotSnapshots work.workId changeId
  ChangeSnapshots snapshots -> 
    H.modify_ _ { snapshots = sortBy compareSnapshot snapshots }
    where
    compareSnapshot a b = compare b.timestamp a.timestamp
  HandleInput input -> do
    state <- H.get
    if input.workId /= state.workId then do
      H.put $ initialState input
      handleAction Initialize
    else 
      H.modify_ _ { route = input.route }
  Navigate event route -> navigateRoute event route
