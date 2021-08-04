module Incentknow.Organisms.ContentList where

import Prelude

import Data.Array (catMaybes, filter, head, length, nubByEq)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Set (fromFoldable, toUnfoldable)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Inputs (button)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (FocusedFormat, RelatedContent, RelatedUser)
import Incentknow.Data.Ids (FormatId, UserId)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Organisms.ListView (ListViewItem)
import Incentknow.Organisms.ListView as ListView
import Incentknow.Organisms.BoxView as BoxView
import Incentknow.Organisms.DataGridView as DataGridView
import Incentknow.Route (Route(..))

data ViewType
  = ListView
  | DataGridView
  | BoxView

type Input
  = { value :: Array RelatedContent }

type State
  = { contents :: Array RelatedContent
    , users :: Map UserId RelatedContent
    , formatId :: Maybe FormatId
    , formats :: Array FocusedFormat
    , formatNum :: Int
    , viewType :: ViewType
    }

data Action
  = HandleInput Input
  | Navigate Route
  | ChangeFormat (Maybe FormatId)
  | ChageViewType ViewType

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( formatMenu :: FormatMenu.Slot Unit
    , listView :: ListView.Slot Unit
    , dataGridView :: DataGridView.Slot Unit
    , boxView :: BoxView.Slot Unit
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
  , viewType: ListView
  }
  where
  formats = nubByEq (\x -> \y -> x.formatId == y.formatId) $ map (\x -> x.format) input.value

  formatIds = toUnfoldable $ fromFoldable $ map (\x -> x.format.formatId) input.value

toListViewItem :: State -> RelatedContent -> Maybe ListViewItem
toListViewItem state content = Just $ toItem content maybeUser
  where
  maybeUser = Nothing

  toItem :: RelatedContent -> Maybe RelatedUser -> ListViewItem
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
  {- tabGrouping
    { tabs: [ ContentMain ]
    , onChangeTab: ChangeTab
    , currentTab: state.tab
    , showTab:
        case _ of
          ContentMain -> "全て"
    }
    [ HH.text $ show state.formatNum <> "種類のフォーマット"
    , whenElem (state.formatNum > 1) \_ ->
    -- TODO
        HH.slot (SProxy :: SProxy "formatMenu") unit FormatMenu.component { value: state.formatId, filter: FormatMenu.None, disabled: length items == 0 }
          (Just <<< ChangeFormat)
    ]
    [ HH.slot (SProxy :: SProxy "listView") unit ListView.component { items } absurd
    ]
  -}
  HH.div []
    [ HH.div []
      [ button "List" (ChageViewType ListView)
      , button "DataGrid" (ChageViewType DataGridView)
      , button "Box" (ChageViewType BoxView)
      ]
    , case state.viewType of
        ListView -> HH.slot (SProxy :: SProxy "listView") unit ListView.component { items } absurd
        DataGridView -> HH.slot (SProxy :: SProxy "dataGridView") unit DataGridView.component { items: state.contents } absurd
        BoxView -> HH.slot (SProxy :: SProxy "boxView") unit BoxView.component { items: state.contents } absurd
    ]
  where
  items = catMaybes $ map (toListViewItem state) $ filter (\x -> maybe true (\y -> x.format.formatId == y) state.formatId) state.contents

handleAction :: forall o m. Behaviour m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  HandleInput props -> H.put $ initialState props
  Navigate route -> navigate route
  ChangeFormat formatId -> H.modify_ _ { formatId = formatId }
  ChageViewType viewType -> H.modify_ _ { viewType = viewType }