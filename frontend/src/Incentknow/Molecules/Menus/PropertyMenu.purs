module Incentknow.Molecules.PropertyMenu where

import Prelude

import Data.Array (filter)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getFocusedFormat)
import Incentknow.API.Execution (Fetch, callbackAPI, forItem, toQueryCallback)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (FocusedFormat, PropertyInfo, Type)
import Incentknow.Data.Ids (FormatId)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)

type Input
  = { formatId :: FormatId
    , value :: Maybe String
    , type :: Maybe Type
    , disabled :: Boolean
    }

type State
  = { format :: Maybe FocusedFormat
    , formatId :: FormatId
    , property :: Maybe String
    , type :: Maybe Type
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeValue (Maybe String)
  | FetchedFormat (Fetch FocusedFormat)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot String Unit )

type Output
  = Maybe String

component :: forall q m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input Output m
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
  { format: Nothing
  , formatId: input.formatId
  , property: input.value
  , type: input.type
  , disabled: input.disabled
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
    { value: state.property
    , disabled: state.disabled
    , fetchMultiple: \_-> Nothing
    , fetchSingle: Nothing
    , fetchId: ""
    , initial: { items: map toSelectMenuItem filteredProps, completed: true }
    , visibleCrossmark: true
    }
    (Just <<< ChangeValue)
  where
  props = maybe [] _.currentStructure.properties state.format

  filteredProps = maybe props (\ty -> filter (\item -> item.type == ty) props) state.type

toSelectMenuItem :: PropertyInfo -> SelectMenuItem String
toSelectMenuItem prop =
  { id: unwrap prop.id
  , name: prop.displayName
  , searchWord: prop.displayName
  , html: html
  }
  where
  html :: forall a s m. H.ComponentHTML a s m
  html =
    HH.div [ css "name" ]
      [ HH.text prop.displayName
      ]

handleAction :: forall m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackAPI FetchedFormat $ toQueryCallback $ getFocusedFormat state.formatId
  FetchedFormat fetch ->
    forItem fetch \format -> do
      H.modify_ _ { format = Just format }
  HandleInput input -> do
    state <- H.get
    if state.formatId /= input.formatId then do
      H.put $ initialState input
      handleAction Initialize
    else
      H.modify_ _ { property = input.value, disabled = input.disabled }
  ChangeValue value -> H.raise value
