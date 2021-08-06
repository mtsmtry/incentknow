module Incentknow.Pages.Space where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.API (getSpace)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith, spaceScopeIcon)
import Incentknow.Atoms.Inputs (menuPositiveButton)
import Incentknow.Data.Entities (FocusedSpace, MembershipMethod(..))
import Incentknow.Data.Ids (SpaceDisplayId)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, whenElem)
import Incentknow.Molecules.DangerChange as DangerChange
import Incentknow.Pages.Space.FormatList as FormatList
import Incentknow.Pages.Space.Home as Home
import Incentknow.Pages.Space.MemberList as MemberList
import Incentknow.Pages.Space.Setting as Setting
import Incentknow.Route (EditContentTarget(..), EditTarget(..), Route(..), SpaceTab(..))
import Incentknow.Templates.Main (centerLayout)
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
  = ( home :: Home.Slot Unit
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
  centerLayout { leftSide: [], rightSide: [] }
    [ tabPage
      { tabs:
          --if readable then
          [ SpaceHome, SpaceContainers, SpaceMembers, SpaceSetting ]
      --else
      --  [ SpacePages, SpaceSetting ]
      , currentTab: state.tab
      , onChangeTab: ChangeTab
      , showTab:
          case _ of
          --  SpacePages -> if readable then "Pages" else "Caption"
            SpaceHome -> "Home"
            SpaceContainers -> "Containers(" <> show space.containerCount <> ")"
            SpaceMembers -> "Members(" <> show space.memberCount <> ")"
            SpaceSetting -> if isAdmin then "Setting" else "Information"
            _ -> ""
      }
      [ whenElem writable \_ ->
          menuPositiveButton "コンテンツを追加" (Navigate $ EditDraft $ ContentTarget $ TargetBlank (Just space.spaceId) Nothing)
      ]
      [ HH.div [ css "page-space-header" ]
          [ HH.div [ css "backward" ] [ HH.img [ HP.src "/assets/imgs/default.jpg" ] ]
          , HH.div [ css "forward" ]
              [ HH.div [ css "name" ] [ HH.text space.displayName ]
              , HH.div [ css "description" ] [ HH.text space.description ]
              , HH.div [ css "attributes" ] 
                  [ HH.span [ css "created" ] [ dateTime space.createdAt, HH.text "に作成" ]
                  , HH.span [ css "scope" ] [ spaceScopeIcon space ]
                  ] 
              ]
          ]
      ]
      [ case state.tab of
          SpaceHome ->
            if readable then
              HH.slot (SProxy :: SProxy "home") unit Home.component { spaceId: space.spaceId, spaceDisplayId: state.spaceId } absurd
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
          SpaceContainers -> HH.slot (SProxy :: SProxy "formats") unit FormatList.component { spaceId: space.spaceId, spaceDisplayId: space.displayId, formatTab: Nothing } absurd
          SpaceFormat formatId formatTab -> HH.slot (SProxy :: SProxy "formats") unit FormatList.component { spaceId: space.spaceId, spaceDisplayId: space.displayId, formatTab: Just (Tuple formatId formatTab) } absurd
          SpaceMembers -> HH.slot (SProxy :: SProxy "members") unit MemberList.component { spaceId: space.spaceId, isAdmin } absurd
          SpaceCrawlers -> HH.text "" -- HH.slot (SProxy :: SProxy "crawlers") unit CrawlerList.component { spaceId: space.spaceId } absurd
          SpaceSetting -> HH.slot (SProxy :: SProxy "setting") unit Setting.component { space: space, disabled: not isAdmin } absurd
      ]
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
    forRemote fetch \space->
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
