module Incentknow.Organisms.Material.Editor where

import Prelude

import Control.Monad.Rec.Class (forever)
import Data.Maybe (Maybe(..), fromMaybe, isNothing)
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
import Incentknow.API (createNewMaterialDraft, editMaterialDraft, getMaterialDraft)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, executeCommand, forRemote)
import Incentknow.API.Execution as R
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Message (SaveState(..), saveState)
import Incentknow.Data.Entities (FocusedMaterialDraft, MaterialType(..))
import Incentknow.Data.Ids (MaterialDraftId)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.PlainTextEditor as PlainTextEditor
import Incentknow.Molecules.SpaceMenu as SpaceMenu
import Incentknow.Organisms.DocumentEditor as DocumentEditor
import Incentknow.Route (Route)

type Input 
  = { value :: Maybe MaterialDraftId }

type Output
    = MaterialDraftId

-- A type which defines the draft by three kind sources
type State
  = { saveState :: SaveState
    -- is loading of a commit
    , loading :: Boolean
    -- the subscription id of a interval save timer
    , timerSubId :: Maybe SubscriptionId
    , materialDraftId :: Maybe MaterialDraftId
    , text :: String
    , draft :: Remote FocusedMaterialDraft
    }

data Action
  = Initialize
  | Load
  | HandleInput Input
  | ChangeText String
  | CheckChage
  | FetchedDraft (Fetch FocusedMaterialDraft)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( plainTextEditor :: PlainTextEditor.Slot Unit
    , spaceMenu :: SpaceMenu.Slot Unit
    , documentEditor :: DocumentEditor.Slot Unit
    )

component :: forall q m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input Output m
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
initialState input =
  { materialDraftId: input.value
  , saveState: HasNotChange
  , loading: false
  , timerSubId: Nothing
  , text: ""
  , draft: Loading
  }

editor_ = SProxy :: SProxy "editor"

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-new-content" ]
    [ saveState state.saveState
    --, HH.slot (SProxy :: SProxy "plainTextEditor") unit PlainTextEditor.component { value: state.text, variableHeight: true, readonly: false }
    --   (Just <<< ChangeText)
    , HH.slot (SProxy :: SProxy "documentEditor") unit DocumentEditor.component { value: state.text, readonly: false }
        (Just <<< ChangeText)
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

handleAction :: forall m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  HandleInput input -> do
    state <- H.get
    -- Load resources
    when (state.materialDraftId /= input.value) do
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
    case state.materialDraftId of
      Just draftId -> callbackQuery FetchedDraft $ getMaterialDraft draftId
      Nothing -> pure unit
  -- Fetch
  FetchedDraft fetch -> do
    forRemote fetch \draft ->
      H.modify_ _ { text = fromMaybe "" $ map _.data $ R.toMaybe draft, draft = draft }
  -- Change
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
      case state.materialDraftId of
        Just draftId -> do
          result <- executeCommand $ editMaterialDraft draftId state.text
          case result of
              Just _ -> makeSaveStateSaved
              Nothing -> H.modify_ _ { saveState = NotSaved }
        Nothing -> do
          result <- executeCommand $ createNewMaterialDraft Nothing MaterialTypeDocument (Just state.text)
          case result of
              Just draft -> do
                makeSaveStateSaved
                H.modify_ _ { materialDraftId = Just draft.draftId }
                H.raise draft.draftId
              Nothing -> H.modify_ _ { saveState = NotSaved }
  where
  makeSaveStateSaved :: H.HalogenM State Action ChildSlots Output m Unit
  makeSaveStateSaved = do
    state <- H.get
    when (state.saveState == Saving) do
      H.modify_ _ { saveState = Saved }
