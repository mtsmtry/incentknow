module Incentknow.HTML.RawHTML where

import Prelude
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Class (class MonadEffect, liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Web.HTML (HTMLElement)

foreign import setHTML :: HTMLElement -> String -> Effect Unit

type Input
  = { html :: String
    }

type State
  = { html :: String
    , elRef :: String
    }

data Action
  = Initialize
  | Receive Input

type Slot p
  = forall q. H.Slot q Void p

component :: forall m q o. MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState: initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { handleAction = handleAction
            , initialize = Just Initialize
            , receive = Just <<< Receive
            }
    }
  where
  initialState :: Input -> State
  initialState input =
    { html: input.html
    , elRef: "rawHtml"
    }

  handleAction :: Action -> H.HalogenM State Action () o m Unit
  handleAction = case _ of
    Initialize -> do
      state <- H.get
      H.getHTMLElementRef (H.RefLabel state.elRef)
        >>= case _ of
            Nothing -> pure unit
            Just el -> do
              liftEffect $ setHTML el state.html
      pure unit
    Receive input -> H.put $ initialState input

  render :: State -> H.ComponentHTML Action () m
  render state =
    HH.div
      [ HP.ref (H.RefLabel state.elRef) ]
      []
