module Incentknow.Organisms.Header where

import Prelude

import Data.Maybe (Maybe(..), fromMaybe)
import Data.Nullable (toMaybe)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Halogen.Query.EventSource as ES
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Data.Entities (IntactAccount)
import Incentknow.HTML.Utils (css, link, link_, maybeElem)
import Incentknow.Route (Route(..), UserTab(..))
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { route :: Route }

type State
  = { account :: Maybe IntactAccount, route :: Route }

data Action
  = Initialize
  | Navigate MouseEvent Route
  | HandleInput Input
  | ChangeAccount (Maybe IntactAccount)

type Slot p
  = forall q. H.Slot q Void p

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

handleAction :: forall o m. MonadAff m => Behaviour m => Action -> H.HalogenM State Action () o m Unit
handleAction = case _ of
  Initialize -> do
   -- _ <- subscribeAPI (toMaybe >>> ChangeAccount) onSnapshotAccount
    pure unit
  Navigate event route -> navigateRoute event route
  HandleInput input -> H.modify_ _ { route = input.route }
  ChangeAccount account -> H.modify_ _ { account = account }

initialState :: Input -> State
initialState input = { account: Nothing, route: input.route }

render :: forall m. State -> H.ComponentHTML Action () m
render state =
  HH.header
    [ css "org-header" ]
    -- Logo
    [ HH.div
        [ css "logo" ]
        [ link_ Navigate Home [ HH.text "Incentknow" ] ]
    -- Links
    , HH.nav
        [ css "links" ]
        [ headerLink "Spaces" SpaceList
        , maybeElem state.account \_ ->
            headerLink "Drafts" DraftList
        , maybeElem state.account \_ ->
            headerLink "Create" (NewContent Nothing Nothing)
        , HH.span [ css "space" ] []
        , case state.account of
            Just account -> headerUrlLink account.displayName account.iconUrl (User account.displayId UserMain)
            Nothing -> headerLink "ログイン/登録" Sign
        ]
    ]
  where
  headerLink :: String -> Route -> H.ComponentHTML Action () m
  headerLink name route =
    link Navigate route
      [ css $ if route == state.route then "link link-selected" else "link" ]
      [ HH.span [ css "text" ] [ HH.text name ] ]

  headerUrlLink :: String -> Maybe String -> Route -> H.ComponentHTML Action () m
  headerUrlLink name url route =
    link Navigate route
      [ css $ if route == state.route then "link link-selected" else "link" ]
      [ HH.img [ HP.src $ fromMaybe "" url ]
      , HH.span [ css "text" ] [ HH.text name ]
      ]
