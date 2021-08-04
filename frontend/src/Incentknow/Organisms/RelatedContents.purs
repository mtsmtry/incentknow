module Incentknow.Organisms.RelatedContents where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen (liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getContentsByProperty)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (RelatedContent, Relation)
import Incentknow.Data.Ids (SpaceId)
import Incentknow.Organisms.ContentList as ContentList
import Test.Unit.Console (consoleLog)

type Input
  = { spaceId :: SpaceId, relation :: Relation, value :: String }

type State
  = { relation :: Relation
    , contents :: Remote (Array RelatedContent)
    , value :: String
    , spaceId :: SpaceId
    }

data Action
  = Initialize
  | HandleInput Input
  | Load
  | FetchedContents (Fetch (Array RelatedContent))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( contentList :: ContentList.Slot Unit
    )

component :: forall o q m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { handleAction = handleAction
            , initialize = Just Initialize
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input =
  { relation: input.relation
  , value: input.value
  , spaceId: input.spaceId
  , contents: Loading
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  remoteWith state.contents \contents->
    HH.slot (SProxy :: SProxy "contentList") unit ContentList.component { value: contents } absurd
    
handleAction :: forall o s m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> 
    handleAction Load
  HandleInput input -> do
    H.put $ initialState input
    liftEffect $ consoleLog input.value
    handleAction Load
  Load -> do
    state <- H.get
    callbackQuery FetchedContents $ getContentsByProperty state.spaceId state.relation.formatId state.relation.property.id state.value
  FetchedContents fetch -> do
    forRemote fetch \contents->
      H.modify_ _ { contents = contents }
  