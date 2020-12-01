module Incentknow.Organisms.ContentQuery where

import Prelude

import Data.Array (catMaybes, filter, head, length, nubByEq, range)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.String.CodeUnits (charAt, fromCharArray)
import Data.Symbol (SProxy(..))
import Data.Traversable (for, for_)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Effect.Random (randomInt)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.Api (Content, Format, User, applyFirestoreCondition, getContents, getFormat)
import Incentknow.Api.Utils (Fetch, Remote(..), fetchApi, forFetch, forFetchItem)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (button, pulldown)
import Incentknow.Data.Content (ContentConditionMethod, ContentQuery, getContentSemanticData, toContentQueryMethod)
import Incentknow.Data.Ids (ContentId(..), FormatId(..), SpaceId(..), StructureId(..), UserId(..))
import Incentknow.Data.Property (mkProperties, toPropertyInfo)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.TypeMenu as TypeMenu
import Incentknow.Organisms.ListView (ListViewItem)
import Incentknow.Organisms.ListView as ListView
import Incentknow.Route (ContentTab(..), FormatTab(..), Route(..))
import Incentknow.Templates.Page (tabGrouping)
import Incentknow.Widgets.ContentQuery (fromUrlParams, toContentFilters)

type Input
  = { spaceId :: Maybe SpaceId
    , formatId :: Maybe FormatId
    , urlParams :: Array (Tuple String (Maybe String))
    }

type State
  = { spaceId :: Maybe SpaceId
    , formatId :: Maybe FormatId
    , urlParams :: Array (Tuple String (Maybe String))
    , method :: Maybe ContentConditionMethod
    , contents :: Remote (Array Content)
    , format :: Remote Format
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate Route
  | FetchedFormat (Fetch Format)
  | FetchedContents (Fetch (Array Content))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( listView :: ListView.Slot Unit
    )

component :: forall o q m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
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
  { spaceId: input.spaceId
  , formatId: input.formatId
  , urlParams: input.urlParams
  , method: Nothing
  , contents: Loading
  , format: Loading
  }

toListViewItem :: State -> Content -> Maybe ListViewItem
toListViewItem state content = Just $ toItem content maybeUser
  where
  maybeUser = Nothing

  toItem :: Content -> Maybe User -> ListViewItem
  toItem content maybeUser =
    { user: maybeUser
    , datetime: Just content.updatedAt
    , title: common.title
    , format: Just content.format
    , route: Content content.contentId
    }
    where
    common = getContentSemanticData content.data content.format

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  remoteWith state.contents \contents ->
    HH.slot (SProxy :: SProxy "listView") unit ListView.component { items: catMaybes $ map (toListViewItem state) contents } absurd

handleAction :: forall o s m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.formatId \formatId-> do
      fetchApi FetchedFormat $ getFormat formatId 
  FetchedFormat fetch -> do
    state <- H.get
    for_ state.spaceId \spaceId->do
      forFetchItem fetch \format->do
        let 
          props = map toPropertyInfo format.structure.properties
          values = fromUrlParams state.urlParams props
          filters = toContentFilters values props
          condition = { filters, orderBy: Nothing }
          method = toContentQueryMethod condition
        forFetch fetch \remoteFormat->
          H.modify_ _ { method = Just method, format = remoteFormat }
        fetchApi FetchedContents $ getContents spaceId format.formatId method.serverCondition
  FetchedContents fetch -> do
    state <- H.get
    forFetch fetch \contents-> do
      for_ state.method \method-> do
        H.modify_ _ { contents = map (applyFirestoreCondition method.clientCondition) contents }
  HandleInput input -> do
    H.put $ initialState input
    handleAction Initialize
  Navigate route -> navigate route
