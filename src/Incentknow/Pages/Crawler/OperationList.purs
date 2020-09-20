module Incentknow.Pages.Crawler.OperationList where

import Prelude

import Data.DateTime.Utils (fromTimestampToString)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Data.Nullable (toMaybe)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (CrawlerOperation, getCrawlerOperations)
import Incentknow.Api.Utils (Fetch, Remote(..), executeApi, fetchApi, forFetch)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Ids (CrawlerId(..), FormatId(..))
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.Structure as Structure
import Incentknow.Organisms.Table (TableCell(..), TableRow(..))
import Incentknow.Organisms.Table as Table
import Incentknow.Route (Route(..))
import Incentknow.Route as R

type Input
  = { crawlerId :: CrawlerId }

type State
  = { crawlerId :: CrawlerId, operations :: Remote (Array CrawlerOperation) }

data Action
  = Initialize
  | FetchedOperations (Fetch (Array CrawlerOperation))

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
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { crawlerId: input.crawlerId, operations: Loading }

headers :: Array String
headers = [ "オペレーションID", "開始時刻", "終了時刻", "ステータス" ]

toRow :: CrawlerId -> CrawlerOperation -> TableRow
toRow crawlerId operation =
  TableRow
    [ TableCell (Just $ R.Crawler crawlerId $ R.CrawlerOperation operation.operationId) $ unwrap operation.operationId
    , TableCell Nothing $ fromTimestampToString operation.createdAt
    , TableCell Nothing $ maybe "" fromTimestampToString $ toMaybe operation.endedAt
    , TableCell Nothing operation.status
    ]

render :: forall m. Behaviour m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "page-crawler-operations" ]
    [ remoteWith state.operations \operations ->
        HH.slot (SProxy :: SProxy "table") unit Table.component { headers, rows: map (toRow state.crawlerId) operations } absurd
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    fetchApi FetchedOperations $ getCrawlerOperations state.crawlerId
  FetchedOperations fetch ->
    forFetch fetch \operations ->
      H.modify_ _ { operations = operations }
