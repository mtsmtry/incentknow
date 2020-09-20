module Incentknow.Pages.WorkList where

import Prelude

import Data.Argonaut.Core (toString)
import Data.Array (catMaybes, filter, head, range)
import Data.Map (Map)
import Data.Map as M
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (wrap)
import Data.Nullable (notNull, null, toMaybe)
import Data.String as String
import Data.String.CodeUnits (charAt, fromCharArray)
import Data.Symbol (SProxy(..))
import Data.Traversable (for, for_)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Effect.Random (randomInt)
import Halogen (liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.Api (Format, Work, getMyWorks)
import Incentknow.Api.Utils (Fetch, Remote(..), executeApi, fetchApi, forFetch)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (button, pulldown)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Property (mkProperties)
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Molecules.TypeMenu as TypeMenu
import Incentknow.Organisms.ListView (ListViewItem)
import Incentknow.Organisms.ListView as ListView
import Incentknow.Route (ContentTab(..), Route(..))
import Incentknow.Templates.Page (tabGrouping)

data WorkTab
  = WorkMain
  | WorkCommitted
  | WorkWorking
  | WorkDeleted

derive instance eqWorkTab :: Eq WorkTab

type Input
  = {}

type State
  = { works :: Remote (Array Work)
    , tab :: WorkTab
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate Route
  | ChangeTab WorkTab
  | FetchedWorks (Fetch (Array Work))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( listView :: ListView.Slot Unit
    )

component :: forall o q m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
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
  { works: Loading
  , tab: WorkWorking
  }

toListViewItem :: State -> Work -> Maybe ListViewItem
toListViewItem state draft = map (\format -> toItem draft format) maybeFormat
  where
  maybeFormat = Just draft.format --M.lookup draft.info.structureId state.formats

  toItem :: Work -> Format -> ListViewItem
  toItem work format =
    { user: Nothing
    , datetime: Just work.updatedAt
    , title: common.title
    , format: Just format
    , route:
        case toMaybe work.contentId of
          Nothing -> EditWork work.workId
          Just contentId -> EditContent contentId
    }
    where
    common = getContentSemanticData draft.data format

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  tabGrouping
    { tabs: [ WorkWorking, WorkCommitted, WorkDeleted, WorkMain ]
    , onChangeTab: ChangeTab
    , currentTab: state.tab
    , showTab:
        case _ of
          WorkMain -> "全て"
          WorkWorking -> "作業中"
          WorkCommitted -> "作業終了"
          WorkDeleted -> "ゴミ箱"
    }
    []
    [ case state.tab of
        WorkMain ->
          remoteWith state.works \works ->
            HH.slot (SProxy :: SProxy "listView") unit ListView.component
              { items: catMaybes $ map (toListViewItem state) works }
              absurd
        WorkWorking ->
          remoteWith state.works \works ->
            HH.slot (SProxy :: SProxy "listView") unit ListView.component
              { items: catMaybes $ map (toListViewItem state) $ filter (\x-> x.state == "working") works }
              absurd
        WorkCommitted ->
          remoteWith state.works \works ->
            HH.slot (SProxy :: SProxy "listView") unit ListView.component
              { items: catMaybes $ map (toListViewItem state) $ filter (\x-> x.state == "committed") works }
              absurd
        WorkDeleted ->
          remoteWith state.works \works ->
            HH.slot (SProxy :: SProxy "listView") unit ListView.component
              { items: catMaybes $ map (toListViewItem state) $ filter (\x-> x.state == "deleted") works }
              absurd
    ]

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    fetchApi FetchedWorks $ getMyWorks { state: null }
    --workingWorks <- executeApi $ getMyWorks { state: notNull "working" }
  FetchedWorks fetch -> do
    forFetch fetch \works->
      H.modify_ _ { works = works }
  HandleInput props -> pure unit
  Navigate route -> navigate route
  ChangeTab tab -> H.modify_ _ { tab = tab }
