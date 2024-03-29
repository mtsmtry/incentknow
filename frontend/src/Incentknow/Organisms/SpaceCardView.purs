module Incentknow.Organisms.SpaceCardView where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.API.Static (getHeaderImageUrl)
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (spaceScopeIcon)
import Incentknow.Data.Entities (RelatedSpace)
import Incentknow.HTML.Utils (css, link, whenElem)
import Incentknow.Route (Route(..), SpaceTab(..))
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { value :: Array RelatedSpace
    }

type State
  = { spaces :: Array RelatedSpace
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
initialState input = { spaces: input.value }

render :: forall m. Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-space-cardview" ]
    (map renderItem state.spaces)
  where
  renderItem :: RelatedSpace -> H.ComponentHTML Action ChildSlots m
  renderItem space =
    link Navigate (Space space.displayId SpaceHome)
      [ css "item" ]
      [ HH.div [ css "upper"]
        [ HH.img [ HP.src $ getHeaderImageUrl space.headerImage ]
        ]
      , HH.div [ css "lower" ]
        [ HH.div [ css "left" ]
            [ HH.div [ css "title" ] [ HH.text space.displayName ]
            , HH.div [ css "info" ] 
                [ HH.text space.description
                ]
            ]
        , HH.div [ css "right" ]
            [ HH.div [ css "scope" ] [ spaceScopeIcon space ]
            ]
        ]
      ]

handleAction :: forall o m. MonadEffect m => Behaviour m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput props -> H.put $ initialState props
  Navigate event route -> navigateRoute event route
