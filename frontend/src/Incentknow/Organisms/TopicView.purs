module Incentknow.Organisms.TopicView where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API.Execution (Remote)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.Atoms.Icon (formatWithIcon, remoteArrayWith, remoteWith, userPlate)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (ActivityAction(..), IntactActivityBySpace, FocusedContent)
import Incentknow.Data.Ids (ContentId)
import Incentknow.HTML.Utils (css, link, maybeElem)
import Incentknow.Organisms.ConpactContentView as ConpactContentView
import Incentknow.Route (Route(..), UserTab(..))
import Incentknow.Templates.Page (sectionWithHeader)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { value :: Remote (Array FocusedContent)
    }

type State
  = { contents :: Remote (Array FocusedContent)
    }

data Action
  = Initialize 
  | HandleInput Input
  | Navigate Route
  | NavigateRoute MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( content :: ConpactContentView.Slot ContentId )

component :: forall o q m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input =
  { contents: input.value
  } 

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  sectionWithHeader "org-topic-view"
    [ HH.text "Topics" ]
    [ remoteArrayWith state.contents \contents->
        HH.div []
          (map renderTopic contents)
    ]
  where
  renderTopic :: FocusedContent -> H.ComponentHTML Action ChildSlots m
  renderTopic content =
    HH.div [ css "topic" ]
      [ link NavigateRoute (Container content.format.space.displayId content.format.displayId)
          [ css "top" ]
          [ formatWithIcon content.format
          ]
      , HH.div [ css "content" ]
          [ HH.slot (SProxy :: SProxy "content") content.contentId ConpactContentView.component
              { value: content }
              absurd
          ]
      ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput props -> H.put $ initialState props
  Navigate route -> navigate route
  NavigateRoute event route -> navigateRoute event route