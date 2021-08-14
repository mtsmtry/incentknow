module Incentknow.Pages.Space where

import Prelude

import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getSpace)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (FocusedSpace)
import Incentknow.Data.Ids (FormatDisplayId, SpaceDisplayId)
import Incentknow.Pages.Space.SpaceContainers as SpaceContainers
import Incentknow.Pages.Space.SpaceInfo as SpaceInfo
import Incentknow.Route (SpaceTab)
import Incentknow.Templates.Main (centerLayout)

type Input
  = { spaceId :: SpaceDisplayId, tab :: Either SpaceTab (Maybe FormatDisplayId) }

type State
  = { spaceId :: SpaceDisplayId
    , tab :: Either SpaceTab (Maybe FormatDisplayId)
    , space :: Remote FocusedSpace
    }

data Action
  = Initialize
  | HandleInput Input
  | FetchedSpace (Fetch FocusedSpace)

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( spaceInfo :: SpaceInfo.Slot Unit
    , spaceContainers :: SpaceContainers.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
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
  { spaceId: input.spaceId
  , space: Loading
  , tab: input.tab
  }


render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  remoteWith state.space \space ->
    centerLayout { leftSide: [], rightSide: [] }
      [ case state.tab of
          Left tab -> HH.slot (SProxy :: SProxy "spaceInfo") unit SpaceInfo.component { space, tab } absurd
          Right formatId -> HH.slot (SProxy :: SProxy "spaceContainers") unit SpaceContainers.component { space, formatId } absurd
      ]
  
handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedSpace $ getSpace state.spaceId
  FetchedSpace fetch ->
    forRemote fetch \space->
      H.modify_ _ { space = space }
  HandleInput input -> do
    state <- H.get
    if state.spaceId /= input.spaceId then do
      H.put $ initialState input
      handleAction Initialize
    else
      H.modify_ _ { tab = input.tab }