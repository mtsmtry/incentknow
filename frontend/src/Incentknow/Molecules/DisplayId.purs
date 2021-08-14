module Incentknow.Molecules.DisplayId where

import Prelude

import Data.Either (Either, either)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff, Milliseconds(..), error)
import Effect.Aff as Aff
import Effect.Aff.Class (class MonadAff)
import Halogen (SubscriptionId)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Halogen.Query.EventSource (EventSource)
import Halogen.Query.EventSource as EventSource
import Incentknow.Atoms.Icon (loadingWith)
import Incentknow.HTML.Utils (css)

type Input
  = { checkId :: String -> Aff (Either String Boolean)
    , disabled :: Boolean
    , value :: { displayId :: String, checkState :: CheckState }
    }

type State
  = { checkId :: String -> Aff (Either String Boolean)
    , displayId :: String
    , disabled :: Boolean
    , checkState :: CheckState
    , timerSubId :: Maybe SubscriptionId
    }

data CheckState
  = Typing
  | Available
  | Checking
  | AlreadyUsed

derive instance eqCheckState :: Eq CheckState

data Action
  = Initialize
  | HandleInput Input
  | Change String
  | Check

type Slot p
  = forall q. H.Slot q Output p

type Output
  = { displayId :: String, checkState :: CheckState }

type ChildSlots
  = ()

component :: forall q m. MonadAff m => H.Component HH.HTML q Input Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input =
  { displayId: input.value.displayId
  , disabled: input.disabled
  , checkId: input.checkId
  , checkState: input.value.checkState
  , timerSubId: Nothing
  }

setInput :: Input -> State -> State
setInput input state =
  { displayId: input.value.displayId
  , disabled: input.disabled
  , checkId: input.checkId
  , checkState: input.value.checkState
  , timerSubId: state.timerSubId
  }

render :: forall m. MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "mol-display-id" ]
    [ HH.input
        [ css "atom-textarea"
        , HP.value state.displayId
        , HP.disabled state.disabled
        , HE.onValueInput $ Just <<< Change
        ]
    , case state.checkState of
        Typing -> HH.text ""
        Available -> HH.div [ css "available" ] [ HH.text "このIDは使用可能です" ]
        Checking -> HH.div [ css "checking" ] [ loadingWith "確認中" ]
        AlreadyUsed -> HH.div [ css "used" ] [ HH.text "このIDは既に使用されています" ]
    ]

timer :: forall m. MonadAff m => EventSource m Action
timer =
  EventSource.affEventSource \emitter -> do
    fiber <-
      Aff.forkAff do
        Aff.delay $ Milliseconds 300.0
        EventSource.emit emitter Check
    pure
      $ EventSource.Finalizer do
          Aff.killFiber (error "Event source finalized") fiber

handleAction :: forall m. MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> do
    H.modify_ $ setInput input
  Change value -> do
    state <- H.get
    for_ state.timerSubId \subId -> do
      H.unsubscribe subId
    newSubId <- H.subscribe timer
    H.modify_ _ { timerSubId = Just newSubId, displayId = value, checkState = Typing }
    H.raise { displayId: value, checkState: Typing }
  Check -> do
    state <- H.get
    H.modify_ _ { checkState = Checking }
    H.raise { displayId: state.displayId, checkState: Checking }
    result <- H.liftAff $ state.checkId state.displayId
    let
      checkState = either (const AlreadyUsed) (\x-> if x then Available else AlreadyUsed) result
    latestState <- H.get
    when (latestState.displayId == state.displayId) do
      H.modify_ _ { checkState = checkState }
      H.raise { displayId: state.displayId, checkState }
