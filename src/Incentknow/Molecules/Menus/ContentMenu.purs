module Incentknow.Molecules.ContentMenu where

import Prelude

import Data.Array (filter, fromFoldable)
import Data.Foldable (for_)
import Data.Map as M
import Data.Map as Map
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap, wrap)
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.Api (Content, Format, getContent, getContents, getContentsByFormat)
import Incentknow.Api.Utils (Fetch, executeApi, fetchApi, forFetchItem)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Content (ContentSemanticData, getContentSemanticData)
import Incentknow.Data.Ids (ContentId(..), FormatId(..), SpaceId(..))
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Molecules.SelectMenu (SelectMenuItem, SelectMenuResource(..), upsertItems)
import Incentknow.Molecules.SelectMenu as SelectMenu

type Input
  = { value :: Maybe ContentId
    , formatId :: FormatId
    , spaceId :: Maybe SpaceId
    , disabled :: Boolean
    }

type State
  = { items :: Array SelectMenuItem
    , initialContentId :: Maybe ContentId
    , contentId :: Maybe ContentId
    , formatId :: FormatId
    , spaceId :: Maybe SpaceId
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeValue (Maybe String)
  | FetchedInitialContent (Fetch Content)
  | FetchedContents (Fetch (Array Content))

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot Unit )

type Output
  = Maybe ContentId

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
  , initialContentId: input.value
  , contentId: input.value
  , spaceId: input.spaceId
  , formatId: input.formatId
  , disabled: input.disabled
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
    { resource: SelectMenuResourceAllCandidates state.items, value: map unwrap state.contentId, disabled: state.disabled }
    (Just <<< ChangeValue)

toSelectMenuItem :: Content -> SelectMenuItem
toSelectMenuItem content =
  { id: unwrap content.contentId
  , name: semanticData.title
  , searchWord: semanticData.title
  , html: fromContentToHtml semanticData
  }
  where
  semanticData = getContentSemanticData content.data content.format

fromContentToHtml :: ContentSemanticData -> forall a s m. H.ComponentHTML a s m
fromContentToHtml src =
  HH.div [ css "name" ]
    [ HH.text $ src.title
    , maybeElem src.image \image->
        HH.img [ HP.src image ]
    ]

handleAction :: forall m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.initialContentId \contentId -> do
      fetchApi FetchedInitialContent $ getContent contentId
    case state.spaceId of
      Just spaceId -> fetchApi FetchedContents $ getContents spaceId state.formatId
      Nothing -> fetchApi FetchedContents $ getContentsByFormat state.formatId
  FetchedInitialContent fetch ->
    forFetchItem fetch \content->
      H.modify_ \s-> s { items = upsertItems [ toSelectMenuItem content ] s.items }
  FetchedContents fetch ->
    forFetchItem fetch \contents-> do
      H.modify_ \s -> s { items = upsertItems (map toSelectMenuItem contents) s.items }
  HandleInput input -> do
    state <- H.get
    if state.formatId /= input.formatId || state.spaceId /= input.spaceId then do
      H.put $ initialState input
      handleAction Initialize
    else
      H.modify_ _ { contentId = input.value, disabled = input.disabled }
  ChangeValue value -> H.raise $ map ContentId value
