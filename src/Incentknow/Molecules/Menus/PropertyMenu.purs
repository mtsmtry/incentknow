module Incentknow.Molecules.PropertyMenu where

import Prelude

import Data.Array (filter, fromFoldable)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (getFocusedFormat, getFormat, getFormats)
import Incentknow.Api.Utils (Fetch, executeApi, fetchApi, forFetch, forFetchItem)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (RelatedFormat, Type, FocusedFormat)
import Incentknow.Data.Ids (SpaceId(..), FormatId(..))
import Incentknow.Data.Property (PropertyInfo)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.SelectMenu (SelectMenuItem, SelectMenuResource(..))
import Incentknow.Molecules.SelectMenu as SelectMenu

type Input
  = { formatId :: FormatId
    , value :: Maybe String
    , type :: Maybe Type
    , disabled:: Boolean
    }

type State
  = { props :: Array PropertyInfo
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
  { props: []
  , formatId: input.formatId
  , property: input.value
  , type: input.type
  , disabled: input.disabled
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
    { resource: SelectMenuResourceAllCandidates $ map toSelectMenuItem props, value: state.property, disabled: state.disabled }
    (Just <<< ChangeValue)
  where
  props = maybe state.props (\ty-> filter (\item-> item.type == ty) state.props) state.type

toSelectMenuItem :: PropertyInfo -> SelectMenuItem String
toSelectMenuItem prop =
  { id: prop.id
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
    fetchApi FetchedFormat $ getFocusedFormat state.formatId
  FetchedFormat fetch ->
    forFetchItem fetch \format-> do
      H.modify_ _ { props = format.structure.properties }
  HandleInput input -> do
    state <- H.get
    if state.formatId /= input.formatId then do
      H.put $ initialState input
      handleAction Initialize
    else
      H.modify_ _ { property = input.value, disabled = input.disabled }
  ChangeValue value -> H.raise value
