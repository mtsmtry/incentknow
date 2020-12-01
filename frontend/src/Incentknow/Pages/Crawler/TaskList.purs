module Incentknow.Pages.Crawler.TaskList where

import Prelude
import Data.DateTime.Utils (fromTimestampToString)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Data.Nullable (toMaybe)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen (SubscriptionId)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (CrawlerOperation, CrawlerTask, getCrawlerOperations, onSnapshotCrawlerTasks)
import Incentknow.Api.Utils (Fetch, Remote(..), callbackApi, executeApi, fetchApi, forFetch, subscribeApi)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Ids (CrawlerId(..), FormatId(..), OperationId)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.Structure as Structure
import Incentknow.Organisms.Table (TableCell(..), TableRow(..))
import Incentknow.Organisms.Table as Table

type Input
  = { crawlerId :: CrawlerId, operationId :: OperationId }

type State
  = { crawlerId :: CrawlerId, operationId :: OperationId, tasks :: Array CrawlerTask, subscriptionId :: Maybe SubscriptionId }

data Action
  = Initialize
  | OnSnapshotTasks (Array CrawlerTask)
  | HandleInput Input

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( table :: Table.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { crawlerId: input.crawlerId, operationId: input.operationId, tasks: [], subscriptionId: Nothing }

headers :: Array String
headers = [ "タスクID", "開始時刻", "終了時刻", "ステータス" ]

toRow :: CrawlerTask -> TableRow
toRow task =
  TableRow
    [ TableCell Nothing $ task.taskId
    , TableCell Nothing $ fromTimestampToString task.createdAt
    , TableCell Nothing $ maybe "" fromTimestampToString $ toMaybe task.endedAt
    , TableCell Nothing task.status
    ]

render :: forall m. Behaviour m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "page-crawler-operations" ]
    [ HH.slot (SProxy :: SProxy "table") unit Table.component { headers, rows: map toRow state.tasks } absurd
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.subscriptionId \subscriptionId ->
      H.unsubscribe subscriptionId
    subscriptionId <- subscribeApi OnSnapshotTasks $ onSnapshotCrawlerTasks state.crawlerId state.operationId
    H.modify_ _ { subscriptionId = Just subscriptionId }
  OnSnapshotTasks tasks -> H.modify_ _ { tasks = tasks }
  HandleInput input -> do
    H.put $ initialState input
    state <- H.get
    when (state.operationId /= input.operationId) do
      handleAction Initialize
