module Incentknow.Organisms.UserCard where

import Prelude

import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.Api (User, defaultIconUrl, getUser)
import Incentknow.Api.Utils (Fetch, Remote(..), executeApi, fetchApi, forFetch, toMaybe)
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Ids (UserId(..))
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, link, link_, maybeElem)
import Incentknow.Route (UserTab(..))
import Incentknow.Route as R
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { userId :: UserId, timestamp :: Number }

type State
  = { userId :: UserId, timestamp :: Number, user :: Remote User }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent R.Route
  | FetchedUser (Fetch User)

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
initialState input = { userId: input.userId, timestamp: input.timestamp, user: Loading }

render :: forall m. State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "org-usercard" ]
    [ link_ Navigate (R.User state.userId UserMain) [ HH.img [ HP.src $ maybe defaultIconUrl _.iconUrl (toMaybe state.user) ] ]
    , HH.div [ css "info" ]
        [ link Navigate (R.User state.userId UserMain) [ css "username" ] [ HH.text $ maybe (unwrap state.userId) _.displayName (toMaybe state.user) ]
        , remoteWith state.user \user ->
            HH.div [ css "timestamp" ] [ dateTime state.timestamp ]
        ]
    ]

handleAction :: forall o m. MonadAff m => Behaviour m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    fetchApi FetchedUser $ getUser state.userId
  FetchedUser fetch -> do
    forFetch fetch \user ->
      H.modify_ _ { user = user }
  HandleInput input -> pure unit
  Navigate event route -> navigateRoute event route
