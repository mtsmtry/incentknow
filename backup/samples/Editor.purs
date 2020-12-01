module Incentknow.Pages.Editor where

import CSS.Helper
import Prelude

import CSS.Common as CSSC
import CSS.Cursor as Cursor
import Control.Monad ((*>))
import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff, liftAff)
import Halogen (lift)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.CSS (style)
import Incentknow.Api (Content, client, handleError)
import Incentknow.AppM (class Behaviour)
import Incentknow.Route as R

type Input
  = { contentId :: String }

type State
  = { content :: Maybe Content }

data Action
  = Initialize String

type Slot p
  = forall q. H.Slot q Void p

component :: forall q o m. MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval (H.defaultEval { receive = \x -> Just $ Initialize x.contentId, handleAction = handleAction })
    }

initialState :: Input -> State
initialState input = { content: Nothing }

render :: forall m. State -> H.ComponentHTML Action () m
render state =
  case state.content of
    Just content ->
      HH.div_ [ HH.text content.info.contentId ]
    Nothing ->
      HH.div_ []

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action () o m Unit
handleAction = case _ of
  Initialize contentId -> do
    content <- liftAff $ handleError $ client.contents.byId.get { params: { id: contentId } }
    H.modify_ (_ { content = content })