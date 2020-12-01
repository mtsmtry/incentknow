module Incentknow.Pages.Crawler.Caches where

import Prelude

import Data.DateTime.Utils (fromTimestampToString)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (CrawlerCache, getCrawlerCaches)
import Incentknow.Api.Utils (Fetch, Remote(..), fetchApi, forFetch)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Ids (CrawlerId(..), FormatId(..))
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.Structure as Structure
import Incentknow.Organisms.Table (TableCell(..), TableRow(..))
import Incentknow.Organisms.Table as Table

type Input
  = { crawlerId :: CrawlerId }

type State
  = { crawlerId :: CrawlerId, caches :: Remote (Array CrawlerCache) }

data Action
  = Initialize
  | FetchedCaches (Fetch (Array CrawlerCache))

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
initialState input = { crawlerId: input.crawlerId, caches: Loading }

headers :: Array String
headers = [ "スクレイパーID", "URL", "取得時刻", "ステータス" ]

toRow :: CrawlerCache -> TableRow
toRow cache =
  TableRow
    [ TableCell Nothing $ unwrap cache.scraperId
    , TableCell Nothing $ cache.url
    , TableCell Nothing $ fromTimestampToString cache.timestamp
    , TableCell Nothing $ cache.status
    ]

render :: forall m. Behaviour m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "page-crawler-caches" ]
    [ remoteWith state.caches \caches ->
        HH.slot (SProxy :: SProxy "table") unit Table.component { headers, rows: map toRow caches } absurd
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    fetchApi FetchedCaches $ getCrawlerCaches state.crawlerId
  FetchedCaches fetch ->
    forFetch fetch \caches ->
      H.modify_ _ { caches = caches }
