module Incentknow.Pages.Rivision where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Inputs (button)
import Incentknow.Data.Content (Rivision, RivisionAndFormat)
import Incentknow.Data.Ids (ContentId(..))
import Incentknow.HTML.Utils (maybeElem)
import Incentknow.Organisms.Content.Viewer as Content
import Incentknow.Route (Route(..))
import Incentknow.Templates.Page (section)

type Input
  = { contentId :: ContentId, version :: Int }

type State
  = { contentId :: ContentId, version :: Int, data :: Maybe RivisionAndFormat }

data Action
  = Initialize
  | HandleInput Input
  | Navigate Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( content :: Content.Slot Unit )

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
initialState input = { contentId: input.contentId, version: input.version, data: Nothing }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  section "page-rivision"
    [ maybeElem state.data \x->
        HH.slot (SProxy :: SProxy "content") unit Content.component { format: x.format, value: x.rivision.data } absurd
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    client <- getClient
    response <- handleError $ client.contents.byId.rivisions.byVersion.get { params: { id: state.contentId, version: state.version } }
    H.modify_ _ { data = response }
  HandleInput input -> do
    state <- H.get
    when (input.contentId /= state.contentId || input.version /= state.version) do
      H.put $ initialState input
      handleAction Initialize
  Navigate route -> navigate route
