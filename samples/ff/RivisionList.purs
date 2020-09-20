module Incentknow.Pages.RivisionList where

import Prelude

import Data.DateTime as DateTime
import Data.DateTime.Instant (instant, toDateTime)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Data.Time.Duration (Milliseconds(..))
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api.Utils (getClient, handleError)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.Atoms.Inputs (button)
import Incentknow.Data.Content (Rivision)
import Incentknow.Data.Ids (ContentId(..))
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (link_, maybeElem)
import Incentknow.Organisms.Content.Viewer as Content
import Incentknow.Route (Route(..))
import Incentknow.Templates.Page (section)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { contentId :: ContentId }

type State
  = { contentId :: ContentId, rivisions :: Maybe (Array Rivision) }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( )

component :: forall q o m. Behaviour m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , receive = Just <<< HandleInput
            , handleAction = handleAction
            }
    }

initialState :: Input -> State
initialState input = { contentId: input.contentId, rivisions: Nothing }

renderRivsion :: forall m. State -> Rivision -> H.ComponentHTML Action ChildSlots m
renderRivsion state rivision =
  link_ Navigate (Rivision state.contentId rivision.info.version)
    [ dateTime rivision.info.timestamp
    ]

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  section "page-rivision-list"
    [ maybeElem state.rivisions \rivisions ->
        HH.div [ ] (map (renderRivsion state) rivisions)
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    client <- getClient
    rivisions <- handleError $ client.contents.byId.rivisions.get { params: { id: state.contentId } }
    H.modify_ _ { rivisions = rivisions }
  HandleInput input -> do
    state <- H.get
    when (input.contentId /= state.contentId) do
      H.put $ initialState input
      handleAction Initialize
  Navigate event route -> navigateRoute event route
