module Incentknow.Pages.Space.MemberList where

import Prelude

import Data.Array (filter)
import Data.DateTime.Utils (fromTimestampToString)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), maybe)
import Data.Maybe.Utils (flatten)
import Data.Nullable (null, toMaybe)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Incentknow.Api (SpaceCommitter, SpaceMember, Space, getSpaceCommitters, getSpaceMembers)
import Incentknow.Api.Utils (Fetch, Remote(..), executeApi, fetchApi, forFetch)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Data.Ids (SpaceId(..))
import Incentknow.HTML.Utils (css, link, maybeElem, whenElem)
import Incentknow.Organisms.MemberList as MemberList
import Incentknow.Route (FormatTab(..), Route(..), SpaceTab(..), UserTab(..))
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { space :: Space, isAdmin :: Boolean }

type State
  = { space :: Space, isAdmin :: Boolean, members :: Remote (Array SpaceMember), committers :: Array SpaceCommitter }

data Action
  = Initialize
  | Navigate MouseEvent Route
  | FetchedMembers (Fetch (Array SpaceMember))

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
initialState input = { space: input.space, isAdmin: input.isAdmin, members: Loading, committers: [] }

render :: forall m. MonadAff m => Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-space-member-list" ]
    [ remoteWith state.members $ renderMembers state ]

renderMembers :: forall m. MonadAff m => Behaviour m => State -> Array SpaceMember -> H.ComponentHTML Action ChildSlots m
renderMembers state members =
  HH.div []
    [ whenElem isAdmin \_ ->
        HH.slot (SProxy :: SProxy "pendingMemberList") unit MemberList.component { members: pendingMembers, isAdmin: state.isAdmin } absurd
    , HH.slot (SProxy :: SProxy "memberList") unit MemberList.component { members: actualMembers, isAdmin: state.isAdmin } absurd
    ]
  where
  actualMembers = filter (\x -> x.type /= "pending") members

  pendingMembers = filter (\x -> x.type == "pending") members

  isAdmin = maybe false (\x -> x.type == "owner" || x.type == "admin") $ toMaybe state.space.myMember

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    fetchApi FetchedMembers $ getSpaceMembers state.space.spaceId null
  FetchedMembers fetch ->
    forFetch fetch \members ->
      H.modify_ _ { members = members }
  Navigate event route -> navigateRoute event route
