module Incentknow.Pages.Space.CrawlerList where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Incentknow.Api (getCrawlers, Crawler)
import Incentknow.Api.Utils (Fetch, Remote(..), fetchApi, forFetch)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Data.Ids (SpaceId)
import Incentknow.HTML.Utils (css)
import Incentknow.Route (CrawlerTab(..), Route(..))

type Input
  = { spaceId :: SpaceId }

type State
  = { spaceId :: SpaceId, crawlers :: Remote (Array Crawler) }

data Action
  = Initialize
  | Navigate Route
  | FetchedCrawlers (Fetch (Array Crawler))

type Slot p
  = forall q. H.Slot q Void p

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { spaceId: input.spaceId, crawlers: Loading }

render :: forall m. State -> H.ComponentHTML Action () m
render state =
  HH.div [ css "page-crawler-list" ]
    [ submitButton { isDisabled: false , isLoading: false , loadingText: "" , onClick: Navigate NewCrawler , text: "新しいスペースを作成する" }
    , HH.div [ css "table" ]
        [ HH.div [ css "header" ]
            [ HH.div [ css "column" ]
                [ HH.text "クローラー"
                ]
            ]
        , remoteWith state.crawlers \crawlers-> 
            HH.div [ css "body" ]
                (map renderItem crawlers)
        ]
    ]
  where
  renderItem :: Crawler -> H.ComponentHTML Action () m
  renderItem crawler =
    HH.div [ css "item" ]
      [ HH.div [ css "name", HE.onClick $ \_ -> Just $ Navigate $ Crawler crawler.crawlerId CrawlerMain ] 
        [ HH.text crawler.displayName ]
      ]

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action () o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    fetchApi FetchedCrawlers $ getCrawlers state.spaceId
  FetchedCrawlers fetch ->
    forFetch fetch \crawlers ->
      H.modify_ _ { crawlers = crawlers }
  Navigate route -> navigate route
