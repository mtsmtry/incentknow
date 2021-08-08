module Incentknow.Molecules.ContentLink where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (FocusedContent, RelatedContent)
import Incentknow.Data.Ids (ContentId)
import Incentknow.HTML.Utils (link)
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)
import Incentknow.Route (Route(..))
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { value :: RelatedContent }

type State
  = { content :: RelatedContent }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = (  )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
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
  { content: input.value
  }

render :: forall m. State -> H.ComponentHTML Action ChildSlots m
render state =
  link Navigate (Content state.content.contentId)
    []
    [ HH.text common.title ]
  where
  common = getContentSemanticData state.content.data state.content.format

toSelectMenuItem :: FocusedContent -> SelectMenuItem ContentId
toSelectMenuItem content =
  { id: content.contentId
  , name: unwrap content.contentId
  , searchWord: unwrap content.contentId
  , html: html
  }
  where
  html :: forall a s m. H.ComponentHTML a s m
  html =
    HH.div []
      [ HH.text $ unwrap content.contentId
      ]

handleAction :: forall m o. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put $ initialState input
  Navigate e route -> navigateRoute e route
