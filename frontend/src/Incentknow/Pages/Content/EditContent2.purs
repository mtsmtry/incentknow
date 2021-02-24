module Incentknow.Pages.EditContent where

import Prelude
import Control.Monad.Rec.Class (forever)
import Data.Argonaut.Core (Json, jsonNull, stringify)
import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Parser (jsonParser)
import Data.Either (Either(..), either)
import Data.Foldable (for_, traverse_)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing)
import Data.Newtype (unwrap, wrap)
import Data.Nullable as N
import Data.Symbol (SProxy(..))
import Effect.Aff (Milliseconds(..))
import Effect.Aff as Aff
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Effect.Exception (error)
import Halogen as H
import Halogen.HTML as HH
import Halogen.Query.EventSource (EventSource)
import Halogen.Query.EventSource as EventSource
import Halogen.Query.HalogenM (SubscriptionId(..))
import Incentknow.API (commitContent, getContent)
import Incentknow.API.Execution (Fetch(..), Remote(..), executeAPI, fetchAPI, forFetch, toMaybe)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (loadingWith, remoteWith)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Atoms.Message (SaveState(..), saveState)
import Incentknow.Data.Entities (FocusedContent)
import Incentknow.Data.Ids (SpaceId(..), ContentId(..), FormatId(..))
import Incentknow.HTML.Utils (maybeElem)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SpaceMenu as SpaceMenu
import Incentknow.Organisms.Content.Editor as Editor
import Incentknow.Route (Route(..))
import Incentknow.Templates.Page (section)

type Input
  = { contentId :: ContentId }

type State
  = { contentId :: ContentId
    , data :: Remote FocusedContent
    , value :: Json
    , saveState :: SaveState
    , loading :: Boolean
    , timerSubId :: Maybe SubscriptionId
    , disabled :: Boolean
    }

data Action
  = Initialize
  | Load
  | Finalize
  | HandleInput Input
  | ChangeValue Json
  | CheckChage
  | Revise
  | FetchedContent (Fetch FocusedContent)

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( editor :: Editor.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , finalize = Just Finalize
            , handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input =
  { contentId: input.contentId
  , data: Loading
  , value: jsonNull
  , saveState: HasNotChange
  , loading: false
  , workSubId: Nothing
  , timerSubId: Nothing
  , disabled: true
  }

editor_ = SProxy :: SProxy "editor"

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  section "page-edit-content"
    [ saveState state.saveState
    , remoteWith state.data \x ->
        HH.slot editor_ unit Editor.component { format: x.format, value: state.value, env: { spaceId: Just x.spaceId } } (Just <<< ChangeValue)
    , submitButton
        { isDisabled: isNothing (toMaybe state.data) || state.loading || state.disabled
        , isLoading: state.loading
        , text: "変更"
        , loadingText: "変更中"
        , onClick: Revise
        }
    ]

timer :: forall m. MonadAff m => EventSource m Action
timer =
  EventSource.affEventSource \emitter -> do
    fiber <-
      Aff.forkAff
        $ forever do
            Aff.delay $ Milliseconds 2000.0
            EventSource.emit emitter CheckChage
    pure
      $ EventSource.Finalizer do
          Aff.killFiber (error "Event source finalized") fiber

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.workSubId \subId -> do
      H.unsubscribe subId
    handleAction Load
    when (isNothing state.timerSubId) do
      timerSubId <- H.subscribe timer
      H.modify_ _ { timerSubId = Just timerSubId }
  Load -> do
    state <- H.get
    fetchAPI FetchedContent $ getContent state.contentId
  FetchedContent fetch -> case fetch of
    FromCache content -> do
      H.modify_ _ { data = Holding content }
    FromServer content -> do
      state <- H.modify _ { data = Holding content }
      H.modify_ _ { disabled = false }
    _ -> pure unit
  HandleInput input -> do
    state <- H.get
    when (state.contentId /= input.contentId) do
      H.modify_ _ { contentId = input.contentId }
      handleAction Load
  ChangeValue value -> do
    state <- H.get
    when (not state.disabled) do
      case state.saveState of
        Saving -> H.modify_ _ { value = value, saveState = SavingButChanged }
        _ -> H.modify_ _ { value = value, saveState = NotSaved }
  Revise -> do
    state <- H.get
    for_ (toMaybe state.data) \content -> do
      H.modify_ _ { loading = true }
      result <- executeAPI $ commitContent { contentId: state.contentId, structureId: content.format.defaultStructureId, data: state.value }
      for_ result \_ -> do
        H.modify_ _ { saveState = HasNotChange }
      H.modify_ _ { loading = false }
  CheckChage -> do
    state <- H.get
    when (state.saveState == NotSaved && not state.loading) do
      for_ (toMaybe state.data) \content -> do
        H.modify_ _ { saveState = Saving }
        response <- executeAPI $ writeContentWork { contentId: state.contentId, structureId: content.format.defaultStructureId, data: state.value }
        case response of
          Just _ -> makeSaveStateSaved
          Nothing -> H.modify_ _ { saveState = NotSaved }
  Finalize -> handleAction CheckChage
  where
  makeSaveStateSaved :: H.HalogenM State Action ChildSlots o m Unit
  makeSaveStateSaved = do
    state <- H.get
    when (state.saveState == Saving) do
      H.modify_ _ { saveState = Saved }
