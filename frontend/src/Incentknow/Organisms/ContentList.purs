module Incentknow.Organisms.ContentList where

import Prelude

import Data.Array (head, length, nubByEq)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..))
import Data.Set (fromFoldable, toUnfoldable)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (icon)
import Incentknow.Data.Entities (FocusedFormat, RelatedContent)
import Incentknow.Data.Ids (FormatId, UserId)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Organisms.BoxView as BoxView
import Incentknow.Organisms.DataGridView as DataGridView
import Incentknow.Organisms.ListView as ListView
import Incentknow.Route (Route)
import Incentknow.Templates.Page (sectionWithHeader)

data ViewType
  = ListView
  | DataGridView
  | BoxView

derive instance eqViewType :: Eq ViewType

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

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  sectionWithHeader "org-content-list"
    [ HH.span [ css "info" ] [ HH.text $ (show $ length state.contents) <> "件のコンテンツ" ]
    , HH.span [ css "viewtype" ]
      [ HH.span 
          [ css $ "item" <> if state.viewType == ListView then " selected" else ""
          , HE.onClick $ \_-> Just $ ChageViewType ListView
          ] 
          [ icon "fas fa-th-list" ]
      , HH.span
          [ css $ "item" <> if state.viewType == DataGridView then " selected" else ""
          , HE.onClick $ \_-> Just $ ChageViewType DataGridView
          ] 
          [ icon "fas fa-th" ]
      ]
    ]
    [ case state.viewType of
        ListView -> HH.slot (SProxy :: SProxy "listView") unit ListView.component { value: state.contents } absurd
        DataGridView -> HH.slot (SProxy :: SProxy "dataGridView") unit DataGridView.component { value: state.contents } absurd
        BoxView -> HH.slot (SProxy :: SProxy "boxView") unit BoxView.component { items: state.contents } absurd
    ]
  where
  format = map _.format $ head state.contents

handleAction :: forall o m. Behaviour m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  HandleInput props -> H.put $ initialState props
  Navigate route -> navigate route
  ChangeFormat formatId -> H.modify_ _ { formatId = formatId }
  ChageViewType viewType -> H.modify_ _ { viewType = viewType }