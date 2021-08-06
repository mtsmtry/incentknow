module Incentknow.Organisms.ListView where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Data.Entities (FocusedFormat, RelatedUser)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, link, link_, maybeElem)
import Incentknow.Route (Route)
import Incentknow.Route as R
import Web.UIEvent.MouseEvent (MouseEvent)

type ListViewItem
  = { user :: Maybe RelatedUser
    , datetime :: Maybe Number
    , title :: String
    , format :: Maybe FocusedFormat
    , route :: Route
    }

type Input
  = { items :: Array ListViewItem
    }

type State
  = { items :: Array ListViewItem
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { items: input.items }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-listview" ]
    (map renderItem state.items)
  where
  renderItem :: ListViewItem -> H.ComponentHTML Action ChildSlots m
  renderItem item =
    link Navigate item.route
      [ css "item" ]
      [ maybeElem item.format \format ->
          HH.div [ css "format" ]
            [ link_ Navigate (R.Space format.space.displayId $ R.SpaceFormat format.displayId R.FormatMain) [ HH.text $ format.displayName ] ]
      , HH.div [ css "title" ]
          [ HH.text item.title ]
      , case item.user, item.datetime of
          Just user, Just dt ->
            HH.div [ css "user" ]
              [ HH.div [ css "username" ] [ HH.span [] [ link_ Navigate (R.User user.displayId R.UserMain) [HH.text user.displayName] ] ]
              , HH.div [ css "datetime" ] [ HH.span [] [ dateTime dt ] ]
              ]
          Just user, Nothing -> HH.div [ css "username" ] [ HH.span [] [ link_ Navigate (R.User user.displayId R.UserMain) [ HH.text user.displayName ] ] ]
          Nothing, Just dt -> HH.div [ css "datetime" ] [ HH.span [] [ dateTime dt ] ]
          _, _ -> HH.text ""
      ]

handleAction :: forall o s m. Behaviour m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput props -> H.put $ initialState props
  Navigate event route -> navigateRoute event route
