module Incentknow.Molecules.StructureMenu where

import Prelude

import Data.Maybe (Maybe(..), isNothing)
import Data.Symbol (SProxy(..))
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Data.Entities (RelatedStructure, RelatedFormat)
import Incentknow.Data.Ids (FormatId, StructureId)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SelectMenu (SelectMenuResource(..))
import Incentknow.Molecules.SelectMenu as SelectMenu

type Input
  = { value :: StructureId
    , filter :: FormatMenu.FormatFilter
    , disabled :: Boolean
    }

type State
  = { structureId :: StructureId
    , formatId :: Maybe FormatId
    , filter :: FormatMenu.FormatFilter
    , structures :: Array RelatedStructure
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeFormat (Maybe RelatedFormat)

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = {}

render :: forall m. State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div []
    [ HH.slot (SProxy :: SProxy "formatMenu") unit FormatMenu.component { value: state.formatId, filter: state.filter, disabled: state.disabled } (Just <<< ChangeFormat)
    , HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component { value: state.structureId, resource, disabled: state.disabled || isNothing state.formatId } (Just <<< ChangeStructure)
    ]
  where
  resource = SelectMenuResourceSomeCandidatesAndFetchFunction 
    { items: toCall
    }

handleAction :: forall o m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> pure unit
