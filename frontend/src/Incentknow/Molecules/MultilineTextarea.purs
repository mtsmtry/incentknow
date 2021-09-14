module Incentknow.Molecules.MultilineTextarea where

import Prelude

import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Class (class MonadEffect, liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.HTML.Utils (css)
import Web.HTML (HTMLElement)

foreign import setAutosize :: HTMLElement -> Effect Unit

type Input
  = { value :: String
    }

type State
  = { text :: String
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeText String

type Output = String

type Slot p
  = forall q. H.Slot q Output p

initialState :: Input -> State
initialState input =
  { text: input.value
  }

component :: forall m q. MonadEffect m => H.Component HH.HTML q Input Output m
component =
  H.mkComponent
    { initialState: initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { handleAction = handleAction
            , initialize = Just Initialize
            , receive = Just <<< HandleInput
            }
    }
    
render :: forall m. State -> H.ComponentHTML Action () m
render state =
  HH.textarea
    [ css "mol-multiline-textarea"
    , HP.ref (H.RefLabel "textarea")
    , HP.spellcheck false
    , HP.value state.text
    , HE.onValueInput $ Just <<< ChangeText
    ]

handleAction :: forall m. MonadEffect m => Action -> H.HalogenM State Action () Output m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    H.getHTMLElementRef (H.RefLabel "textarea")
      >>= case _ of
          Nothing -> pure unit
          Just element -> liftEffect $ setAutosize element
    pure unit
  HandleInput input -> H.put $ initialState input
  ChangeText text -> do
    H.modify_ _ { text = text }
    H.raise text