module Incentknow.Pages.Crawler where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (Crawler, getCrawler, runCrawler)
import Incentknow.Api.Utils (Fetch, Remote(..), executeApi, fetchApi, forFetch)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (menuPositiveButton, dangerButton)
import Incentknow.Data.Ids (SpaceId(..), CrawlerId(..))
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.DangerChange as DangerChange
import Incentknow.Pages.Crawler.Caches as Caches
import Incentknow.Pages.Crawler.Main as Main
import Incentknow.Pages.Crawler.OperationList as OperationList
import Incentknow.Pages.Crawler.Operation as Operation
import Incentknow.Route (SpaceTab(..), CrawlerTab(..), Route(..))
import Incentknow.Templates.Page (tabPage)

type Input
  = { crawlerId :: CrawlerId, tab :: CrawlerTab }

type State
  = { crawlerId :: CrawlerId, tab :: CrawlerTab, crawler :: Remote Crawler }

data Action
  = Initialize
  | ChangeTab CrawlerTab
  | HandleInput Input
  | Navigate Route
  | Delete
  | FetchedCrawler (Fetch Crawler)
  | RunCrawler

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( main :: Main.Slot Unit
    , operation :: Operation.Slot Unit
    , operations :: OperationList.Slot Unit
    , caches :: Caches.Slot Unit
    , delete :: DangerChange.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
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
initialState input = { crawlerId: input.crawlerId, crawler: Loading, tab: input.tab }

-- HH.slot (SProxy :: SProxy "delete") unit DangerChange.component
--                      { text: "削除"
----                      , title: "スペースの削除"
--                      , message: "スペース「" <> x.name <> "」" <> "を本当に削除しますか？"
--                      }
--                      (\_ -> Just Delete)
render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  tabPage
    { tabs: [ CrawlerMain, CrawlerOperations, CrawlerCaches ]
    , currentTab: state.tab
    , onChangeTab: ChangeTab
    , showTab:
        case _ of
          CrawlerMain -> "Main"
          CrawlerOperations -> "Operations"
          CrawlerOperation _ -> "Operations"
          CrawlerCaches -> "Caches"
    }
    [ menuPositiveButton "実行" RunCrawler
    ]
    [ HH.div [ css "page-crawler" ]
        [ remoteWith state.crawler \crawler ->
            HH.div [ css "name" ] [ HH.text crawler.displayName ]
        ]
    ]
    [ case state.tab of
        CrawlerMain ->
          remoteWith state.crawler \crawler ->
            HH.slot (SProxy :: SProxy "main") unit Main.component { crawler } absurd
        CrawlerOperations -> HH.slot (SProxy :: SProxy "operations") unit OperationList.component { crawlerId: state.crawlerId } absurd
        CrawlerOperation operationId -> HH.slot (SProxy :: SProxy "operation") unit Operation.component { crawlerId: state.crawlerId, operationId } absurd
        CrawlerCaches -> HH.slot (SProxy :: SProxy "caches") unit Caches.component { crawlerId: state.crawlerId } absurd
    ]

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    fetchApi FetchedCrawler $ getCrawler state.crawlerId
  FetchedCrawler fetch ->
    forFetch fetch \crawler ->
      H.modify_ _ { crawler = crawler }
  HandleInput input -> do
    state <- H.get
    if state.crawlerId /= input.crawlerId then do
      H.put $ initialState input
      handleAction Initialize
    else
      H.modify_ $ _ { tab = input.tab }
  ChangeTab tab -> do
    state <- H.get
    navigate $ Crawler state.crawlerId tab
  Navigate route -> navigate route
  Delete -> do
    state <- H.get
    --response <- handleError $ client.crawlers.byId.delete { params: { id: state.crawlerId } }
    pure unit
  RunCrawler -> do
    state <- H.get
    _ <- executeApi $ runCrawler { crawlerId: state.crawlerId, method: "crawling" }
    pure unit