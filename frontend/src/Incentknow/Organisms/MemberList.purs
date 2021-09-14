module Incentknow.Organisms.MemberList where

import Prelude

import Data.DateTime.Utils (fromTimestampToString)
import Data.Maybe (Maybe(..), fromMaybe)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.API.Static (getIconUrl)
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Data.Entities (IntactSpaceMember, MemberType(..))
import Incentknow.HTML.DateTime (elapsedTime)
import Incentknow.HTML.Utils (css, link)
import Incentknow.Route (Route)
import Incentknow.Route as R
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { members :: Array IntactSpaceMember
    , isAdmin :: Boolean
    }

type State
  = { members :: Array IntactSpaceMember
    , isAdmin :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route

-- | AcceptMembership IntactSpaceMember
-- | RejectMembership IntactSpaceMember
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

showMemberType :: IntactSpaceMember -> String
showMemberType member = case member.type of
  MemberTypeOwner -> "オーナー"
  -- "admin" -> "管理者"
  MemberTypeNormal -> "メンバー"

-- "pending" -> "メンバー申請保留中"
-- _ -> "エラー"
render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "org-userlist" ]
    (map renderItem state.members)
  where
  renderItem :: IntactSpaceMember -> H.ComponentHTML Action ChildSlots m
  renderItem member =
    HH.div [ css "item" ]
      [ linkUser [ css "icon" ] [ HH.img [ HP.src $ getIconUrl member.user.iconImage ] ] -- TODO
      , HH.div [ css "details" ]
          [ linkUser [ css "username" ] [ HH.text member.user.displayName ]
          , HH.div [ css "info" ] [ HH.text $ showMemberType member ]
          , elapsedTime member.joinedAt
          , HH.text "に加わりました"
          --, whenElem (member.type == "pending" && state.isAdmin) \_->
          --    HH.div []
          --      [ HH.text "メンバーに申請しています"
          --      , menuPositiveButton "許可" (AcceptMembership member)
          --      , menuNegativeButton "拒否" (RejectMembership member)
          --      ]
          ]
      ]
    where
    linkUser = link Navigate (R.User member.user.displayId R.UserMain)

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput props -> do
    H.put $ initialState props
    handleAction Initialize
  Navigate event route -> navigateRoute event route
 --AcceptMembership member -> do --  _ <- executeAPI $ acceptSpaceMembership member.spaceId member.userId --  pure unit --RejectMembership member -> do --  _ <- executeAPI $ rejectSpaceMembership member.spaceId member.userId --  pure unit