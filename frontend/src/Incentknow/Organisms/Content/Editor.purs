module Incentknow.Organisms.Content.Editor where

import Prelude

import Data.Argonaut.Core (Json)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (FocusedFormat, Type(..))
import Incentknow.Organisms.Content.Common (EditEnvironment, EditorInput)
import Incentknow.Organisms.Content.ValueEditor as Value
import Incentknow.Organisms.Document.Section (ContentComponent(..))

type State
  = { format :: FocusedFormat
    , value :: Json
    , env :: EditEnvironment
    }

data Action
  = HandleInput EditorInput
  | ChangeValue Json

type Slot p
  = forall q. H.Slot q Output p

type Output
  = Json

type ChildSlots
  = ( value :: Value.Slot Unit
    )

component :: forall q m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q EditorInput Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: EditorInput -> State
initialState input =
  { format: input.format
  , value: input.value
  , env: input.env
  }

mkValueInput :: Json -> FocusedFormat -> EditEnvironment -> Value.Input
mkValueInput value format env =
  { value
  , env
  , type: ObjectType format.currentStructure.properties
  , contentComponent: ContentComponent component
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state = HH.slot (SProxy :: SProxy "value") unit Value.component (mkValueInput state.value state.format state.env) (Just <<< ChangeValue)

handleAction :: forall m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  HandleInput input -> H.put $ initialState input
  ChangeValue value -> H.raise value
