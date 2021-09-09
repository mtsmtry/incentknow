module Incentknow.Pages.Content where

import Prelude

import Data.Array (head)
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
import Incentknow.API (getContent, getContentRelations)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forItem, forRemote, toMaybe)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute, pushState)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (ContentRelation, FocusedContent)
import Incentknow.Data.Ids (FormatId)
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
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
    , content :: Remote FocusedContent
    , tab :: FormatId
    , contentRelations :: Remote (M.Map FormatId ContentRelation)
    }

data Action
  = Initialize
  | ChangeContent (Fetch FocusedContent)
  | HandleInput Input
  | Navigate MouseEvent Route
  | NavigateRoute Route
  | ChangeRelationTab FormatId
  | FetchedContentRelations (Fetch (Array ContentRelation))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( content :: Content.Slot Unit
    , contentList :: ContentList.Slot Unit
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
  , content: Loading
  , tab: wrap ""
  , contentRelations: Loading
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  remoteWith state.content \content->
    centerLayout { leftSide: [], rightSide: [] }
      [ HH.div [ css "page-content" ]
        [ HH.slot (SProxy :: SProxy "content") unit Content.component { content } absurd
        , remoteWith state.contentRelations \relations->
            whenElem (not $ M.isEmpty relations) \_->
              HH.div [ css "relations" ]
                [ upperTabPage
                    { tabs: S.toUnfoldable $ M.keys relations
                    , currentTab: state.tab
                    , onChangeTab: ChangeRelationTab
                    , showTab: \x-> HH.text $ fromMaybe "Error" $ flatten $ map (\y-> map _.format.displayName $ head y.contents) $ M.lookup state.tab relations
                    }
                    []
                    [ maybeElem (M.lookup state.tab relations) \relation->
                        HH.slot (SProxy :: SProxy "contentList") unit ContentList.component 
                          { value: relation.contents
                          }
                          absurd
                    ]
                ]
        ]
      ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    case state.contentSpec of
      ContentSpecContentId contentId -> do
        callbackQuery ChangeContent $ getContent contentId
        callbackQuery FetchedContentRelations $ getContentRelations contentId
       -- H.modify_ _ { contentSubId = Just contentSubId }
      ContentSpecSemanticId formatId semanticId -> do
        pure unit -- TODO
        -- callbackQuery ChangeContent $ onLoadContentBySemanticId formatId semanticId
  ChangeContent fetch -> do
    state <- H.get
    forItem fetch \content-> do
      case state.contentSpec of
        ContentSpecSemanticId formatId semanticId -> do
          pushState $ R.Content content.contentId
        ContentSpecContentId contentId -> pure unit
    forRemote fetch \content->
      H.modify_ _ { content = content }
  HandleInput input -> do
    state <- H.get 
    when (input.contentSpec /= state.contentSpec) do
      H.put $ initialState input
      handleAction Initialize
  Navigate event route -> navigateRoute event route
  NavigateRoute route -> navigate route
  FetchedContentRelations fetch ->
    forRemote fetch \contents -> do
      let 
        relations = map (M.fromFoldable <<< map (\x-> Tuple x.relation.formatId x)) contents
      H.modify_ _ { contentRelations = relations, tab = fromMaybe (wrap "") $ flatten $ map (M.keys >>> S.toUnfoldable >>> head) $ toMaybe relations }
  ChangeRelationTab tab -> do
    H.modify_ _ { tab = tab }
    