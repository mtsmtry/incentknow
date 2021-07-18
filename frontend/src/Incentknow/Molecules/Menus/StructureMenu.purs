module Incentknow.Molecules.StructureMenu where

import Prelude

import Data.Foldable (for_)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Newtype (unwrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getFocusedFormat, getRelatedFormat, getRelatedStructure, getStructures)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forItem, forRemote, toQueryCallback)
import Incentknow.API.Execution as R
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (RelatedFormat, RelatedStructure)
import Incentknow.Data.Ids (FormatId, StructureId(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SelectMenu (emptyCandidateSet)
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)
import Test.Unit.Console (consoleLog)

type Input
  = { value :: Maybe StructureId
    , filter :: FormatMenu.FormatFilter
    , disabled :: Boolean
    }

type State
  = { structureId :: Maybe StructureId
    , formatId :: Maybe FormatId
    , filter :: FormatMenu.FormatFilter
    , disabled :: Boolean
    , format :: Remote RelatedFormat
    , structure :: Remote RelatedStructure
    }

data Action
  = Initialize
  | Load
  | HandleInput Input
  | ChangeFormat (Maybe FormatId)
  | ChangeStructure (Maybe StructureId)
  | GetFormat (Fetch RelatedFormat)
  | GetStructure (Fetch RelatedStructure)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( formatMenu :: FormatMenu.Slot Unit
    , selectMenu :: SelectMenu.Slot StructureId Unit )

type Output
  = Maybe StructureId

component :: forall q m. Behaviour m => MonadAff m => H.Component HH.HTML q Input Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input =
  { structureId: input.value
  , formatId: Nothing
  , filter: input.filter
  , disabled: input.disabled
  , format: Loading
  , structure: Loading
  }

setInput :: State -> Input -> State
setInput state input = 
  state
    { structureId = input.value
    , filter = input.filter
    , disabled = input.disabled
    }

toSelectMenuItem :: RelatedStructure -> SelectMenuItem StructureId
toSelectMenuItem strc =
  { id: strc.structureId
  , name: show strc.version
  , searchWord: show strc.version
  , html: html
  }
  where
  html :: forall a s m. H.ComponentHTML a s m
  html =
    HH.div [ css "name" ]
      [ HH.text $ show strc.version
      ]

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div []
    [ HH.slot (SProxy :: SProxy "formatMenu") unit FormatMenu.component 
        { value: state.formatId
        , filter: state.filter
        , disabled: state.disabled 
        } (Just <<< ChangeFormat)
    , HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component 
        { value: state.structureId
        , disabled: state.disabled || isNothing state.formatId 
        , fetchMultiple: case _ of
            Nothing -> case state.formatId of
              Just formatId -> Just $ toQueryCallback $ map (\items-> { items, completed: true }) $ map (map toSelectMenuItem) $ getStructures formatId
              Nothing -> Nothing
            _ -> Nothing
        , fetchSingle: Nothing
        , fetchId: maybe "" unwrap state.formatId
        , initial: emptyCandidateSet
        } (Just <<< ChangeStructure)
    ]

handleAction :: forall m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> do
    handleAction Load
  HandleInput input -> do
    state <- H.get
    H.modify_ $ (flip setInput) input
    when (isJust input.value && input.value /= state.structureId) do
      handleAction Load
  Load -> do
    state <- H.get
    for_ state.structureId \structureId->
      callbackQuery GetStructure $ getRelatedStructure structureId
  ChangeFormat maybeFormatId -> do
    H.modify_ _ { formatId = maybeFormatId }
    when (isNothing maybeFormatId) do
      H.modify_ _  { structureId = Nothing }
    for_ maybeFormatId \formatId ->
      callbackQuery GetFormat $ getRelatedFormat formatId
  ChangeStructure structureId -> do
    H.modify_ _ { structureId = structureId }
    H.raise structureId
  GetFormat fetch -> do
    forRemote fetch \format->
      H.modify_ _ { format = format }
    forItem fetch \format-> do
      H.modify_ _ { structureId = Just format.currentStructure.structureId }
      H.raise $ Just format.currentStructure.structureId
  GetStructure fetch -> do
    forRemote fetch \structure->
      H.modify_ _ { structure = structure, formatId = map _.formatId $ R.toMaybe structure }