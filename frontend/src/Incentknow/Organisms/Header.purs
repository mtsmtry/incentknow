module Incentknow.Organisms.Header where

import Prelude

import Data.Maybe (Maybe(..), fromMaybe)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.API.Static (getIconUrl)
import Incentknow.AppM (class Behaviour, getAccount, navigate, navigateRoute)
import Incentknow.Atoms.Inputs (searchBox)
import Incentknow.Data.Entities (IntactAccount)
import Incentknow.HTML.Utils (css, link, link_, maybeElem)
import Incentknow.Molecules.Notifications (Query(..))
import Incentknow.Molecules.Notifications as Notifications
import Incentknow.Route (EditContentTarget(..), EditTarget(..), Route(..), UserTab(..))
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { route :: Route }

type State
  = { account :: Maybe IntactAccount, route :: Route }

data Action
  = Initialize
  | Navigate Route
  | NavigateRoute MouseEvent Route
  | HandleInput Input

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( notifications :: Notifications.Slot Unit )

component :: forall q o m. MonadAff m => Behaviour m => H.Component HH.HTML q Input o m
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

handleAction :: forall o m. MonadAff m => Behaviour m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    account <- getAccount
    H.modify_ _ { account = account }
  Navigate route -> navigate route
  NavigateRoute event route -> do
    case route of
      Notifications -> do
        _ <- H.query (SProxy :: SProxy "notifications") unit $ H.tell ReadAllNotifications
        pure unit
      _ -> pure unit
    navigateRoute event route
  HandleInput input -> H.modify_ _ { route = input.route }

initialState :: Input -> State
initialState input = { account: Nothing, route: input.route }

render :: forall m. MonadAff m => Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.header
    [ css "org-header" ]
    -- Logo
    [ HH.div
        [ css "logo" ]
        [ link_ NavigateRoute Home [ HH.text "Incentknow" ] ]
    -- Links
    , HH.nav
        [ css "links" ]
        [ headerLink "Spaces" SpaceList
        , maybeElem state.account \_ ->
            headerLinkEditDraft "Create"
        , HH.div [ css "search-box" ]
            [ searchBox { 
                value: 
                  case state.route of
                    SearchAll query -> fromMaybe "" query
                    _ -> "",
                onChange: \x-> Navigate $ SearchAll $ Just x
              }
            ]
        , HH.span [ css "space" ] []
        , maybeElem state.account \_ ->
            headerLinkNotifications
        , case state.account of
            Just account -> headerUserLink account.displayName account.iconImage (User account.displayId UserMain)
            Nothing -> headerLink "ログイン/登録" Sign
        ]
    ]
  where
  headerLink :: String -> Route -> H.ComponentHTML Action ChildSlots m
  headerLink name route =
    link NavigateRoute route
      [ css $ if route == state.route then "link link-selected" else "link" ]
      [ HH.span [ css "text" ] [ HH.text name ] ]

  headerLinkEditDraft :: String -> H.ComponentHTML Action ChildSlots m
  headerLinkEditDraft name =
    link NavigateRoute (EditDraft $ ContentTarget $ TargetBlank Nothing Nothing)
      [ css $ case state.route of
          EditDraft _ -> "link link-selected"
          _ -> "link" ]
      [ HH.span [ css "text" ] [ HH.text name ] ]

  headerUserLink :: String -> Maybe String -> Route -> H.ComponentHTML Action ChildSlots m
  headerUserLink name iconImage route =
    link NavigateRoute route
      [ css $ if route == state.route then "link link-selected" else "link" ]
      [ HH.img [ HP.src $ getIconUrl iconImage ]
      ]

  headerLinkNotifications :: H.ComponentHTML Action ChildSlots m
  headerLinkNotifications =
    link NavigateRoute Notifications
      [ css $ if state.route == Notifications then "notifications link link-selected" else "notifications link" ]
      [ HH.slot (SProxy :: SProxy "notifications") unit Notifications.component
          {} absurd
      ]