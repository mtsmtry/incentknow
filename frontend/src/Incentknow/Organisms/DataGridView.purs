module Incentknow.Organisms.DataGridView where

import Prelude

import Data.Argonaut.Core (toString)
import Data.Array (head)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API.Execution (Remote)
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (remoteArrayWith)
import Incentknow.Data.Entities (PropertyInfo, RelatedContent)
import Incentknow.Data.Property (Property, mkProperties)
import Incentknow.HTML.Utils (css)
import Incentknow.Route (Route)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { value :: Remote (Array RelatedContent)
    }

type State
  = { items :: Remote (Array RelatedContent)
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { items: input.value }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-datagridview" ]
    [ remoteArrayWith state.items \items->
        renderTable items
    ]

renderTable :: forall m. Array RelatedContent -> H.ComponentHTML Action ChildSlots m
renderTable items = 
  HH.table_
    [ HH.thead
        []
        [ HH.tr []
            (map renderHeaderColumn properties)
        ]
    , HH.tbody
        []
        (map renderContent items)
    ]
  where
  properties = maybe [] (\x-> x.format.currentStructure.properties) $ head items

  renderHeaderColumn :: PropertyInfo -> H.ComponentHTML Action ChildSlots m
  renderHeaderColumn prop = HH.th [] [ HH.text prop.displayName ]

  renderCell :: Property -> H.ComponentHTML Action ChildSlots m
  renderCell prop = HH.td [] [ HH.text $ fromMaybe "" $ toString prop.value ]

  renderContent :: RelatedContent -> H.ComponentHTML Action ChildSlots m
  renderContent item =
    HH.tr [] (map renderCell $ mkProperties item.data properties)

handleAction :: forall o m. Behaviour m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput props -> H.put $ initialState props
  Navigate event route -> navigateRoute event route
