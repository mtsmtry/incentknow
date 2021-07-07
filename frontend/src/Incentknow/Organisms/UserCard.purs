module Incentknow.Organisms.UserCard where

import Prelude
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Maybe.Utils (flatten)
import Data.Newtype (unwrap)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.API (getRelatedUser, getUser)
import Incentknow.API.Execution (Fetch, Remote(..), defaultIconUrl, executeAPI, forRemote, toMaybe)
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (RelatedUser)
import Incentknow.Data.Ids (UserId(..))
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, link, link_, maybeElem)
import Incentknow.Route (UserTab(..))
import Incentknow.Route as R
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { user :: RelatedUser, timestamp :: Number }

type State
  = { user :: RelatedUser, timestamp :: Number }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent R.Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. MonadAff m => Behaviour m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { user: input.user, timestamp: input.timestamp }

render :: forall m. State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "org-usercard" ]
    [ link_ Navigate (R.User state.user.displayId UserMain) [ HH.img [ HP.src $ fromMaybe defaultIconUrl $ state.user.iconUrl ] ]
    , HH.div [ css "info" ]
        [ link Navigate (R.User state.user.displayId UserMain) [ css "username" ] [ HH.text $ state.user.displayName ]
        , HH.div [ css "timestamp" ] [ dateTime state.timestamp ]
        ]
    ]

handleAction :: forall o m. MonadAff m => Behaviour m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put input
  Navigate event route -> navigateRoute event route
