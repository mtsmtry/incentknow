module Incentknow.Router where

import Prelude

import Control.Monad.Reader.Trans (class MonadAsk, asks)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.AVar as AVar
import Effect.Aff.Class (class MonadAff)
import Foreign (unsafeToForeign)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.AppM (class Behaviour, Env, GlobalMessage(..), Message)
import Incentknow.Organisms.Footer as Footer
import Incentknow.Organisms.Header as Header
import Incentknow.Pages.Content as Content
import Incentknow.Pages.Container as Container
import Incentknow.Pages.DraftList as DraftList
import Incentknow.Pages.EditDraft as EditDraft
import Incentknow.Pages.Home as Home
import Incentknow.Pages.JoinSpace as JoinSpace
import Incentknow.Pages.NewFormat as NewFormat
import Incentknow.Pages.NewSpace as NewSpace
import Incentknow.Pages.Public as Public
import Incentknow.Pages.Sign as Sign
import Incentknow.Pages.Space as Space
import Incentknow.Pages.SpaceList as SpaceList
import Incentknow.Pages.User as User
import Incentknow.Route (ContentSpec(..), Route(..), pathToRoute, routeToPath)
import Incentknow.Templates.Main as Layout
import Web.HTML (window)
import Web.HTML.Location (pathname, search)
import Web.HTML.Window (location)

data Query a
  = ChangeRoute String a

data Action
  = Initialize

type ChildSlots
  = ( header :: Header.Slot Unit
    , footer :: Footer.Slot Unit
    , content :: Content.Slot Unit
    , container :: Container.Slot Unit
    , public :: Public.Slot Unit
    , editDraft :: EditDraft.Slot Unit
    -- , editScraper :: EditScraper.Slot Unit
    --  , newCommunity :: NewCommunity.Slot Unit
   -- , newContent :: NewContent.Slot Unit
    , newFormat :: NewFormat.Slot Unit
    , newSpace :: NewSpace.Slot Unit
    , joinSpace :: JoinSpace.Slot Unit
    -- , community :: Community.Slot Unit
    , spaceList :: SpaceList.Slot Unit
    , space :: Space.Slot Unit
    --, newCrawler :: NewCrawler.Slot Unit
    --, crawler :: Crawler.Slot Unit
    , user :: User.Slot Unit
    , sign :: Sign.Slot Unit
    -- , rivision :: Rivision.Slot Unit
    --, rivisionList :: RivisionList.Slot Unit
    --, workList :: WorkList.Slot Unit
    , home :: Home.Slot Unit

    , draftList :: DraftList.Slot Unit

    --, snapshot :: Snapshot.Slot Unit
    -- , workViewer :: WorkViewer.Slot Unit
    --, contentQuery :: ContentQuery.Slot Unit
   -- , pageContentQuery :: PageContentQuery.Slot Unit
    )

type State
  = { route :: Route
    , loading :: Int
    , msgs :: Array Message
    }

type Slot p
  = forall q. H.Slot q Void p

component ::
  forall o m.
  MonadAff m =>
  Behaviour m =>
  MonadAsk Env m =>
  H.Component HH.HTML Query Unit o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          $ H.defaultEval
              { handleQuery = handleQuery
              , handleAction = handleAction
              , initialize = Just Initialize
              }
    }
  where
  initialState :: Unit -> State
  initialState _ = { route: Home, loading: 0, msgs: [] }

  renderBody :: forall m. Behaviour m => MonadAff m => Route -> H.ComponentHTML Action ChildSlots m
  renderBody = case _ of
    Home -> HH.slot (SProxy :: SProxy "home") unit Home.component {} absurd
    NotFound -> HH.text ""
    Public -> HH.slot (SProxy :: SProxy "public") unit Public.component {} absurd
    Content contentId -> HH.slot (SProxy :: SProxy "content") unit Content.component { contentSpec: ContentSpecContentId contentId } absurd
    ContentBySemanticId formatId semanticId -> HH.slot (SProxy :: SProxy "content") unit Content.component { contentSpec: ContentSpecSemanticId formatId semanticId } absurd
    EditDraft target -> HH.slot (SProxy :: SProxy "editDraft") unit EditDraft.component target absurd
    EditScraper contentId -> HH.text "" --HH.slot (SProxy :: SProxy "editScraper") unit EditScraper.component { contentId } absurd
    NewFormat spaceId -> HH.slot (SProxy :: SProxy "newFormat") unit NewFormat.component { spaceId } absurd
    --EditWork workId -> HH.slot (SProxy :: SProxy "newContent") unit NewContent.component (NewContent.DraftInput workId) absurd
    --Snapshot workId changeId snapshotDiff -> HH.slot (SProxy :: SProxy "snapshot") unit Snapshot.component { workId, changeId, snapshotDiff } absurd
    --NewContent spaceId formatId -> HH.slot (SProxy :: SProxy "newContent") unit NewContent.component (NewContent.NewInput spaceId formatId) absurd
    --ContentList spaceId formatId urlParams -> HH.slot (SProxy :: SProxy "pageContentQuery") unit PageContentQuery.component { spaceId, formatId, urlParams } absurd
    Container spaceId formatId -> HH.slot (SProxy :: SProxy "container") unit Container.component { spaceId, formatId } absurd
    -- community
    JoinSpace spaceId -> HH.slot (SProxy :: SProxy "joinSpace") unit JoinSpace.component { spaceId } absurd
    SpaceList -> HH.slot (SProxy :: SProxy "spaceList") unit SpaceList.component {} absurd
    -- space
    NewSpace -> HH.slot (SProxy :: SProxy "newSpace") unit NewSpace.component {} absurd
    Space spaceId tab -> HH.slot (SProxy :: SProxy "space") unit Space.component { spaceId, tab } absurd
    -- crawler
    --NewCrawler -> HH.slot (SProxy :: SProxy "newCrawler") unit NewCrawler.component {} absurd
    --Crawler crawlerId tab -> HH.slot (SProxy :: SProxy "crawler") unit Crawler.component { crawlerId, tab } absurd
    -- user
    User userId tab -> HH.slot (SProxy :: SProxy "user") unit User.component { userId, tab } absurd
    Sign -> HH.slot (SProxy :: SProxy "sign") unit Sign.component {} absurd
    Rivision contentId version -> HH.text "" --HH.slot (SProxy :: SProxy "rivision") unit Rivision.component { contentId, version } absurd
    RivisionList contentId -> HH.text "" --HH.slot (SProxy :: SProxy "rivisionList") unit RivisionList.component { contentId } absurd
    DraftList -> HH.slot (SProxy :: SProxy "draftList") unit DraftList.component { } absurd

  --  EditWork workId -> HH.slot (SProxy :: SProxy "workViewer") unit WorkViewer.component { workId, route } absurd
  --  EditContent contentId -> HH.slot (SProxy :: SProxy "workViewer") unit WorkViewer.component { workId: WorkId $ unwrap contentId, route } absurd
  --  Snapshot workId _ _ -> HH.slot (SProxy :: SProxy "workViewer") unit WorkViewer.component { workId, route } absurd
  --  _ -> HH.text ""
  render :: State -> H.ComponentHTML Action ChildSlots m
  render state =
    Layout.main
      { header: HH.slot (SProxy :: SProxy "header") unit Header.component { route: state.route } absurd
      , footer: HH.slot (SProxy :: SProxy "footer") unit Footer.component unit absurd
      , messages: state.msgs
      , body:
          HH.div_
            [ case state.loading of
                0 -> HH.text ""
                _ -> HH.div [ HP.class_ $ H.ClassName "loading" ] []
            --, HH.slot (SProxy :: SProxy "pathBar") unit PathBar.component { route: state.route } absurd
            --, memoized eq renderBody state.route
            , renderBody state.route
            ]
      }

  handleQuery :: forall a. Query a -> H.HalogenM State Action ChildSlots o m (Maybe a)
  handleQuery = case _ of
    ChangeRoute path a -> do
      updateRoute path
      pure (Just a)

  handleAction :: Action -> H.HalogenM State Action ChildSlots o m Unit
  handleAction = case _ of
    Initialize -> do
      void $ H.fork globalMessageLoop
      path <- H.liftEffect $ window >>= location >>= pathname
      query <- H.liftEffect $ window >>= location >>= search
      updateRoute $ path <> query

  globalMessageLoop :: forall action slots output. H.HalogenM State action slots output m Unit
  globalMessageLoop = do
    globalMessage <- asks _.globalMessage
    query <- H.liftAff $ AVar.take globalMessage
    -- 再起だと H.modify_ (_ { route = Just route }) でなぜかハングするの
    void $ H.fork globalMessageLoop
    case query of
      PushStateG route -> pushState route
      NavigateG route -> do
        pushState route
        H.modify_ (_ { route = route })
        pure unit
      StartLoadingG -> H.modify_ \st -> st { loading = st.loading + 1 }
      StopLoadingG -> H.modify_ \st -> st { loading = st.loading - 1 }
      MessageG msg -> H.modify_ \st -> st { msgs = [ msg ] }
      ResetMesssageG -> H.modify_ \st -> st { msgs = [] }

  pushState :: forall action slots output. Route -> H.HalogenM State action slots output m Unit
  pushState route = do
    pushStateInterface <- asks _.pushStateInterface
    H.liftEffect $ pushStateInterface.pushState (unsafeToForeign {}) $ routeToPath route

  updateRoute path = H.modify_ \st -> st { route = pathToRoute path }
