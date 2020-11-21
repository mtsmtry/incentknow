module Incentknow.Molecules.FormatMenu where

import Prelude

import Data.Array (filter, fromFoldable)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.Newtype (unwrap)
import Data.Nullable (notNull, null)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (getRelatedFormat, getFormats)
import Incentknow.Api.Utils (Fetch, Remote(..), executeApi, fetchApi, forFetch, forFetchItem)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (FormatUsage, RelatedFormat)
import Incentknow.Data.Ids (FormatId(..), SpaceId(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.SelectMenu (SelectMenuItem, SelectMenuResource(..), upsertItems)
import Incentknow.Molecules.SelectMenu as SelectMenu

data FormatFilter
  = Formats (Array RelatedFormat)
  | SpaceBy SpaceId
  | SpaceByAndHasSemanticId SpaceId
  | None

instance eqFormatFilter :: Eq FormatFilter where
  eq a b = case a, b of
    Formats fa, Formats fb -> false
    SpaceBy sa, SpaceBy sb -> sa == sb
    None, None -> true
    _, _ -> false

type Input
  = { filter :: FormatFilter
    , value :: Maybe FormatId
    , disabled :: Boolean
    }

type State
  = { filter :: FormatFilter
    , items :: Array (SelectMenuItem FormatId)
    , initialFormatId :: Maybe FormatId
    , formatId :: Maybe FormatId
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeValue (Maybe FormatId)
  | FetchedInitialFormat (Fetch RelatedFormat)
  | FetchedFormats (Fetch (Array RelatedFormat))

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot FormatId Unit )

type Output
  = Maybe FormatId

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
  { filter: input.filter
  , items: []
  , initialFormatId: input.value
  , formatId: input.value
  , disabled: input.disabled
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
    { resource: SelectMenuResourceAllCandidates state.items, value: state.formatId, disabled: state.disabled }
    (Just <<< ChangeValue)

toSelectMenuItem :: RelatedFormat -> SelectMenuItem FormatId
toSelectMenuItem format =
  { id: format.formatId
  , name: format.displayName
  , searchWord: format.displayName
  , html: html
  }
  where
  html :: forall a s m. H.ComponentHTML a s m
  html =
    HH.div [ css "name" ]
      [ HH.text format.displayName
      ]

handleAction :: forall m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.initialFormatId \formatId -> do
      fetchApi FetchedInitialFormat $ getRelatedFormat formatId
    case state.filter of
      Formats formats -> H.modify_ _ { items = map toSelectMenuItem formats }
      SpaceBy spaceId -> fetchApi FetchedFormats $ getFormats spaceId
      SpaceByAndHasSemanticId spaceId -> fetchApi FetchedFormats $ getFormats spaceId
      None -> pure unit
  FetchedInitialFormat fetch ->
    forFetchItem fetch \format->
      H.modify_ \s-> s { items = upsertItems [ toSelectMenuItem format ] s.items }
  FetchedFormats fetch ->
    forFetchItem fetch \formats-> do
      state <- H.get
      case state.filter of
        SpaceByAndHasSemanticId _ -> do
          let formats2 = filter (\x-> isJust x.semanticId) formats
          H.modify_ \s-> s { items = upsertItems (map toSelectMenuItem formats2) s.items }
        _ ->
          H.modify_ \s-> s { items = upsertItems (map toSelectMenuItem formats) s.items }
  HandleInput input -> do
    state <- H.get
    if input.filter /= state.filter then do
      H.put $ initialState input
      handleAction Initialize
    else
      H.modify_ _ { formatId = input.value, disabled = input.disabled }
  ChangeValue value -> H.raise value
