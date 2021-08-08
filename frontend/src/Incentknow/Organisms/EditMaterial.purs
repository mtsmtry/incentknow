module Incentknow.Organisms.EditMaterial where

import Prelude

import Control.Monad.Rec.Class (forever)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), fromMaybe, isNothing)
import Data.Newtype (wrap)
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
import Halogen.Query.HalogenM (SubscriptionId)
import Incentknow.API (commitMaterial, createNewMaterialDraft, editMaterialDraft, getMaterialDraft, startMaterialEditing)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, executeCommand, forRemote, toMaybe)
import Incentknow.AppM (class Behaviour, navigate, pushState)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Atoms.Message (SaveState(..), saveState)
import Incentknow.Data.Entities (BlockData(..), FocusedMaterialDraft, MaterialData(..), MaterialType(..))
import Incentknow.Data.Ids (SpaceId)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.SpaceMenu as SpaceMenu
import Incentknow.Organisms.Document.Editor as DocumentEditor
import Incentknow.Route (EditMaterialTarget(..), EditTarget(..), Route(..))

-- A type which defines the draft by three kind sources
type State
  = { -- the format and the value of the editor value :: Json
    -- the save state
    saveState :: SaveState
    -- is loading of a commit
    , loading :: Boolean
    -- the subscription id of a interval save timer
    , timerSubId :: Maybe SubscriptionId
    , target :: EditMaterialTarget
    , data :: MaterialData
    , draft :: Remote FocusedMaterialDraft
    }

data Action
  = Initialize
  | Load
  | HandleInput EditMaterialTarget
  | ChangeSpace (Maybe SpaceId)
  | ChangeData MaterialData
  | CheckChage
  | FetchedDraft (Fetch FocusedMaterialDraft)
  | Commit

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( documentEditor :: DocumentEditor.Slot Unit
    , spaceMenu :: SpaceMenu.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q EditMaterialTarget o m
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

initialState :: EditMaterialTarget -> State
initialState input =
  { target: input
  , saveState: HasNotChange
  , loading: false
  , timerSubId: Nothing
  , data: DocumentMaterialData { blocks: [] }
  , draft: Loading
  }

editor_ = SProxy :: SProxy "editor"

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-new-content" ]
    [ saveState state.saveState
    , case state.target of
        MaterialTargetBlank spaceId ->
          HH.text ""
        _ -> HH.text ""
    --, HH.slot (SProxy :: SProxy "plainTextEditor") unit PlainTextEditor.component { value: state.text, variableHeight: true, readonly: false }
    --    (Just <<< ChangeText)
    , case state.data of
        DocumentMaterialData doc ->
          HH.slot (SProxy :: SProxy "documentEditor") unit DocumentEditor.component { value: doc }
            (Just <<< ChangeData <<< DocumentMaterialData)
        _ -> HH.text "" 
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
          navigate $ EditDraft $ MaterialTarget $ MaterialTargetDraft draft.draftId
  -- Fetch
  FetchedDraft fetch -> do
    forRemote fetch \draft ->
      H.modify_ _ { data = fromMaybe (DocumentMaterialData { blocks: [{id:wrap "frew", data:ParagraphBlockData "うんこ"}] }) $ map _.data $ toMaybe draft, draft = draft }
  -- Change
  ChangeSpace spaceId -> do
    state <- H.get
    -- Change url if the draft is not created
    case state.target of
      MaterialTargetBlank oldSpaceId -> do
        H.modify_ _ { target = MaterialTargetBlank spaceId }
        when (spaceId /= oldSpaceId) do
          navigate $ EditDraft $ MaterialTarget $ MaterialTargetBlank spaceId
      _ -> pure unit
  ChangeData data2 -> do
    state <- H.get
    -- Set the value and change the save state
    case state.saveState of
      Saving -> H.modify_ _ { data = data2, saveState = SavingButChanged }
      _ -> H.modify_ _ { data = data2, saveState = NotSaved }
  -- Save changes if they happened
  CheckChage -> do
    state <- H.get
    -- when active state for save
    when (state.saveState == NotSaved && not state.loading) do
      -- Set the save state
      H.modify_ _ { saveState = Saving }
      case state.target of
        MaterialTargetBlank spaceId -> do
          result <- executeCommand $ createNewMaterialDraft spaceId MaterialTypeDocument (Just state.data)
          case result of
            Just draft -> do
              pushState $ EditDraft $ MaterialTarget $ MaterialTargetDraft draft.draftId
              H.modify_ _ { target = MaterialTargetDraft draft.draftId }
              makeSaveStateSaved
            Nothing -> H.modify_ _ { saveState = NotSaved }
        MaterialTargetDraft draftId -> do
          result <- executeCommand $ editMaterialDraft draftId state.data
          case result of
            Just _ -> makeSaveStateSaved
            Nothing -> H.modify_ _ { saveState = NotSaved }
        MaterialTargetMaterial _ -> pure unit
  Commit -> do
    state <- H.get
    case state.target of
      MaterialTargetDraft draftId -> do
        H.modify_ _ { loading = true }
        result <- executeCommand $ commitMaterial draftId state.data
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
