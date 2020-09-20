module Incentknow.Organisms.ContentList where

import Prelude

import Data.Argonaut.Core (toString)
import Data.Array (catMaybes, filter, head, length, nubByEq, range)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Set (fromFoldable, toUnfoldable)
import Data.Set as S
import Data.Set as Set
import Data.String as String
import Data.String.CodeUnits (charAt, fromCharArray)
import Data.Symbol (SProxy(..))
import Data.Traversable (for)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Effect.Random (randomInt)
import Halogen (liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.Api (Content, User, Format)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Inputs (button, pulldown)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Ids (FormatId(..), StructureId(..), UserId(..))
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
  = { value :: Array Content }

type State
  = { contents :: Array Content
    , users :: Map UserId User
    , formatId :: Maybe FormatId
    , formats :: Array Format
    , formatNum :: Int
    , tab :: ContentTab
    }

data Action
  = HandleInput Input
  | Navigate Route
  | ChangeFormat (Maybe FormatId)
  | ChangeTab ContentTab

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( formatMenu :: FormatMenu.Slot Unit
    , listView :: ListView.Slot Unit
    )

component :: forall o q m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input =
  { contents: input.value
  , users: M.empty --M.fromFoldable $ map (\x -> Tuple x.userId x) input.users
  , formatId: if length formatIds == 1 then head formatIds else Nothing
  , formatNum: length formatIds
  , formats: formats
  , tab: ContentMain
  }
  where
  formats = nubByEq (\x -> \y -> x.formatId == y.formatId) $ map (\x -> x.format) input.value

  formatIds = toUnfoldable $ fromFoldable $ map (\x -> x.formatId) input.value

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
  tabGrouping
    { tabs: [ ContentMain ]
    , onChangeTab: ChangeTab
    , currentTab: state.tab
    , showTab:
        case _ of
          ContentMain -> "全て"
    }
    [ HH.text $ show state.formatNum <> "種類のフォーマット"
    , whenElem (state.formatNum > 1) \_ ->
        HH.slot (SProxy :: SProxy "formatMenu") unit FormatMenu.component { value: state.formatId, filter: FormatMenu.Formats state.formats, disabled: length items == 0 }
          (Just <<< ChangeFormat)
    ]
    [ HH.slot (SProxy :: SProxy "listView") unit ListView.component { items } absurd
    ]
  where
  items = catMaybes $ map (toListViewItem state) $ filter (\x -> maybe true (\y -> x.formatId == y) state.formatId) state.contents

handleAction :: forall o s m. Behaviour m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  HandleInput props -> H.put $ initialState props
  Navigate route -> navigate route
  ChangeFormat formatId -> H.modify_ _ { formatId = formatId }
  ChangeTab tab -> H.modify_ _ { tab = tab }