module Incentknow.Pages.Container where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getContentsByDisplayId)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (RelatedContent)
import Incentknow.Data.Ids (FormatDisplayId, SpaceDisplayId)
import Incentknow.Organisms.ContentList as ContentList

type Input
  = { spaceId :: SpaceDisplayId, formatId :: FormatDisplayId }

type State
  = { spaceId :: SpaceDisplayId, formatId :: FormatDisplayId, contents :: Remote (Array RelatedContent) }

data Action
  = Initialize
  | HandleInput Input
  | FetchedContents (Fetch (Array RelatedContent))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( contentList :: ContentList.Slot Unit )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval 
        { initialize = Just Initialize
        , handleAction = handleAction 
        , receive = Just <<< HandleInput
        }
    }

initialState :: Input -> State
initialState input = { spaceId: input.spaceId, formatId: input.formatId, contents: Loading }

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  remoteWith state.contents \contents ->
    HH.slot (SProxy :: SProxy "contentList") unit ContentList.component { value: contents } absurd

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedContents $ getContentsByDisplayId state.spaceId state.formatId
  HandleInput input -> do
    state <- H.get
    when (state.spaceId /= input.spaceId || state.formatId /= input.formatId) do
      H.put $ initialState input
      handleAction Initialize 
  FetchedContents fetch -> do
    forRemote fetch \contents ->
      H.modify_ _ { contents = contents }
