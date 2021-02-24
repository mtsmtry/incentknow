module Incentknow.Pages.NewContent where

import Prelude
import Control.Monad.Rec.Class (forever)
import Data.Argonaut.Core (Json, jsonNull, stringify)
import Data.Argonaut.Parser (jsonParser)
import Data.Either (either)
import Data.Foldable (for_, traverse_)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Newtype (unwrap)
import Data.Symbol (SProxy(..))
import Data.Traversable (for)
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
import Incentknow.API (getContentDraft, getFormat, createNewContentDraft, startContentEditing)
import Incentknow.API.Execution (Fetch, Remote(..), executeAPI, fetchAPI, forFetch, toMaybe)
import Incentknow.API.Execution as R
import Incentknow.AppM (class Behaviour, navigate, pushState)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Atoms.Message (SaveState(..), saveState)
import Incentknow.Data.Entities (FocusedFormat, FocusedContentDraft)
import Incentknow.Data.Ids (ContentDraftId, ContentId, FormatId(..), SpaceId(..))
import Incentknow.Data.Property (getDefaultValue)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SpaceMenu as SpaceMenu
import Incentknow.Organisms.Content.Editor as Editor
import Incentknow.Route (Route(..))
import Incentknow.Templates.Page (section)

-- A type which defines the draft by three kind sources
data Input
  = NewInput (Maybe SpaceId) (Maybe FormatId)
  | DraftInput ContentDraftId
  | ContentInput ContentId

derive instance eqInput :: Eq Input

data DraftPhase
  = Blank
  | BlankDraft
  | Draft

getDraftPhase :: State -> DraftPhase
getDraftPhase state =
  if isNothing state.draftId then
    Blank
  else
    if state.draft == Loading then
      BlankDraft
    else
      Draft

type State
  = { input :: Input
    -- the selected value
    , spaceId :: Maybe SpaceId
    , formatId :: Maybe FormatId
    -- the format and the value of the editor
    , format :: Remote FocusedFormat
    , value :: Json
    -- the save state
    , saveState :: SaveState
    -- is loading of a commit
    , loading :: Boolean
    -- the subscription id of a interval save timer
    , timerSubId :: Maybe SubscriptionId
    }

data Action
  = Initialize
  | Load
  | HandleInput Input
  | ChangeSpace (Maybe SpaceId)
  | ChangeFormat (Maybe FormatId)
  | ChangeValue Json
  | CheckChage
  | FetchedFormat (Fetch FocusedFormat)
  | FetchedDraft (Fetch FocusedContentDraft)
  | FetchedDraftId (Fetch ContentDraftId)
  | Commit

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
    , draftId: Nothing
    , saveState: HasNotChange
    , loading: false
    , timerSubId: Nothing
    }
  DraftInput draftId ->
    { input: input
    , spaceId: Nothing
    , formatId: Nothing
    , format: Loading
    , value: jsonNull
    , draftId: Just draftId
    , saveState: HasNotChange
    , loading: false
    , timerSubId: Nothing
    }

editor_ = SProxy :: SProxy "editor"

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  section "page-new-content"
    [ HH.div [ css "page-new-content" ]
        [ saveState state.saveState
        , whenElem (draftPhase == Blank)
            HH.div
            [ css "menu" ]
            [ HH.slot (SProxy :: SProxy "spaceMenu") unit SpaceMenu.component { value: state.spaceId, disabled: false } (Just <<< ChangeSpace)
            , whenElem (isNothing state.contentId)
                HH.slot
                (SProxy :: SProxy "formatMenu")
                unit
                FormatMenu.component
                { value: state.formatId, filter: maybe FormatMenu.None FormatMenu.SpaceBy state.spaceId, disabled: false }
                (Just <<< ChangeFormat)
            ]
        , remoteWith state.format \format ->
            HH.slot editor_ unit Editor.component { format: format, value: state.value, env: { spaceId: state.spaceId } } (Just <<< ChangeValue)
        , case draftPhase of
            Blank -> HH.text ""
            BlankDraft _ _ ->
              submitButton
                { isDisabled: isNothing state.spaceId || isNothing state.formatId || state.loading
                , isLoading: state.loading
                , text: "作成"
                , loadingText: "作成中"
                , onClick: Commit
                }
            Draft _ _ ->
              submitButton
                { isDisabled: isNothing (toMaybe state.data) || state.loading || state.disabled
                , isLoading: state.loading
                , text: "変更"
                , loadingText: "変更中"
                , onClick: Commit
                }
        ]
    ]
  where
  draftPhase = getDraftPhase state

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
    -- Load resources
    handleAction Load
    -- Subscrive a interval save timer
    when (isNothing state.timerSubId) do
      timerSubId <- H.subscribe timer
      H.modify_ _ { timerSubId = Just timerSubId }
  HandleInput input -> do
    state <- H.get
    -- Load resources
    when (state.input /= input) do
      H.put $ initialState input
      handleAction Load
  Load -> do
    state <- H.get
    case state.input of
      NewInput spaceId formatId -> do
        -- set the selected value
        H.modify_ _ { spaceId = spaceId, formatId = formatId }
        -- fetch the format
        H.gets _.formatId
          >>= traverse_ \formatId -> do
              fetchAPI FetchedFormat $ getFormat formatId
      DraftInput draftId -> do
        -- fetch the draft
        fetchAPI FetchedDraft $ getContentDraft draftId
      ContentInput contentId -> do
        -- get or create a draft of the specified content and fetch the draft id
        fetchAPI FetchedDraftId $ startContentEditing contentId Nothing
  -- Fetch
  FetchedFormat fetch -> do
    forFetch fetch \format ->
      H.modify_ _ { format = format, value = fromMaybe jsonNull $ map (\x -> getDefaultValue x.structure.properties) $ R.toMaybe format }
  FetchedDraft fetch -> do
    forFetch fetch \draft ->
      H.modify_ _ { format = draft.format, value = draft.data }
  FetchedDraftId fetch -> do
    forFetch fetch \remoteDraftId ->
      H.modify_ _ { draftId = toMaybe remoteDraftId }
        -- fetch the draft
        for
        (toMaybe remoteDraftId) \draftId ->
        fetchAPI FetchedDraft $ getContentDraft draftId
  -- Change
  ChangeSpace spaceId -> do
    state <- H.get
    when (state.spaceId /= spaceId) do
      H.modify_ _ { spaceId = spaceId }
      -- Change url if the draft is not created
      case getDraftPhase state of
        Blank -> pushState $ NewContent spaceId state.formatId
        _ -> pure unit
  ChangeFormat formatId -> do
    state <- H.get
    when (state.formatId /= formatId) do
      -- Change url if the draft is not created
      case getDraftPhase state of
        Blank -> pushState $ NewContent state.spaceId formatId
        _ -> pure unit
      -- Reload the format
      H.modify_ _ { formatId = formatId, format = Loading }
      for_ formatId \formatId -> do
        fetchAPI FetchedFormat $ getFormat formatId
  ChangeValue value -> do
    state <- H.get
    -- Set the value and change the save state
    case state.saveState of
      Saving -> H.modify_ _ { value = value, saveState = SavingButChanged }
      _ -> H.modify_ _ { value = value, saveState = NotSaved }
  -- Save changes if they happened
  CheckChage -> do
    state <- H.get
    -- when active state for save
    when (state.saveState == NotSaved && not state.loading) do
      for_ (toMaybe state.format) \format -> do
        -- Set the save state
        H.modify_ _ { saveState = Saving }
        for_ state.formatId \formatId -> do
          case getDraftPhase state of
            Blank -> do
              result <- executeAPI $ createNewContentDraft state.format state.spaceId
              case result of
                Just draftId -> do
                  pushState $ EditDraft draftId
                  H.modify_ _ { input = DraftInput workId, workId = Just workId }
                  makeSaveStateSaved
                Nothing -> H.modify_ _ { saveState = NotSaved }
            BlankDraft draftId -> do
              result <- executeAPI $ edit { structureId: format.defaultStructureId, workId, spaceId: toNullable state.spaceId, formatId, data: state.value }
              case result of
                Just _ -> makeSaveStateSaved
                Nothing -> H.modify_ _ { saveState = NotSaved }
  Commit -> do
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
      result <- executeAPI $ createContent newContent
      for_ result \contentId -> do
        navigate $ EditContent contentId
      H.modify_ _ { loading = false }
  where
  makeSaveStateSaved :: H.HalogenM State Action ChildSlots o m Unit
  makeSaveStateSaved = do
    state <- H.get
    when (state.saveState == Saving) do
      H.modify_ _ { saveState = Saved }
