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
import Incentknow.Api (Space, getMySpaces, getPublishedSpaces, getSpace)
import Incentknow.Api.Utils (Fetch, executeApi, fetchApi, forFetchItem)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Ids (SpaceId(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.SelectMenu (SelectMenuItem, SelectMenuResource(..), upsertItems)
import Incentknow.Molecules.SelectMenu as SelectMenu

type Input
  = { value :: Maybe SpaceId
    , disabled :: Boolean
    }

type State
  = { items :: Array SelectMenuItem
    , initialSpaceId :: Maybe SpaceId
    , spaceId :: Maybe SpaceId
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeValue (Maybe String)
  | FetchedSpace (Fetch Space)
  | FetchedSpaces (Fetch (Array Space))

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot Unit )

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
    { resource: SelectMenuResourceAllCandidates state.items, value: map unwrap state.spaceId, disabled: false }
    (Just <<< ChangeValue)

toSelectMenuItem :: Space -> SelectMenuItem
toSelectMenuItem space =
  { id: unwrap space.spaceId
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
      fetchApi FetchedSpace $ getSpace spaceId
    fetchApi FetchedSpaces getPublishedSpaces
    fetchApi FetchedSpaces getMySpaces
  FetchedSpace fetch ->
    forFetchItem fetch \space->
      H.modify_ \s-> s { items = upsertItems [ toSelectMenuItem space ] s.items }
  FetchedSpaces fetch ->
    forFetchItem fetch \space->
      H.modify_ \s-> s { items = upsertItems (map toSelectMenuItem space) s.items }
  HandleInput input -> H.modify_ _ { spaceId = input.value, disabled = input.disabled }
  ChangeValue value -> H.raise $ map SpaceId value
