module Incentknow.Pages.EditContent where

import Prelude

import Control.Monad.Rec.Class (forever)
import Data.Argonaut.Core (Json, jsonNull, stringify)
import Data.Argonaut.Parser (jsonParser)
import Data.Either (either)
import Data.Foldable (for_, traverse_)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Maybe.Utils (flatten)
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
import Incentknow.API (commitContent, createNewContentDraft, editContentDraft, getContentDraft, getFocusedFormat, getFocusedFormatByStructure, getFormat, startContentEditing)
import Incentknow.API.Execution (Fetch, Remote(..), callCommand, callbackQuery, executeAPI, executeCommand, forItem, forRemote, toMaybe)
import Incentknow.API.Execution as R
import Incentknow.AppM (class Behaviour, navigate, pushState)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Atoms.Message (SaveState(..), saveState)
import Incentknow.Data.Entities (FocusedFormat, FocusedContentDraft)
import Incentknow.Data.Ids (ContentDraftId, ContentId, FormatId(..), SpaceId(..), StructureId)
import Incentknow.Data.Property (getDefaultValue)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SpaceMenu as SpaceMenu
import Incentknow.Molecules.StructureMenu as StructureMenu
import Incentknow.Organisms.Content.Editor as Editor
import Incentknow.Route (EditTarget(..), Route(..))
import Incentknow.Templates.Page (section)

-- A type which defines the draft by three kind sources
type State
  = { -- the format and the value of the editor
      format :: Maybe FocusedFormat
    , value :: Json
    -- the save state
    , saveState :: SaveState
    -- is loading of a commit
    , loading :: Boolean
    -- the subscription id of a interval save timer
    , timerSubId :: Maybe SubscriptionId
    , target :: EditTarget
    }

data Action
  = Initialize
  | Load
  | HandleInput EditTarget
  | ChangeSpace (Maybe SpaceId)
  | ChangeStructure (Maybe StructureId)
  | ChangeValue Json
  | CheckChage
  | FetchedFormat (Fetch FocusedFormat)
  | FetchedDraft (Fetch FocusedContentDraft)
  | Commit

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( editor :: Editor.Slot Unit
    , spaceMenu :: SpaceMenu.Slot Unit
    , structureMenu :: StructureMenu.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q EditTarget o m
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

initialState :: EditTarget -> State
initialState input =
  { format: Nothing
  , value: jsonNull
  , target: input
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
        , case state.target of
            TargetBlank spaceId structureId ->
              HH.div
                [ css "menu" ]
                [ HH.slot (SProxy :: SProxy "spaceMenu") unit SpaceMenu.component
                    { value: spaceId, disabled: false }
                    (Just <<< ChangeSpace)
                , HH.slot (SProxy :: SProxy "structureMenu") unit StructureMenu.component
                    { value: structureId, filter: maybe FormatMenu.None FormatMenu.SpaceBy spaceId, disabled: false }
                    (Just <<< ChangeStructure)
                ]
            _ -> HH.text ""
        , maybeElem state.format \format ->
            HH.slot editor_ unit Editor.component
              { format: format
              , value: state.value
              , env:
                  { spaceId:
                      case state.target of
                        TargetBlank spaceId structureId -> spaceId
                        _ -> Nothing
                  }
              }
              (Just <<< ChangeValue)
        , case state.target of
            TargetBlank _ _ -> HH.text ""
            TargetDraft _ ->
              submitButton
                { isDisabled: state.loading
                , isLoading: state.loading
                , text: "作成"
                , loadingText: "作成中"
                , onClick: Commit
                }
            TargetContent _ ->
              submitButton
                { isDisabled: state.loading 
                , isLoading: state.loading
                , text: "変更"
                , loadingText: "変更中"
                , onClick: Commit
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
  HandleInput input -> do
    state <- H.get
    -- Load resources
    when (state.target /= input) do
      H.put $ initialState input
      handleAction Load
  Initialize -> do
    state <- H.get
    -- Load resources
    handleAction Load
    -- Subscrive a interval save timer
    when (isNothing state.timerSubId) do
      timerSubId <- H.subscribe timer
      H.modify_ _ { timerSubId = Just timerSubId }
  Load -> do
    state <- H.get
    case state.target of
      TargetBlank spaceId structureId -> do
        -- set the selected value
        H.modify_ _ { target = TargetBlank spaceId structureId }
        -- fetch the format
        for_ structureId \structureId ->
          callbackQuery FetchedFormat $ getFocusedFormatByStructure structureId
      TargetDraft draftId -> do
        -- fetch the draft
        callbackQuery FetchedDraft $ getContentDraft draftId
      TargetContent contentId -> do
        -- get or create a draft of the specified content and fetch the draft id
        maybeDraftId <- executeCommand $ startContentEditing contentId Nothing
        for_ maybeDraftId \draftId ->
          navigate $ EditContent $ TargetDraft draftId
  -- Fetch
  FetchedFormat fetch -> do
    forRemote fetch \format ->
      H.modify_ _ { format = R.toMaybe format, value = fromMaybe jsonNull $ map getDefaultValue $ map _.currentStructure.properties $ R.toMaybe format }
  FetchedDraft fetch -> do
    forRemote fetch \draft ->
      H.modify_ _ { format = map _.format $ R.toMaybe draft, value = fromMaybe jsonNull $ map _.data $ R.toMaybe draft }
  -- Change
  ChangeSpace spaceId -> do
    state <- H.get
    -- Change url if the draft is not created
    case state.target of
      TargetBlank oldSpaceId structureId -> do
        H.modify_ _ { target = TargetBlank spaceId structureId }
        when (spaceId /= oldSpaceId) do
          navigate $ EditContent $ TargetBlank spaceId structureId
      _ -> pure unit
  ChangeStructure structureId -> do
    state <- H.get
    -- Change url if the draft is not created
    case state.target of
      TargetBlank spaceId oldStructureId -> do
        H.modify_ _ { target = TargetBlank spaceId structureId }
        when (structureId /= oldStructureId) do
          navigate $ EditContent $ TargetBlank spaceId structureId
      _ -> pure unit
    -- Reload the format
    H.modify_ _ { format = Nothing }
    for_ structureId \structureId -> do
      callbackQuery FetchedFormat $ getFocusedFormatByStructure structureId
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
      for_ state.format \format -> do
        -- Set the save state
        H.modify_ _ { saveState = Saving }
        case state.target of
          TargetBlank spaceId structureId -> do
            for_ structureId \structureId -> do
              result <- executeCommand $ createNewContentDraft structureId spaceId (Just state.value)
              case result of
                Just draftId -> do
                  pushState $ EditContent $ TargetDraft draftId
                  H.modify_ _ { target = TargetDraft draftId }
                  makeSaveStateSaved
                Nothing -> H.modify_ _ { saveState = NotSaved }
          TargetDraft draftId -> do
            -- result <- executeAPI $ edit { structureId: format.defaultStructureId, workId, spaceId: toNullable state.spaceId, formatId, data: state.value }
            result <- executeCommand $ editContentDraft draftId state.value
            case result of
              Just _ -> makeSaveStateSaved
              Nothing -> H.modify_ _ { saveState = NotSaved }
          TargetContent _ -> pure unit
  Commit -> do
    state <- H.get
    case state.target of
      TargetDraft draftId -> do
        H.modify_ _ { loading = true }
        result <- executeCommand $ commitContent draftId state.value
        --for_ (flatten result) \commit -> do
        --  navigate $ EditContent $  commit.contentId
        H.modify_ _ { loading = false }
      _ -> pure unit
  where
  makeSaveStateSaved :: H.HalogenM State Action ChildSlots o m Unit
  makeSaveStateSaved = do
    state <- H.get
    when (state.saveState == Saving) do
      H.modify_ _ { saveState = Saved }
