module Incentknow.Pages.ContentList where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (Content, Space, getContents, getAllSpaceContents)
import Incentknow.Api.Utils (Fetch, Remote(..), executeApi, fetchApi, forFetch)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Organisms.ContentList as ContentList

type Input
  = { space :: Space }

type State
  = { space :: Space, contents :: Remote (Array Content) }

data Action
  = Initialize
  | FetchedContents (Fetch (Array Content))

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
initialState input = { space: input.space, contents: Loading }

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state = 
  remoteWith state.contents \contents->
    HH.slot (SProxy :: SProxy "contentList") unit ContentList.component { value: contents } absurd

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    fetchApi FetchedContents $ getAllSpaceContents state.space.spaceId
  FetchedContents fetch -> do
    forFetch fetch \contents->
      H.modify_ _ { contents = contents }