module Incentknow.Pages.Content where

import Prelude
import Data.Array (index, length, range)
import Data.Foldable (for_)
import Data.Int (fromString)
import Data.Map as M
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Maybe.Utils (flatten)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Halogen (SubscriptionId)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (Content, onLoadContentBySemanticId, onSnapshotContent)
import Incentknow.API.Execution (Fetch, Remote, callbackAPI, executeAPI, fetchAPI, forFetch, subscribeAPI)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute, pushState)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (button)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Ids (ContentId(..), FormatId(..), SemanticId(..))
import Incentknow.HTML.Utils (css, link, link_, maybeElem)
import Incentknow.Organisms.Content.Viewer as Content
import Incentknow.Organisms.ContentList as ContentList
import Incentknow.Organisms.UserCard as UserCard
import Incentknow.Route (ContentSpec(..), Route(..))
import Incentknow.Route as R
import Incentknow.Templates.Page (section, tabPage)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { contentSpec :: ContentSpec }

type State
  = { contentSpec :: ContentSpec
    , content :: Maybe Content
    , tab :: String
    , relationalContents :: M.Map String (Remote (Array Content))
    , contentSubId :: Maybe SubscriptionId
    }

data Action
  = Initialize
  | ChangeContent Content
  | HandleInput Input
  | Navigate MouseEvent Route
  | NavigateRoute Route
  | ChangeTab String
  | FetchedRelationalContents String (Fetch (Array Content))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( content :: Content.Slot Unit
    , userCard :: UserCard.Slot Unit
    , contentList :: ContentList.Slot String
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
  , content: Nothing
  , relationalContents: M.empty
  , tab: "main"
  , contentSubId: Nothing
  }

renderContent :: forall m. Behaviour m => MonadAff m => Content -> H.ComponentHTML Action ChildSlots m
renderContent content =
  section "page-content"
    [ HH.div [ css "header" ]
        [ HH.slot (SProxy :: SProxy "userCard") unit UserCard.component { userId: content.creatorUserId, timestamp: content.createdAt } absurd
        , HH.div [ css "space" ] []
        , HH.div [ css "buttons" ]
            [ HH.div [ css "container" ]
                [ HH.div [ css "rivision" ] [ link_ Navigate (RivisionList content.contentId) [ HH.text "リビジョン" ] ]
                , HH.div [ css "edit" ] [ button "編集" $ NavigateRoute $ EditContent content.contentId ]
                ]
            ]
        ]
    , HH.slot (SProxy :: SProxy "content") unit Content.component { format: content.format, value: content.data } absurd
    ]

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  maybeElem state.content \content ->
    if length content.format.contentPage.relations == 0 then
      renderContent content
    else
      tabPage
        { tabs: [ "main" ] <> (map show $ range 0 $ length content.format.contentPage.relations - 1)
        , currentTab: state.tab
        , onChangeTab: ChangeTab
        , showTab:
            \x ->
              if x == "main" then
                "Main"
              else
                maybe "Error" (\r -> r.displayName) $ index content.format.contentPage.relations (fromMaybe 0 (fromString x))
        }
        []
        [ HH.text (getContentSemanticData content.data content.format).title
        ]
        [ if state.tab == "main" then
            renderContent content
          else
            maybeElem (M.lookup state.tab state.relationalContents) \remote ->
              remoteWith remote \contents ->
                HH.slot (SProxy :: SProxy "contentList") state.tab ContentList.component { value: contents } absurd
        ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.contentSubId \subId ->
      H.unsubscribe subId
    case state.contentSpec of
      ContentSpecContentId contentId -> do
        contentSubId <- subscribeAPI ChangeContent $ onSnapshotContent contentId
        H.modify_ _ { contentSubId = Just contentSubId }
      ContentSpecSemanticId formatId semanticId -> do
        callbackAPI ChangeContent $ onLoadContentBySemanticId formatId semanticId
  ChangeContent content -> do
    state <- H.get
    case state.contentSpec of
      ContentSpecSemanticId formatId semanticId -> do
        pushState $ R.Content content.contentId
      ContentSpecContentId contentId -> pure unit
    H.modify_ _ { content = Just content }
  HandleInput input -> do
    state <- H.get
    when (input.contentSpec /= state.contentSpec) do
      H.put $ initialState input
      handleAction Initialize
  Navigate event route -> navigateRoute event route
  NavigateRoute route -> navigate route
  FetchedRelationalContents tab fetch ->
    forFetch fetch \contents ->
      H.modify_ \x -> x { relationalContents = M.insert tab contents x.relationalContents }
  ChangeTab tab -> do
    state <- H.modify _ { tab = tab }
    if tab == "main" then do
      pure unit
    else do
      let
        id = fromMaybe 0 (fromString tab)
      for_ state.content \content -> do
        when (not (M.member tab state.relationalContents)) do
          for_ (index content.format.contentPage.relations id) \relation -> do
            pure unit
 --fetchAPI (FetchedRelationalContents tab) $ getContentsByQuery { formatId: relation.formatId, property: relation.property, contentId: content.contentId }