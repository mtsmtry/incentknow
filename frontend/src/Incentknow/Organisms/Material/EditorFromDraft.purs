module Incentknow.Organisms.Material.EditorFromDraft where

import Prelude

import Control.Monad.Rec.Class (forever)
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
import Incentknow.API (createNewMaterialDraft, editMaterialDraft)
import Incentknow.API.Execution (executeCommand)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Message (SaveState(..))
import Incentknow.Data.Entities (BlockData(..), FocusedMaterialDraft, MaterialData(..), MaterialType(..))
import Incentknow.Data.Ids (MaterialDraftId)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.Material.Editor as Editor
import Incentknow.Organisms.Material.Utils (createNewMaterialData)
import Incentknow.Route (Route)

type Input 
  = { value :: Maybe FocusedMaterialDraft }

type Output
    = MaterialDraftId

-- A type which defines the draft by three kind sources
type State
  = { saveState :: SaveState
    -- is loading of a commit
    , loading :: Boolean
    -- the subscription id of a interval save timer
    , timerSubId :: Maybe SubscriptionId
    , data :: MaterialData
    , draftId :: Maybe MaterialDraftId
    }

data Action
  = Initialize
  | Finalize
  | HandleInput Input
  | ChangeData MaterialData
  | CheckChange

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( editor :: Editor.Slot Unit
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
            , finalize = Just Finalize
            , handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input =
  { saveState: HasNotChange
  , loading: false
  , timerSubId: Nothing
  , data: fromMaybe (DocumentMaterialData { blocks: [{id:wrap "", data:ParagraphBlockData ""}] }) $ map _.data input.value
  , draftId: map _.draftId input.value
  }

editor_ = SProxy :: SProxy "editor"

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-new-content" ]
    [ HH.slot (SProxy :: SProxy "editor") unit Editor.component { value: state.data }
        (Just <<< ChangeData)
    ]

timer :: forall m. MonadAff m => EventSource m Action
timer =
  EventSource.affEventSource \emitter -> do
    fiber <-
      Aff.forkAff
        $ forever do
            Aff.delay $ Milliseconds 2000.0
            EventSource.emit emitter CheckChange
    pure
      $ EventSource.Finalizer do
          Aff.killFiber (error "Event source finalized") fiber

changeRoute :: forall o m. Behaviour m => Route -> H.HalogenM State Action ChildSlots o m Unit
changeRoute route = do
  navigate route

handleAction :: forall m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  HandleInput input -> handleAction Initialize
  Finalize -> handleAction CheckChange
  Initialize -> do
    state <- H.get
    -- Subscrive a interval save timer
    when (isNothing state.timerSubId) do
      timerSubId <- H.subscribe timer
      H.modify_ _ { timerSubId = Just timerSubId }
    when (isNothing state.draftId) do
      newData <- createNewMaterialData MaterialTypeDocument
      H.modify_ _ { data = newData }
  -- Change
  ChangeData data2 -> do
    state <- H.get
    -- Set the value and change the save state
    case state.saveState of
      Saving -> H.modify_ _ { data = data2, saveState = SavingButChanged }
      _ -> H.modify_ _ { data = data2, saveState = NotSaved }
  -- Save changes if they happened
  CheckChange -> do
    state <- H.get
    -- when active state for save
    when (state.saveState == NotSaved && not state.loading) do
      -- Set the save state
      H.modify_ _ { saveState = Saving }
      case state.draftId of
        Just draftId -> do
          result <- executeCommand $ editMaterialDraft draftId state.data
          case result of
              Just _ -> makeSaveStateSaved
              Nothing -> H.modify_ _ { saveState = NotSaved }
        Nothing -> do
          result <- executeCommand $ createNewMaterialDraft Nothing MaterialTypeDocument state.data
          case result of
              Just draft -> do
                makeSaveStateSaved
                H.modify_ _ { draftId = Just draft.draftId }
                H.raise draft.draftId
              Nothing -> H.modify_ _ { saveState = NotSaved }
  where
  makeSaveStateSaved :: H.HalogenM State Action ChildSlots Output m Unit
  makeSaveStateSaved = do
    state <- H.get
    when (state.saveState == Saving) do
      H.modify_ _ { saveState = Saved }
