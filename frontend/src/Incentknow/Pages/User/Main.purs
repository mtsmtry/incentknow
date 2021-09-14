module Incentknow.Pages.User.Main where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API.Execution (Remote(..))
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (RelatedContent)
import Incentknow.Data.Ids (UserId)
import Incentknow.Organisms.ContentList as ContentList

type Input
  = { userId :: UserId }

type State
  = { userId :: UserId, list :: Array RelatedContent }

data Action
  = Initialize

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( contentList :: ContentList.Slot Unit )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { userId: input.userId, list: [] }

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state = HH.slot (SProxy :: SProxy "contentList") unit ContentList.component { value: Holding [], query: Nothing } absurd

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    pure unit
 --   response <- handleError $ client.contents.get { query: { spaceId: Nothing, formatId: Nothing, creatorUserId: Just state.userId } }
  --  case response of
  --    Just contentList ->
  --      H.modify_ _ { list = contentList }
  --    Nothing ->
  --      pure unit
