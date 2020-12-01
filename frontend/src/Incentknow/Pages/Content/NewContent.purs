module Incentknow.Pages.NewContent where

import Prelude
import Control.Monad.Rec.Class (forever)
import Data.Argonaut.Core (Json, jsonNull, stringify)
import Data.Argonaut.Parser (jsonParser)
import Data.Either (either)
import Data.Foldable (for_, traverse_)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Newtype (unwrap)
import Data.Nullable (toMaybe, toNullable)
import Data.Symbol (SProxy(..))
import Effect.Aff (Milliseconds(..))
import Effect.Aff as Aff
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Effect.Class.Console (logShow)
import Effect.Exception (error)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Query.EventSource (EventSource)
import Halogen.Query.EventSource as EventSource
import Halogen.Query.HalogenM (SubscriptionId(..))
import Incentknow.Api (Format, Work, createBlankWork, createContent, getFormat, onSnapshotWork, updateBlankWork)
import Incentknow.Api.Utils (Fetch, Remote(..), executeApi, fetchApi, forFetch, subscribeApi)
import Incentknow.Api.Utils as R
import Incentknow.AppM (class Behaviour, navigate, pushState)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Atoms.Message (SaveState(..), saveState)
import Incentknow.Data.Ids (SpaceId(..), WorkId(..), FormatId(..))
import Incentknow.Data.Property (getDefaultValue, toPropertyInfo)
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SpaceMenu as SpaceMenu
import Incentknow.Organisms.Content.Editor as Editor
import Incentknow.Route (Route(..))
import Incentknow.Templates.Page (section)

data Input
  = NewInput (Maybe SpaceId) (Maybe FormatId)
  | DraftInput WorkId

instance eqInput :: Eq Input where
  eq (NewInput a b) (NewInput a' b') = a == a' && b == b'
  eq (DraftInput a) (DraftInput a') = a == a'
  eq _ _ = false

type State
  = { input :: Input
    , spaceId :: Maybe SpaceId
    , formatId :: Maybe FormatId
    , format :: Remote Format
    , value :: Json
    , workId :: Maybe WorkId
    , saveState :: SaveState
    , loading :: Boolean
    , workSubId :: Maybe SubscriptionId
    , timerSubId :: Maybe SubscriptionId
    }

data Action
  = Initialize
  | Load
  | HandleInput Input
  | ChangeSpace (Maybe SpaceId)
  | ChangeFormat (Maybe FormatId)
  | ChangeValue Json
  | ChangeWork (Maybe Work)
  | CheckChage
  | FetchedFormat (Fetch Format)
  | Create

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( editor :: Editor.Slot Unit
    , spaceMenu :: SpaceMenu.Slot Unit
    , formatMenu :: FormatMenu.Slot Unit
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
            , handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input = case input of
  NewInput spaceId formatId ->
    { input: input
    , spaceId: spaceId
    , formatId: formatId
    , format: Loading
    , value: jsonNull
    , workId: Nothing
    , saveState: HasNotChange
    , loading: false
    , workSubId: Nothing
    , timerSubId: Nothing
    }
  DraftInput workId ->
    { input: input
    , spaceId: Nothing
    , formatId: Nothing
    , format: Loading
    , value: jsonNull
    , workId: Just workId
    , saveState: HasNotChange
    , loading: false
    , workSubId: Nothing
    , timerSubId: Nothing
    }

editor_ = SProxy :: SProxy "editor"

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  section "page-new-content"
    [ HH.div [ css "page-new-content" ]
        [ saveState state.saveState
        , HH.div
            [ css "menu" ]
            [ HH.slot (SProxy :: SProxy "spaceMenu") unit SpaceMenu.component { value: state.spaceId, disabled: false } (Just <<< ChangeSpace)
            , HH.slot (SProxy :: SProxy "formatMenu") unit FormatMenu.component { value: state.formatId, filter: maybe FormatMenu.None FormatMenu.SpaceBy state.spaceId, disabled: false } (Just <<< ChangeFormat)
            ]
        , remoteWith state.format \format ->
            HH.slot editor_ unit Editor.component { format: format, value: state.value, env: { spaceId: state.spaceId } } (Just <<< ChangeValue)
        , submitButton
            { isDisabled: isNothing state.spaceId || isNothing state.formatId || state.loading
            , isLoading: state.loading
            , text: "作成"
            , loadingText: "作成中"
            , onClick: Create
            }
        ]
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

changeRoute :: forall o m. Behaviour m => Route -> H.HalogenM State Action ChildSlots o m Unit
changeRoute route = do
  navigate route

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.workSubId \subId ->
      H.unsubscribe subId
    handleAction Load
    when (isNothing state.timerSubId) do
      timerSubId <- H.subscribe timer
      H.modify_ _ { timerSubId = Just timerSubId }
  Load -> do
    state <- H.get
    case state.input of
      NewInput spaceId formatId -> H.modify_ _ { spaceId = spaceId, formatId = formatId }
      DraftInput workId -> do
        workSubId <- subscribeApi (toMaybe >>> ChangeWork) $ onSnapshotWork (unwrap workId)
        H.modify_ _ { workId = Just workId, workSubId = Just workSubId }
    H.gets _.formatId
      >>= traverse_ \formatId -> do
          fetchApi FetchedFormat $ getFormat formatId
  FetchedFormat fetch -> do
    forFetch fetch \format ->
      H.modify_ _ { format = format, value = fromMaybe jsonNull $ map (\x -> getDefaultValue $ map toPropertyInfo x.structure.properties) $ R.toMaybe format }
  ChangeWork maybeWork -> do
    state <- H.get
    when (state.saveState == HasNotChange || state.saveState == Saved) do
      for_ maybeWork \work ->
        H.modify_ _ { spaceId = toMaybe work.spaceId, format = Holding work.format, formatId = Just work.formatId, value = work.data }
  HandleInput input -> do
    state <- H.get
    when (state.input /= input) do
      H.put $ initialState input
      handleAction Load
  ChangeSpace spaceId -> do
    state <- H.get
    when (state.spaceId /= spaceId) do
      H.modify_ _ { spaceId = spaceId }
      case state.workId of
        Nothing -> pushState $ NewContent spaceId state.formatId
        Just _ -> pure unit
  ChangeFormat formatId -> do
    state <- H.get
    when (state.formatId /= formatId) do
      case state.workId of
        Just _ -> pure unit
        Nothing -> pushState $ NewContent state.spaceId formatId
      H.modify_ _ { formatId = formatId, format = Loading }
      for_ formatId \formatId -> do
        fetchApi FetchedFormat $ getFormat formatId
  ChangeValue value -> do
    state <- H.get
    case state.saveState of
      Saving -> H.modify_ _ { value = value, saveState = SavingButChanged }
      _ -> H.modify_ _ { value = value, saveState = NotSaved }
  CheckChage -> do
    state <- H.get
    when (state.saveState == NotSaved && not state.loading) do
      for_ (R.toMaybe state.format) \format -> do
        H.modify_ _ { saveState = Saving }
        for_ state.formatId \formatId -> do
          case state.workId of
            Just workId -> do
              result <- executeApi $ updateBlankWork { structureId: format.defaultStructureId, workId, spaceId: toNullable state.spaceId, formatId, data: state.value }
              case result of
                Just _ -> makeSaveStateSaved
                Nothing -> H.modify_ _ { saveState = NotSaved }
            Nothing -> do
              result <- executeApi $ createBlankWork { structureId: format.defaultStructureId, formatId, spaceId: toNullable state.spaceId, data: state.value }
              case result of
                Just workId -> do
                  pushState $ EditWork workId
                  H.modify_ _ { input = DraftInput workId, workId = Just workId }
                  makeSaveStateSaved
                Nothing -> H.modify_ _ { saveState = NotSaved }
  Create -> do
    state <- H.get
    let
      newContent = do
        spaceId <- state.spaceId
        formatId <- state.formatId
        pure
          { spaceId: spaceId
          , formatId: formatId
          , data: state.value
          , workId: toNullable state.workId
          }
    for_ newContent \newContent -> do
      H.modify_ _ { loading = true }
      result <- executeApi $ createContent newContent
      for_ result \contentId -> do
        navigate $ EditContent contentId
      H.modify_ _ { loading = false }
  where
  makeSaveStateSaved :: H.HalogenM State Action ChildSlots o m Unit
  makeSaveStateSaved = do
    state <- H.get
    when (state.saveState == Saving) do
      H.modify_ _ { saveState = Saved }
