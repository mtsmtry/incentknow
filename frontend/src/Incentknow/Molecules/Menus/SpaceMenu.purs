module Incentknow.Molecules.SpaceMenu where

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
import Incentknow.API (getMySpaces, getPublishedSpaces, getRelatedSpace, getSpace)
import Incentknow.API.Execution (Fetch, executeAPI, fetchAPI, forFetchItem)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (RelatedSpace)
import Incentknow.Data.Ids (SpaceId(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.SelectMenu (SelectMenuItem, SelectMenuResource(..), upsertItems)
import Incentknow.Molecules.SelectMenu as SelectMenu

type Input
  = { value :: Maybe SpaceId
    , disabled :: Boolean
    }

type State
  = { items :: Array (SelectMenuItem SpaceId)
    , initialSpaceId :: Maybe SpaceId
    , spaceId :: Maybe SpaceId
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeValue (Maybe SpaceId)
  | FetchedSpace (Fetch RelatedSpace)
  | FetchedSpaces (Fetch (Array RelatedSpace))

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot SpaceId Unit )

type Output
  = Maybe SpaceId

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
  { items: []
  , initialSpaceId: input.value
  , spaceId: input.value
  , disabled: input.disabled
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
    { resource: SelectMenuResourceAllCandidates state.items, value: state.spaceId, disabled: false }
    (Just <<< ChangeValue)

toSelectMenuItem :: RelatedSpace -> SelectMenuItem SpaceId
toSelectMenuItem space =
  { id: space.spaceId
  , name: space.displayName
  , searchWord: space.displayName
  , html: html
  }
  where
  html :: forall a s m. H.ComponentHTML a s m
  html =
    HH.div [ css "name" ]
      [ HH.text space.displayName
      ]

handleAction :: forall m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.initialSpaceId \spaceId -> do
      fetchAPI FetchedSpace $ getRelatedSpace spaceId
    fetchAPI FetchedSpaces getPublishedSpaces
    fetchAPI FetchedSpaces getMySpaces
  FetchedSpace fetch ->
    forFetchItem fetch \space ->
      H.modify_ \s -> s { items = upsertItems [ toSelectMenuItem space ] s.items }
  FetchedSpaces fetch ->
    forFetchItem fetch \space ->
      H.modify_ \s -> s { items = upsertItems (map toSelectMenuItem space) s.items }
  HandleInput input -> H.modify_ _ { spaceId = input.value, disabled = input.disabled }
  ChangeValue value -> H.raise value
