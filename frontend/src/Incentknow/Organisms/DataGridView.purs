module Incentknow.Organisms.DataGridView where

import Prelude

import Data.Argonaut.Core (toString)
import Data.Array (head)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Data.Entities (FocusedFormat, PropertyInfo, RelatedUser, RelatedContent)
import Incentknow.Data.Property (Property, mkProperties)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, link, link_, maybeElem)
import Incentknow.Route (Route)
import Incentknow.Route as R
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
  = ()

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
    [ css "org-structure" ]
    [ HH.table_
        [ HH.thead
            []
            [ HH.tr []
                (map renderHeaderColumn properties)
            ]
        , HH.tbody
            []
            (map renderContent state.items)
        ]
    ]
  where
  properties = maybe [] (\x-> x.format.currentStructure.properties) $ head state.items

  renderHeaderColumn :: PropertyInfo -> H.ComponentHTML Action ChildSlots m
  renderHeaderColumn prop = HH.th [] [ HH.text prop.displayName ]

  renderCell :: Property -> H.ComponentHTML Action ChildSlots m
  renderCell prop = HH.td [] [ HH.text $ fromMaybe "" $ toString prop.value ]

  renderContent :: RelatedContent -> H.ComponentHTML Action ChildSlots m
  renderContent item =
    HH.tr [] (map renderCell $ mkProperties item.data properties)

handleAction :: forall o s m. Behaviour m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput props -> H.put $ initialState props
  Navigate event route -> navigateRoute event route
