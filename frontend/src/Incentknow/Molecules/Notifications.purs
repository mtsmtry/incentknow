module Incentknow.Molecules.Notifications where

import Prelude

import Control.Monad.Rec.Class (forever)
import Data.Maybe (Maybe(..), fromMaybe)
import Effect.Aff (Milliseconds(..))
import Effect.Aff as Aff
import Effect.Aff.Class (class MonadAff)
import Effect.Exception (error)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.Query.EventSource (EventSource)
import Halogen.Query.EventSource as EventSource
import Halogen.Query.HalogenM (SubscriptionId)
import Incentknow.API (getNotReadNotificationCount)
import Incentknow.API.Execution (Fetch, callbackQuery, forRemote, toMaybe)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (icon)
import Incentknow.HTML.Utils (css, whenElem)

data Action
  = Initialize
  | HandleInput Input
  | Click
  | LoadNotReadCount
  | FetchedNotReadCount (Fetch Int)

type Output = Void

data Query a = ReadAllNotifications a

initialState :: Input -> State
initialState input = { count: 0, timerSubId: Nothing }

component :: forall m. Behaviour m => MonadAff m => H.Component HH.HTML Query Input Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , handleAction = handleAction
            , handleQuery = handleQuery
            , receive = Just <<< HandleInput
            }
    }

type Input
  = { 
    }

type State
  = { count :: Int, timerSubId :: Maybe SubscriptionId }

type Slot p
  = H.Slot Query Output p

timer :: forall m. MonadAff m => EventSource m Action
timer =
  EventSource.affEventSource \emitter -> do
    fiber <-
      Aff.forkAff
        $ forever do
            Aff.delay $ Milliseconds 10000.0
            EventSource.emit emitter $ LoadNotReadCount
    pure
      $ EventSource.Finalizer do
          Aff.killFiber (error "Event source finalized") fiber

render :: forall m o. State -> H.ComponentHTML Action o m
render state =
  HH.div [ css "mol-notifications", HE.onClick $ \_-> Just Click ]
    [ icon "fas fa-bell"
    , whenElem (state.count > 0) \_->
        HH.span [ css "count" ] [ HH.text $ show state.count ]
    ]

handleAction :: forall m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action () Output m Unit
handleAction = case _ of
  Initialize -> do
    timerSubId <- H.subscribe timer
    H.modify_ _ { timerSubId = Just timerSubId }
    handleAction LoadNotReadCount
  HandleInput input -> pure unit
  Click -> H.modify_ _ { count = 0 }
  LoadNotReadCount -> do
    callbackQuery FetchedNotReadCount $ getNotReadNotificationCount unit
  FetchedNotReadCount fetch -> do
    forRemote fetch \count->
      H.modify_ _ { count = fromMaybe 0 $ toMaybe count }

handleQuery :: forall o m a. Query a -> H.HalogenM State Action () o m (Maybe a)
handleQuery = case _ of
  ReadAllNotifications k -> do
    H.modify_ _ { count = 0 }
    pure Nothing