module Incentknow.Pages.Content where

import Prelude

import Data.Array (head, length)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Maybe.Utils (flatten)
import Data.Newtype (wrap)
import Data.Set as S
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getContentPage)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forItem, forRemote, toMaybe)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute, pushState)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (ContentRelation, FocusedContent, IntactContentPage)
import Incentknow.Data.Ids (FormatId)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Organisms.Comments as Comments
import Incentknow.Organisms.Content.Viewer as Content
import Incentknow.Organisms.ContentList as ContentList
import Incentknow.Route (ContentSpec(..), Route)
import Incentknow.Route as R
import Incentknow.Templates.Main (centerLayout)
import Incentknow.Templates.Page (upperTabPage)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { contentSpec :: ContentSpec }

type State
  = { contentSpec :: ContentSpec
    , page :: Remote IntactContentPage
    , tab :: FormatId
    , relations :: Remote (M.Map FormatId ContentRelation)
    }

data Action
  = Initialize
  | FetchedContentPage (Fetch IntactContentPage)
  | HandleInput Input
  | Navigate MouseEvent Route
  | NavigateRoute Route
  | ChangeRelationTab FormatId

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( content :: Content.Slot Unit
    , contentList :: ContentList.Slot Unit
    , comments :: Comments.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , receive = Just <<< HandleInput
            , handleAction = handleAction
            }
    }

initialState :: Input -> State
initialState input =
  { contentSpec: input.contentSpec
  , page: Loading
  , tab: wrap ""
  , relations: Loading
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  centerLayout { css: "page-content", leftSide: [], rightSide: [] }
    [ remoteWith state.page \page->
        HH.slot (SProxy :: SProxy "content") unit Content.component { content: page.content } absurd
    , remoteWith state.relations \relations->
        whenElem (not $ M.isEmpty relations) \_->
          HH.div [ css "page-content-relations" ]
            [ upperTabPage
                { tabs: S.toUnfoldable $ M.keys relations
                , currentTab: state.tab
                , onChangeTab: ChangeRelationTab
                , showTab: \x-> HH.text $ fromMaybe "Error" $ flatten $ map (\y-> map _.format.displayName $ head y.contents) $ M.lookup state.tab relations
                }
                []
                [ maybeElem (M.lookup state.tab relations) \relation->
                    HH.slot (SProxy :: SProxy "contentList") unit ContentList.component 
                      { value: Holding relation.contents
                      , query: Nothing
                      }
                      absurd
                ]
            ]
    , HH.slot (SProxy :: SProxy "comments") unit Comments.component 
        { value: map _.comments state.page
        , contentId: toMaybe $ map _.content.contentId state.page
        } absurd
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    case state.contentSpec of
      ContentSpecContentId contentId -> do
        callbackQuery FetchedContentPage $ getContentPage contentId
       -- H.modify_ _ { contentSubId = Just contentSubId }
      ContentSpecSemanticId formatId semanticId -> do
        pure unit -- TODO
        -- callbackQuery ChangeContent $ onLoadContentBySemanticId formatId semanticId
  FetchedContentPage fetch -> do
    state <- H.get
    forItem fetch \page-> do
      case state.contentSpec of
        ContentSpecSemanticId formatId semanticId -> do
          pushState $ R.Content page.content.contentId
        ContentSpecContentId contentId -> pure unit
    forRemote fetch \page-> do
      let 
        relations = map (M.fromFoldable <<< map (\x-> Tuple x.relation.formatId x)) $ map _.relations page
        tab = fromMaybe (wrap "") $ flatten $ map (M.keys >>> S.toUnfoldable >>> head) $ toMaybe relations
      H.modify_ _ { page = page, relations = relations, tab = tab }
  HandleInput input -> do
    state <- H.get 
    when (input.contentSpec /= state.contentSpec) do
      H.put $ initialState input
      handleAction Initialize
  Navigate event route -> navigateRoute event route
  NavigateRoute route -> navigate route
  ChangeRelationTab tab -> do
    H.modify_ _ { tab = tab }
    