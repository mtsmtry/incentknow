module Incentknow.Pages.SearchAll where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.HTML.Utils (maybeElem)
import Incentknow.Organisms.SearchView (SearchQuery(..))
import Incentknow.Organisms.SearchView as SearchView
import Incentknow.Templates.Main (centerLayout)

type Input
  = { query :: Maybe String }

type State
  = { query :: Maybe String }

data Action
  = Initialize
  | HandleInput Input

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( searchView :: SearchView.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { query: input.query }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  centerLayout { css: "page-search-all", leftSide: [], rightSide: [] }
    [ maybeElem state.query \query->
        HH.slot (SProxy :: SProxy "searchView") unit SearchView.component
          { value: SearchAllQuery query
          }
          absurd
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.modify_ _ { query = input.query }