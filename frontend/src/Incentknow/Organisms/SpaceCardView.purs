module Incentknow.Organisms.SpaceCardView where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Data.Entities (MembershipMethod(..), RelatedSpace, SpaceAuth(..), FocusedSpace)
import Incentknow.HTML.Utils (css, link)
import Incentknow.Route (Route(..), SpaceTab(..))
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { value :: Array FocusedSpace
    }

type State
  = { spaces :: Array FocusedSpace
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. MonadEffect m => Behaviour m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, receive = Just <<< HandleInput, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { spaces: input.value }

render :: forall m. Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-space-cardview" ]
    (map renderItem state.spaces)
  where
  renderItem :: FocusedSpace -> H.ComponentHTML Action ChildSlots m
  renderItem space =
    link Navigate (Space space.displayId SpaceContainers)
      [ css "item" ]
      [ HH.div [ css "upper"]
        [ HH.img [ HP.src "https://pakutaso.cdn.rabify.me/shared/img/thumb/elly20160701265118.jpg" ]
        ]
      , HH.div [ css "lower" ]
        [ HH.span [ css "title" ] [ HH.text space.displayName ]
        , if space.defaultAuthority == SpaceAuthNone && space.membershipMethod == MembershipMethodNone then
            HH.span [ css "private" ] [ HH.text "Private" ]
          else if space.defaultAuthority == SpaceAuthNone then
            HH.span [ css "group" ] [ HH.text "Group" ]
          else 
            HH.span [ css "public" ] [ HH.text "Public" ]
        , HH.span [ css "info" ] [ HH.text $ "メンバー: " <> show space.memberCount <> "人" <> " コンテンツ: " <> show space.contentCount <> "個" ]
        ]
      ]

handleAction :: forall o s m. MonadEffect m => Behaviour m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput props -> H.put $ initialState props
  Navigate event route -> navigateRoute event route
