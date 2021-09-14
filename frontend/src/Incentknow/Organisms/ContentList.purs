module Incentknow.Organisms.ContentList where

import Prelude

import Data.Array (head, length, nubByEq)
import Data.Foldable (for_)
import Data.Map (Map)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing, maybe)
import Data.Set (fromFoldable, toUnfoldable)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Incentknow.API (getFocusedContentsByDisplayId)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote, toMaybe)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (icon, remoteWith)
import Incentknow.Data.Entities (FocusedFormat, RelatedContent, FocusedContent)
import Incentknow.Data.Ids (FormatDisplayId, FormatId, SpaceDisplayId, SpaceId, UserId)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Organisms.DataGridView as DataGridView
import Incentknow.Organisms.FocusedView as FocusedView
import Incentknow.Organisms.ListView as ListView
import Incentknow.Route (Route)
import Incentknow.Templates.Page (section, sectionWithHeader)

data ViewType
  = ListView
  | DataGridView
  | FocusedView

derive instance eqViewType :: Eq ViewType

data ContentQuery
  = QueryByContainer SpaceDisplayId FormatDisplayId

type Input
  = { value :: Remote (Array RelatedContent), query :: Maybe ContentQuery }

type State
  = { contents :: Remote (Array RelatedContent)
    , viewType :: ViewType
    , query :: Maybe ContentQuery
    , focused :: Remote (Array FocusedContent)
    }

data Action
  = HandleInput Input
  | Navigate Route
  | ChageViewType ViewType
  | FetchedFocused (Fetch (Array FocusedContent))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( formatMenu :: FormatMenu.Slot Unit
    , listView :: ListView.Slot Unit
    , dataGridView :: DataGridView.Slot Unit
    , focusedView :: FocusedView.Slot Unit
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
  , viewType: ListView
  , query: input.query
  , focused: Loading
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  ( if isJust state.query then
      sectionWithHeader "org-content-list"
        [ HH.span [ css "info" ] 
            [ HH.text $ (maybe "..." show $ map length $ toMaybe state.contents) <> "件のコンテンツ" 
            ]
        , HH.span [ css "viewtype" ]
          [ HH.span 
              [ css $ "item" <> if state.viewType == ListView then " selected" else ""
              , HE.onClick $ \_-> Just $ ChageViewType ListView
              ] 
              [ icon "fas fa-th-list" ]
          , HH.span
              [ css $ "item" <> if state.viewType == FocusedView then " selected" else ""
              , HE.onClick $ \_-> Just $ ChageViewType FocusedView
              ] 
              [ icon "fas fa-bars" ]
          , HH.span
              [ css $ "item" <> if state.viewType == DataGridView then " selected" else ""
              , HE.onClick $ \_-> Just $ ChageViewType DataGridView
              ] 
              [ icon "fas fa-th" ]
          ]
        ]
    else
      section "org-content-list"
  )
  [ case state.viewType of
      ListView -> 
        HH.slot (SProxy :: SProxy "listView") unit ListView.component { value: state.contents } absurd
      DataGridView -> 
        HH.slot (SProxy :: SProxy "dataGridView") unit DataGridView.component { value: state.contents } absurd
      FocusedView -> 
        remoteWith state.focused \focused->
          HH.slot (SProxy :: SProxy "focusedView") unit FocusedView.component { value: focused } absurd
  ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  HandleInput props -> H.put $ initialState props
  Navigate route -> navigate route
  ChageViewType viewType -> do
    H.modify_ _ { viewType = viewType }
    when (viewType == FocusedView) do
      state <- H.get
      for_ state.query \query->
        case query of
          QueryByContainer spaceId formatId ->
            callbackQuery FetchedFocused $ getFocusedContentsByDisplayId spaceId formatId
  FetchedFocused fetch -> do
    forRemote fetch \focused->
      H.modify_ _ { focused = focused }