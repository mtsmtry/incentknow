module Incentknow.Pages.Public where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.HTML.Utils (css)
import Incentknow.Pages.SpaceList as SpaceList

type Input
  = { }

type State
  = { }

data Action
  = Initialize

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( spaceList :: SpaceList.Slot Unit )

component :: forall q o m. Behaviour m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { }

render :: forall m. MonadAff m => Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-public-space-list" ]
    [ HH.slot (SProxy :: SProxy "spaceList") unit SpaceList.component { } absurd
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit