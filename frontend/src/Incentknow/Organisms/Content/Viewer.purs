module Incentknow.Organisms.Content.Viewer where

import Prelude

import Data.Argonaut.Core (Json, jsonNull)
import Data.Argonaut.Parser (jsonParser)
import Data.Either (either)
import Data.Foldable (traverse_)
import Data.Maybe (Maybe(..))
import Data.Newtype (wrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (FocusedFormat, Type(..))
import Incentknow.Data.Ids (ContentId)
import Incentknow.HTML.Utils (maybeElem)
import Incentknow.Organisms.Content.ValueViewer as Value

type Input
  = { format :: FocusedFormat, value :: Json }

type State
  = { data :: Value.Input }

data Action
  = HandleInput Input

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( value :: Value.Slot Unit )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
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

initialState :: Input -> State
initialState input = 
  { data: mkValueInput input.format input.value }

mkValueInput :: FocusedFormat -> Json -> Value.Input
mkValueInput format value =
  { value: value
  , type: ObjectType format.structure.properties
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.slot (SProxy :: SProxy "value") unit Value.component state.data absurd

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  HandleInput input -> H.put $ initialState input