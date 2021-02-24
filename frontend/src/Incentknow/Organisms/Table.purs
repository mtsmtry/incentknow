module Incentknow.Organisms.Table where

import Prelude
import Data.Array (singleton)
import Data.Maybe (Maybe(..), maybe)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.HTML.Utils (css, link_)
import Incentknow.Route (Route)
import Web.UIEvent.MouseEvent (MouseEvent)

data TableCell
  = TableCell (Maybe Route) String

data TableRow
  = TableRow (Array TableCell)

type Input
  = { headers :: Array String
    , rows :: Array TableRow
    }

type State
  = { headers :: Array String
    , rows :: Array TableRow
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. Behaviour m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { headers: input.headers, rows: input.rows }

render :: forall m. State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.table [ css "org-table" ]
    [ HH.thead []
        [ HH.tr [] (map renderHeader state.headers)
        ]
    , HH.tbody [] (map renderRow state.rows)
    ]
  where
  renderHeader :: String -> H.ComponentHTML Action ChildSlots m
  renderHeader str = HH.th [] [ HH.text str ]

  renderRow :: TableRow -> H.ComponentHTML Action ChildSlots m
  renderRow (TableRow cells) = HH.tr [] (map renderCell cells)

  renderCell :: TableCell -> H.ComponentHTML Action ChildSlots m
  renderCell (TableCell maybeRoute text) =
    HH.td []
      [ case maybeRoute of
          Just route -> link_ Navigate route [ HH.text text ]
          Nothing -> HH.text text
      ]

handleAction :: forall o m. Behaviour m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put $ initialState input
  Navigate event route -> navigateRoute event route
