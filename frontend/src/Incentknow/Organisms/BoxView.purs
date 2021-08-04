module Incentknow.Organisms.BoxView where

import Prelude

import Data.Array (head, mapWithIndex)
import Data.Maybe (Maybe(..), maybe)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Data.Entities (RelatedContent)
import Incentknow.Organisms.Content.Viewer as ContentViewer
import Incentknow.Route (Route)
import Incentknow.Templates.Page (section)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { items :: Array RelatedContent
    }

type State
  = { items :: Array RelatedContent
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( contentViewer :: ContentViewer.Slot Int )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { items: input.items }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ ]
    (mapWithIndex renderContent state.items)
  where
  properties = maybe [] (\x-> x.format.currentStructure.properties) $ head state.items

  renderContent :: Int -> RelatedContent -> H.ComponentHTML Action ChildSlots m
  renderContent index item =
    section "page-content"
      [ HH.slot (SProxy :: SProxy "contentViewer") index ContentViewer.component 
          { format: item.format, value: item.data } absurd
      ]

handleAction :: forall o s m. Behaviour m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput props -> H.put $ initialState props
  Navigate event route -> navigateRoute event route
