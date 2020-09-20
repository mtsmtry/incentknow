module Incentknow.Pages.User where

import Prelude

import Data.Foldable (traverse_)
import Data.Maybe (Maybe(..), isJust)
import Data.Nullable (toMaybe)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.Api (User, getUser, getCurrentUserId, logout)
import Incentknow.Api.Utils (Fetch, Remote(..), executeApi, fetchApi, forFetch)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (menuPositiveButton, dangerButton)
import Incentknow.Data.Ids (SpaceId(..), UserId(..))
import Incentknow.HTML.Utils (css, link, maybeElem, whenElem)
import Incentknow.Molecules.DangerChange as DangerChange
import Incentknow.Pages.User.Main as Main
import Incentknow.Pages.User.Setting as Setting
import Incentknow.Route (SpaceTab(..), Route(..), UserTab(..))
import Incentknow.Templates.Page (tabPage)

type Input
  = { userId :: UserId, tab :: UserTab }

type State
  = { userId :: UserId, tab :: UserTab, user :: Remote User, myUserId :: Maybe UserId }

data Action
  = Initialize
  | ChangeTab UserTab
  | HandleInput Input
  | Navigate Route
  | Logout
  | FetchedUser (Fetch User)

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( main :: Main.Slot Unit
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
initialState input = { userId: input.userId, tab: input.tab, user: Loading, myUserId: Nothing }

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-user" ]
    [ tabPage
          { tabs: [ UserMain ] <> if Just state.userId == state.myUserId then [ UserSetting ] else []
          , currentTab: state.tab
          , onChangeTab: ChangeTab
          , showTab:
              case _ of
                UserMain -> "Home"
                UserSetting -> "Setting"
          }
          ( if Just state.userId == state.myUserId then
              [ HH.div [ css "page-user-logout", HE.onClick $ \_ -> Just Logout ] [ HH.text "Logout" ] ]
            else
              []
          )
          [ remoteWith state.user \user->
              HH.div [ css "page-user-header" ]
                [ HH.div [ css "left" ]
                    [ HH.img [ HP.src user.iconUrl ] ]
                , HH.div [ css "right" ]
                    [ HH.div [ css "name" ] [ HH.text user.displayName ]
                    ]
                ]
          ]
          [ case state.tab of
              UserMain -> HH.slot (SProxy :: SProxy "main") unit Main.component { userId: state.userId } absurd
              UserSetting -> HH.slot (SProxy :: SProxy "setting") unit Setting.component {} absurd
          ]
    ]

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    myUserId <- H.liftEffect $ getCurrentUserId
    H.modify_ _ { myUserId = toMaybe myUserId }
    fetchApi FetchedUser $ getUser state.userId
  FetchedUser fetch -> do
    forFetch fetch \user-> 
      H.modify_ _ { user = user }
  HandleInput input -> do
    state <- H.get
    if state.userId /= input.userId then do
      H.put $ initialState input
      handleAction Initialize
    else
      H.modify_ $ _ { tab = input.tab }
  ChangeTab tab -> do
    state <- H.get
    navigate $ User state.userId tab
  Navigate route -> navigate route
  Logout -> do
    _ <- executeApi $ logout {}
    H.modify_ _ { myUserId = Nothing }
    pure unit