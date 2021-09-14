module Incentknow.Pages.Space.MemberList where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getSpaceMembers)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (remoteArrayWith, remoteWith)
import Incentknow.Data.Entities (IntactSpaceMember)
import Incentknow.Data.Ids (SpaceId)
import Incentknow.HTML.Utils (css, whenElem)
import Incentknow.Organisms.MemberList as MemberList
import Incentknow.Route (Route)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { spaceId :: SpaceId, isAdmin :: Boolean }

type State
  = { spaceId :: SpaceId, isAdmin :: Boolean, members :: Remote (Array IntactSpaceMember) }

data Action
  = Initialize
  | Navigate MouseEvent Route
  | FetchedMembers (Fetch (Array IntactSpaceMember))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( memberList :: MemberList.Slot Unit, pendingMemberList :: MemberList.Slot Unit )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { spaceId: input.spaceId, isAdmin: input.isAdmin, members: Loading }

render :: forall m. MonadAff m => Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-space-member-list" ]
    [ remoteArrayWith state.members $ renderMembers state ]

renderMembers :: forall m. MonadAff m => Behaviour m => State -> Array IntactSpaceMember -> H.ComponentHTML Action ChildSlots m
renderMembers state members =
  HH.div []
    [ whenElem isAdmin \_ ->
        --       HH.slot (SProxy :: SProxy "pendingMemberList") unit MemberList.component { members: pendingMembers, isAdmin: state.isAdmin } absurd
        HH.slot (SProxy :: SProxy "memberList") unit MemberList.component { members, isAdmin: state.isAdmin } absurd
    ]
  where
  --actualMembers = filter (\x -> x.type /= "pending") members
  --pendingMembers = filter (\x -> x.type == "pending") members
  isAdmin = true --maybe false (\x -> x.type == "owner" || x.type == "admin") $ toMaybe state.space.myMember

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedMembers $ getSpaceMembers state.spaceId
  FetchedMembers fetch ->
    forRemote fetch \members ->
      H.modify_ _ { members = members }
  Navigate event route -> navigateRoute event route
