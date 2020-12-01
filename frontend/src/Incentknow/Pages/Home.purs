module Incentknow.Pages.Home where

import Prelude

import Affjax as AX
import Affjax.RequestBody as RequestBody
import Affjax.ResponseFormat as ResponseFormat
import Data.Maybe (Maybe(..))
import Data.Maybe.Utils (fromEither)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen (liftAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.HTML.RawHTML as RawHtml
import Incentknow.HTML.Utils (maybeElem)

type Input
  = {}

type State
  = { html :: Maybe String }

data Action
  = Initialize
  | HandleInput Input

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( rawHtml :: RawHtml.Slot Unit )

component :: forall q o m. MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { html: Nothing }

render :: forall m. MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  maybeElem state.html \html ->
    HH.slot (SProxy :: SProxy "rawHtml") unit RawHtml.component { html } absurd

handleAction :: forall o m. MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    html <- H.liftAff $ AX.get ResponseFormat.string "home.html"
    H.modify_ _ { html = map (\x-> x.body) $ fromEither html }
  HandleInput input -> pure unit
