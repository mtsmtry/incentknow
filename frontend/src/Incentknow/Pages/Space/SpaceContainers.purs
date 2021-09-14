module Incentknow.Pages.Space.SpaceContainers where

import Prelude

import Data.Array (head)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, isNothing)
import Data.Maybe.Utils (flatten)
import Data.Newtype (wrap)
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.API (getFormats)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote, toMaybe)
import Incentknow.API.Static (getFullsizeHeaderImageUrl)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.Atoms.Icon (formatWithIcon)
import Incentknow.Atoms.Inputs (menuPositiveButton)
import Incentknow.Data.Entities (FocusedSpace, RelatedFormat)
import Incentknow.Data.Ids (FormatDisplayId)
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Pages.Container as Container
import Incentknow.Pages.Space.Utils (renderMode)
import Incentknow.Route (EditContentTarget(..), EditTarget(..), Route(..), SpaceTab(..))
import Incentknow.Templates.Page (tabPage)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { space :: FocusedSpace, formatId :: Maybe FormatDisplayId }

type State
  = { space :: FocusedSpace
    , formatId :: Maybe FormatDisplayId
    , formats :: Remote (Array RelatedFormat)
    }

data Action
  = Initialize
  | ChangeTab FormatDisplayId
  | HandleInput Input
  | Navigate Route
  | NavigateRoute MouseEvent Route
  | FetchedFormats (Fetch (Array RelatedFormat))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( container :: Container.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
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
  { space: input.space
  , formatId: input.formatId
  , formats: Loading
  }

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  tabPage
    { tabs: map _.displayId formats
    , currentTab: fromMaybe (wrap "") $ maybeFormatId
    , onChangeTab: ChangeTab
    , isTabAlphabet: false
    , showTab: \id-> [ fromMaybe (HH.text "") $ map formatWithIcon $ M.lookup id formatMap ]
    }
    [ --maybeElem maybeFormat \format->
      --  menuPositiveButton "コンテンツを追加" (Navigate $ EditDraft $ ContentTarget $ TargetBlank (Just state.space.spaceId) (Just format.currentStructureId))
    ]
    [ HH.div 
        [ css "page-space-header page-space-header-containers"
        , HE.onDoubleClick $ \_-> Just $ Navigate $ Space state.space.displayId SpaceHome
        ]
        [ HH.div [ css "backward" ] 
            [ HH.img [ HP.src $ getFullsizeHeaderImageUrl state.space.headerImage ] ]
        , HH.div [ css "forward" ]
            [ renderMode false state.space.displayId NavigateRoute
            , HH.div [ css "name" ] [ HH.text state.space.displayName ]
            ]
        ]
    ]
    [ maybeElem maybeFormatId \formatId ->
        HH.slot (SProxy :: SProxy "container") unit Container.component { spaceId: state.space.displayId, formatId: formatId } absurd
    ]
  where
  formats = fromMaybe [] $ toMaybe state.formats

  formatMap = M.fromFoldable $ map (\x-> Tuple x.displayId x) formats

  maybeFormat = flatten $ map (\id-> M.lookup id formatMap) maybeFormatId

  maybeFormatId = if isNothing state.formatId then map _.displayId $ head formats else state.formatId

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedFormats $ getFormats state.space.spaceId
  FetchedFormats fetch ->
    forRemote fetch \formats->
      H.modify_ _ { formats = formats }
  HandleInput input -> do
    state <- H.get
    if state.space.spaceId /= input.space.spaceId then do
      H.put $ initialState input
      handleAction Initialize
    else
      H.modify_ _ { formatId = input.formatId }
  ChangeTab tab -> do
    state <- H.get
    navigate $ Container state.space.displayId tab
  Navigate route -> navigate route
  NavigateRoute event route -> navigateRoute event route