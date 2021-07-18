module Incentknow.Pages.EditMaterial where

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
import Incentknow.API (commitContent, commitMaterial, createNewContentDraft, createNewMaterialDraft, editContentDraft, editMaterialDraft, getContentDraft, getFocusedFormat, getFocusedFormatByStructure, getFormat, getMaterialDraft, startContentEditing, startMaterialEditing)
import Incentknow.API.Execution (Fetch, Remote(..), callCommand, callbackQuery, executeAPI, executeCommand, forItem, forRemote, toMaybe)
import Incentknow.API.Execution as R
import Incentknow.AppM (class Behaviour, navigate, pushState)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Atoms.Message (SaveState(..), saveState)
import Incentknow.Data.Entities (FocusedContentDraft, FocusedFormat, FocusedMaterialDraft, MaterialType(..))
import Incentknow.Data.Ids (ContentDraftId, ContentId, FormatId(..), SpaceId(..), StructureId)
import Incentknow.Data.Property (getDefaultValue)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.PlainTextEditor as PlainTextEditor
import Incentknow.Molecules.SpaceMenu as SpaceMenu
import Incentknow.Molecules.StructureMenu as StructureMenu
import Incentknow.Organisms.Content.Editor as Editor
import Incentknow.Route (EditTarget(..), MaterialEditTarget(..), Route(..))
import Incentknow.Templates.Page (section)

-- A type which defines the draft by three kind sources
type State
  = { -- the format and the value of the editor value :: Json
    -- the save state
    saveState :: SaveState
    -- is loading of a commit
    , loading :: Boolean
    -- the subscription id of a interval save timer
    , timerSubId :: Maybe SubscriptionId
    , target :: MaterialEditTarget
    , text :: String
    , draft :: Remote FocusedMaterialDraft
    }

data Action
  = Initialize
  | Load
  | HandleInput MaterialEditTarget
  | ChangeSpace (Maybe SpaceId)
  | ChangeText String
  | CheckChage
  | FetchedDraft (Fetch FocusedMaterialDraft)
  | Commit

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( plainTextEditor :: PlainTextEditor.Slot Unit
    , spaceMenu :: SpaceMenu.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q MaterialEditTarget o m
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

initialState :: MaterialEditTarget -> State
initialState input =
  { target: input
  , saveState: HasNotChange
  , loading: false
  , timerSubId: Nothing
  , text: ""
  , draft: Loading
  }

editor_ = SProxy :: SProxy "editor"

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  section "page-new-content"
    [ HH.div [ css "page-new-content" ]
        [ saveState state.saveState
        , case state.target of
            MaterialTargetBlank spaceId ->
              HH.text ""
            _ -> HH.text ""
        , HH.slot (SProxy :: SProxy "plainTextEditor") unit PlainTextEditor.component { value: state.text, variableHeight: true, readonly: false }
            (Just <<< ChangeText)
        , case state.target, state.draft of
            MaterialTargetBlank _, _ -> HH.text ""
            MaterialTargetDraft _, Holding draft ->
              if draft.material == Nothing then
                submitButton
                  { isDisabled: state.loading
                  , isLoading: state.loading
                  , text: "作成"
                  , loadingText: "作成中"
                  , onClick: Commit
                  }
              else
                submitButton
                  { isDisabled: state.loading
                  , isLoading: state.loading
                  , text: "変更"
                  , loadingText: "変更中"
                  , onClick: Commit
                  }
            MaterialTargetDraft _, _ ->
              submitButton
                { isDisabled: state.loading
                , isLoading: state.loading
                , text: "変更"
                , loadingText: "変更中"
                , onClick: Commit
                }
            MaterialTargetMaterial _, _ ->
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
      MaterialTargetBlank spaceId -> do
        -- set the selected value
        H.modify_ _ { target = MaterialTargetBlank spaceId }
      MaterialTargetDraft draftId -> do
        -- fetch the draft
        callbackQuery FetchedDraft $ getMaterialDraft draftId
      MaterialTargetMaterial materialId -> do
        -- get or create a draft of the specified content and fetch the draft id
        maybeDraft <- executeCommand $ startMaterialEditing materialId Nothing
        for_ maybeDraft \draft ->
          navigate $ EditMaterial $ MaterialTargetDraft draft.draftId
  -- Fetch
  FetchedDraft fetch -> do
    forRemote fetch \draft ->
      H.modify_ _ { text = fromMaybe "" $ map _.data $ R.toMaybe draft, draft = draft }
  -- Change
  ChangeSpace spaceId -> do
    state <- H.get
    -- Change url if the draft is not created
    case state.target of
      MaterialTargetBlank oldSpaceId -> do
        H.modify_ _ { target = MaterialTargetBlank spaceId }
        when (spaceId /= oldSpaceId) do
          navigate $ EditMaterial $ MaterialTargetBlank spaceId
      _ -> pure unit
  ChangeText text -> do
    state <- H.get
    -- Set the value and change the save state
    case state.saveState of
      Saving -> H.modify_ _ { text = text, saveState = SavingButChanged }
      _ -> H.modify_ _ { text = text, saveState = NotSaved }
  -- Save changes if they happened
  CheckChage -> do
    state <- H.get
    -- when active state for save
    when (state.saveState == NotSaved && not state.loading) do
      -- Set the save state
      H.modify_ _ { saveState = Saving }
      case state.target of
        MaterialTargetBlank spaceId -> do
          result <- executeCommand $ createNewMaterialDraft spaceId MaterialTypeDocument (Just state.text)
          case result of
            Just draft -> do
              pushState $ EditMaterial $ MaterialTargetDraft draft.draftId
              H.modify_ _ { target = MaterialTargetDraft draft.draftId }
              makeSaveStateSaved
            Nothing -> H.modify_ _ { saveState = NotSaved }
        MaterialTargetDraft draftId -> do
          result <- executeCommand $ editMaterialDraft draftId state.text
          case result of
            Just _ -> makeSaveStateSaved
            Nothing -> H.modify_ _ { saveState = NotSaved }
        MaterialTargetMaterial _ -> pure unit
  Commit -> do
    state <- H.get
    case state.target of
      MaterialTargetDraft draftId -> do
        H.modify_ _ { loading = true }
        result <- executeCommand $ commitMaterial draftId state.text
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
