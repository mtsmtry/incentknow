module Incentknow.Organisms.DocumentEditor where

import Prelude

import Control.Promise (Promise)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Nullable (Nullable)
import Data.Number.Format (toString)
import Effect (Effect)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Random (random)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties (id_)
import Incentknow.API.Execution (Callback, callAPI, callbackAPI, forItem)
import Incentknow.AppM (class Behaviour)
import Simple.JSON (readJSON_, writeJSON)
import Test.Unit.Console (consoleLog)

type Setting 
  = { readonly :: Boolean
    , data :: String
    }

foreign import initEditor :: String -> Setting -> Callback String

foreign import setDataEditor :: String -> String -> Promise Unit

type DocumentBlock
  = { type :: String
    , data ::
      { text :: String
      }
    }

type Document
  = { time :: Int
    , blocks :: Array DocumentBlock
    , version :: String
    }

type Input
  = { value :: String
    , readonly :: Boolean
    }

type State
  = { editorId :: String
    , document :: String
    , readonly :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeDocument String

type Output
  = String

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ()

component :: forall q m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = 
  { editorId: "editor"
  , document: input.value
  , readonly: input.readonly
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state = HH.div [ id_ state.editorId ] []

handleAction :: forall m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> do
    num <- liftEffect random
    state <- H.get
    callbackAPI ChangeDocument $ initEditor state.editorId { readonly: state.readonly, data: state.document }
  HandleInput input -> do
    state <- H.get
    when (writeJSON state.document /= input.value) do
      let state2 = initialState input
      H.put state2
      liftEffect $ consoleLog input.value
      _ <- liftAff $ callAPI $ setDataEditor state2.editorId state2.document
      pure unit
  ChangeDocument doc -> do
    H.modify_ _ { document = doc }
    H.raise $ writeJSON doc