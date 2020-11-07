module Incentknow.Organisms.MemberList where

import Prelude

import Control.Parallel (sequential)
import Control.Promise (toAff)
import Data.Array (singleton)
import Data.DateTime (DateTime(..))
import Data.DateTime.Utils (fromTimestampToString)
import Data.Map (Map, fromFoldable)
import Data.Map as M
import Data.Maybe (Maybe(..), maybe)
import Data.Traversable (for)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.Api (SpaceMember, User, acceptSpaceMembership, getUser, rejectSpaceMembership)
import Incentknow.Api.Utils (executeApi)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.Atoms.Inputs (menuPositiveButton, menuNegativeButton)
import Incentknow.Data.Ids (UserId(..))
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, link, link_, maybeElem, whenElem)
import Incentknow.Route (Route)
import Incentknow.Route as R
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { members :: Array SpaceMember
    , isAdmin :: Boolean
    }

type State
  = { members :: Array SpaceMember
    , isAdmin :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route
  | AcceptMembership SpaceMember
  | RejectMembership SpaceMember

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
initialState input = { members: input.members, isAdmin: input.isAdmin }

showMemberType :: SpaceMember -> String
showMemberType member = case member.type of
  "owner" -> "オーナー"
  "admin" -> "管理者"
  "normal" -> "メンバー"
  "pending" -> "メンバー申請保留中"
  _ -> "エラー"

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-userlist" ]
    (map renderItem state.members)
  where
  renderItem :: SpaceMember -> H.ComponentHTML Action ChildSlots m
  renderItem member =
    HH.div [ css "item" ]
      [ linkUser [ css "icon" ] [ HH.img [ HP.src member.user.iconUrl ] ]
      , HH.div [ css "details" ]
          [ linkUser [ css "username" ] [ HH.text member.user.displayName ]
          , HH.div [ css "info" ] [ HH.text $ showMemberType member ]
          , whenElem (member.type /= "pending") \_->
            HH.text $ fromTimestampToString member.joinedAt <> "に加入しました"
          , whenElem (member.type == "pending" && state.isAdmin) \_->
              HH.div []
                [ HH.text "メンバーに申請しています"
                , menuPositiveButton "許可" (AcceptMembership member)
                , menuNegativeButton "拒否" (RejectMembership member)
                ]
          ]
      ]
      where
      linkUser = link Navigate (R.User member.user.userId R.UserMain)

handleAction :: forall o s m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput props -> do
    H.put $ initialState props
    handleAction Initialize
  Navigate event route -> navigateRoute event route
  AcceptMembership member -> do
    _ <- executeApi $ acceptSpaceMembership member.spaceId member.userId
    pure unit
  RejectMembership member -> do
    _ <- executeApi $ rejectSpaceMembership member.spaceId member.userId
    pure unit
