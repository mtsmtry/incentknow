module Incentknow.Organisms.ContentQuery where

import Prelude

import Data.Array (catMaybes, filter, head, length, nubByEq, range)
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.String.CodeUnits (charAt, fromCharArray)
import Data.Symbol (SProxy(..))
import Data.Traversable (for)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Effect.Random (randomInt)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.Api (Content, Format, User, applyFirestoreCondition, getContents)
import Incentknow.Api.Utils (Fetch, Remote(..), fetchApi, forFetch)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (button, pulldown)
import Incentknow.Data.Content (ContentConditionMethod, ContentQuery, getContentSemanticData, toContentQueryMethod)
import Incentknow.Data.Ids (ContentId(..), FormatId(..), StructureId(..), UserId(..))
import Incentknow.Data.Property (mkProperties)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.TypeMenu as TypeMenu
import Incentknow.Organisms.ListView (ListViewItem)
import Incentknow.Organisms.ListView as ListView
import Incentknow.Route (ContentTab(..), FormatTab(..), Route(..))
import Incentknow.Templates.Page (tabGrouping)

type Input
  = { value :: ContentQuery }

type State
  = { query :: ContentQuery
    , method :: ContentConditionMethod
    , contents :: Remote (Array Content)
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate Route
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
initialState input = { query: input.value, method: toContentQueryMethod input.value.condition, contents: Loading }

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
    fetchApi FetchedContents $ getContents state.query.spaceId state.query.formatId state.method.serverCondition
  FetchedContents fetch -> do
    state <- H.get
    forFetch fetch \contents ->
      H.modify_ _ { contents = applyFirestoreCondition state.method.clientCondition contents }
  HandleInput input -> do
    H.put $ initialState input
    handleAction Initialize
  Navigate route -> navigate route
