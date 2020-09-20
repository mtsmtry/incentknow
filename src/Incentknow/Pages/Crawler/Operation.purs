module Incentknow.Pages.Crawler.Operation where

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
import Halogen.HTML as Operation
import Incentknow.Api (CrawlerOperation, getCrawlerOperations)
import Incentknow.Api.Utils (Fetch, Remote(..), executeApi, fetchApi, forFetch)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Ids (CrawlerId(..), FormatId(..), OperationId)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.Structure as Structure
import Incentknow.Organisms.Table (TableCell(..), TableRow(..))
import Incentknow.Organisms.Table as Table
import Incentknow.Pages.Crawler.TaskList as TaskList

type Input
  = { crawlerId :: CrawlerId, operationId :: OperationId }

type State
  = { crawlerId :: CrawlerId, operationId :: OperationId }

data Action
  = Initialize

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( tasks :: TaskList.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { crawlerId: input.crawlerId, operationId: input.operationId }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "page-crawler-operations" ]
    [ HH.slot (SProxy :: SProxy "tasks") unit TaskList.component { crawlerId: state.crawlerId, operationId: state.operationId } absurd
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
