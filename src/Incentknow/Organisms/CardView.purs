module Incentknow.Organisms.CardView where

import Prelude
import Data.Array (singleton)
import Data.DateTime (DateTime(..))
import Data.Maybe (Maybe(..), maybe)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, link, link_, maybeElem)
import Incentknow.Route (Route, routeToPath)
import Incentknow.Route as R
import Web.Event.Event (preventDefault)
import Web.UIEvent.MouseEvent (MouseEvent, toEvent)

type CardViewItem
  = { title :: String
    , route :: Route
    , desc :: String
    , info :: String
    }

type Input
  = { items :: Array CardViewItem
    }

type State
  = { items :: Array CardViewItem
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. MonadEffect m => Behaviour m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { items: input.items }

render :: forall m. Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-cardview" ]
    (map renderItem state.items)
  where
  renderItem :: CardViewItem -> H.ComponentHTML Action ChildSlots m
  renderItem item =
    link Navigate item.route
      [ css "item" ]
      [ HH.div [ css "title" ] [ HH.text item.title ]
      , HH.div [ css "desc" ] [ HH.text item.desc ]
      , HH.div [ css "info" ] [ HH.text item.info ]
      ]

handleAction :: forall o s m. MonadEffect m => Behaviour m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput props -> H.put $ initialState props
  Navigate event route -> navigateRoute event route
