module Incentknow.Molecules.PlainTextViewer where

import Prelude

import Data.Array (concat)
import Data.String (Pattern(..), split)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Route (Route)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { value :: String }

type State
  = { text :: String }

data Action
  = Navigate MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

component :: forall q o m. Behaviour m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction }
    }

handleAction :: forall o m. Behaviour m => Action -> H.HalogenM State Action () o m Unit
handleAction = case _ of
  Navigate event route -> navigateRoute event route

initialState :: Input -> State
initialState input = { text: input.value }

render :: forall m. State -> H.ComponentHTML Action () m
render state = HH.div [] 
  ( concat $ map (\x-> [HH.text x, HH.br_]) $ split (Pattern "\n") state.text
  )