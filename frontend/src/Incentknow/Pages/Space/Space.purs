module Incentknow.Pages.Space where

import Prelude

import Data.Foldable (for_)
import Data.Maybe (Maybe(..), maybe)
import Data.Maybe.Utils (flatten)
import Data.Nullable (null, toMaybe)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.Query.HalogenM (SubscriptionId(..))
import Incentknow.API (getSpace)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (menuPositiveButton, dangerButton)
import Incentknow.Data.Entities (FocusedSpace, MembershipMethod(..))
import Incentknow.Data.Ids (SpaceDisplayId(..), SpaceId(..))
import Incentknow.HTML.Utils (css, maybeElem, whenElem)
import Incentknow.Molecules.DangerChange as DangerChange
import Incentknow.Pages.Space.FormatList as FormatList
import Incentknow.Pages.Space.MemberList as MemberList
import Incentknow.Pages.Space.PageList as PageList
import Incentknow.Pages.Space.Setting as Setting
import Incentknow.Route (EditTarget(..), Route(..), SpaceTab(..))
import Incentknow.Templates.Page (section, tabPage)

type Input
  = { spaceId :: SpaceDisplayId, tab :: SpaceTab }

type State
  = { spaceId :: SpaceDisplayId
    , tab :: SpaceTab
    , space :: Remote FocusedSpace
    }

data Action
  = Initialize
  | ChangeTab SpaceTab
  | HandleInput Input
  | Navigate Route
  | FetchedSpace (Fetch FocusedSpace)
  | Delete

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( pages :: PageList.Slot Unit
   -- , contents :: ContentList.Slot Unit
    , formats :: FormatList.Slot Unit
   -- , crawlers :: CrawlerList.Slot Unit
    , members :: MemberList.Slot Unit
    , delete :: DangerChange.Slot Unit
    , setting :: Setting.Slot Unit
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
  { spaceId: input.spaceId
  , space: Loading
  , tab: input.tab
  }

-- HH.slot (SProxy :: SProxy "delete") unit DangerChange.component
--                      { text: "削除"
----                      , title: "スペースの削除"
--                      , message: "スペース「" <> x.name <> "」" <> "を本当に削除しますか？"
--                      }
--                      (\_ -> Just Delete)
render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  remoteWith state.space \space ->
    renderMain state space

renderMain :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> FocusedSpace -> H.ComponentHTML Action ChildSlots m
renderMain state space =
  tabPage
    { tabs:
        --if readable then
        [ SpacePages, SpaceContents, SpaceFormats, SpaceMembers, SpaceCrawlers, SpaceSetting ]
    --else
    --  [ SpacePages, SpaceSetting ]
    , currentTab: state.tab
    , onChangeTab: ChangeTab
    , showTab:
        case _ of
          SpacePages -> if readable then "Pages" else "Caption"
          SpaceContents -> "Contents"
          SpaceFormats -> "Formats"
          SpaceMembers -> "Members"
          SpaceCrawlers -> "Crawlers"
          SpaceSetting -> if isAdmin then "Setting" else "Information"
    }
    [ whenElem writable \_ ->
        menuPositiveButton "コンテンツを追加" (Navigate $ EditContent $ TargetBlank (Just space.spaceId) Nothing)
    ]
    [ HH.div [ css "page-space" ]
        [ HH.div [ css "name" ] [ HH.text space.displayName ]
        , HH.div [ css "desc" ] [ HH.text space.description ]
        ]
    ]
    [ case state.tab of
        SpacePages ->
          if readable then
            HH.slot (SProxy :: SProxy "pages") unit PageList.component { spaceId: space.spaceId } absurd
          else
            section ""
              [ HH.text "このスペースはメンバー以外には非公開です"
              , case space.membershipMethod of
                  MembershipMethodApp ->
                    if isPending then
                      HH.text "メンバーへの加入を申請しています。スペース管理者の承認をお待ちください。"
                    else
                      menuPositiveButton "メンバーへの加入を申請" (Navigate $ JoinSpace space.spaceId)
                  _ -> HH.text ""
              ]
        SpaceContents -> HH.text "" -- HH.slot (SProxy :: SProxy "contents") unit ContentList.component { spaceId: space.spaceId } absurd
        SpaceFormats -> HH.slot (SProxy :: SProxy "formats") unit FormatList.component { spaceId: space.spaceId } absurd
        SpaceMembers -> HH.slot (SProxy :: SProxy "members") unit MemberList.component { spaceId: space.spaceId, isAdmin } absurd
        SpaceCrawlers -> HH.text "" -- HH.slot (SProxy :: SProxy "crawlers") unit CrawlerList.component { spaceId: space.spaceId } absurd
        SpaceSetting -> HH.slot (SProxy :: SProxy "setting") unit Setting.component { space: space, disabled: not isAdmin } absurd
    ]
  where
  isPending = true -- maybe false (\x -> x.type == "pending") $ toMaybe space.myMember 

  isMember = true -- maybe false (\x -> x.type /= "pending") $ toMaybe space.myMember 

  isAdmin = true -- maybe false (\x -> x.type == "owner" || x.type == "admin") $ toMaybe space.myMember 

  readable = true -- isMember || space.authority.base == "readable" || space.authority.base == "writable"

  writable = true -- isMember || space.authority.base == "writable"

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedSpace $ getSpace state.spaceId
  FetchedSpace fetch ->
    forRemote fetch \space ->
      H.modify_ _ { space = space }
  HandleInput input -> do
    state <- H.get
    if state.spaceId /= input.spaceId then do
      H.put $ initialState input
      handleAction Initialize
    else
      H.modify_ $ _ { tab = input.tab }
  ChangeTab tab -> do
    state <- H.get
    navigate $ Space state.spaceId tab
  Navigate route -> navigate route
  Delete -> do
    state <- H.get
    --response <- handleError $ client.spaces.byId.delete { params: { id: state.spaceId } }
    pure unit
