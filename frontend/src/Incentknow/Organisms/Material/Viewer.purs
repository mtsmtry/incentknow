module Incentknow.Organisms.Material.Viewer where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.Query.HalogenM (SubscriptionId)
import Incentknow.API (getMaterial)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Message (SaveState(..))
import Incentknow.Data.Entities (FocusedMaterial)
import Incentknow.Data.Ids (MaterialId)
import Incentknow.Molecules.PlainTextViewer as PlainTextViewer
import Incentknow.Route (Route)

type Input 
  = { value :: Maybe MaterialId }

-- A type which defines the draft by three kind sources
type State
  = { saveState :: SaveState
    -- is loading of a commit
    , loading :: Boolean
    -- the subscription id of a interval save timer
    , timerSubId :: Maybe SubscriptionId
    , materialId :: Maybe MaterialId
    , text :: String
    , material :: Remote FocusedMaterial
    }

data Action
  = Initialize
  | Load
  | HandleInput Input
  | FetchedMaterial (Fetch FocusedMaterial)

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( plainTextViewer :: PlainTextViewer.Slot Unit
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
initialState input =
  { materialId: input.value
  , saveState: HasNotChange
  , loading: false
  , timerSubId: Nothing
  , text: ""
  , material: Loading
  }

editor_ = SProxy :: SProxy "editor"

render :: forall m. Behaviour m => MonadEffect m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  remoteWith state.material \material->
    HH.slot (SProxy :: SProxy "plainTextViewer") unit PlainTextViewer.component { value: material.data } absurd

changeRoute :: forall o m. Behaviour m => Route -> H.HalogenM State Action ChildSlots o m Unit
changeRoute route = do
  navigate route

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  HandleInput input -> do
    state <- H.get
    -- Load resources
    when (state.materialId /= input.value) do
      H.put $ initialState input
      handleAction Load
  Initialize -> do
    state <- H.get
    -- Load resources
    handleAction Load
  Load -> do
    state <- H.get
    case state.materialId of
      Just draftId -> callbackQuery FetchedMaterial $ getMaterial draftId
      Nothing -> pure unit
  FetchedMaterial fetch -> do
    forRemote fetch \material ->
      H.modify_ _ { material = material }
