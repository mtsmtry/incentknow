module Incentknow.Molecules.ContentLink where

import Prelude

import Data.Foldable (for_)
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (FocusedContent, FocusedFormat)
import Incentknow.Data.Ids (ContentId(..), FormatId(..))
import Incentknow.HTML.Utils (maybeElem)
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)
import Incentknow.Route (ContentSpec, Route)

type Input
  = { value :: ContentSpec }

type State
  = { contentSpec :: ContentSpec, content :: Maybe FocusedContent, format :: Maybe FocusedFormat }

data Action
  = Initialize
  | HandleInput Input
  | Navigate Route

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
  { contentSpec: input.value
  , content: Nothing
  , format: Nothing
  }

render :: forall m. State -> H.ComponentHTML Action ChildSlots m
render state =
  maybeElem state.content \content->
    maybeElem state.format \format->
      renderLink content format
  where
  renderLink :: FocusedContent -> FocusedFormat -> H.ComponentHTML Action ChildSlots m
  renderLink content format =
    HH.text common.title
    where
    common = getContentSemanticData content.data format

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
  Initialize -> do
    state <- H.get
    pure unit
   -- client <- getClient
   -- response <- handleError $ client.contents.byId.get { params: { id: state.contentId } }
  --  for_ response \res->
  --    H.modify_ _ { content = Just res.content, format = Just res.format }
  HandleInput input -> do
    state <- H.get
    when (input.value /= state.contentSpec) do
      H.modify_ _ { contentSpec = input.value }
      handleAction Initialize
  Navigate route -> navigate route
