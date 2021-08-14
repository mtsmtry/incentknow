module Incentknow.Organisms.DraftHistory where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Traversable (for_)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getContentCommits)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (RelatedContentCommit)
import Incentknow.Data.Ids (ContentId)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css)
import Incentknow.Route (Route)
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { contentId :: Maybe ContentId }

type State
  = { contentId :: Maybe ContentId, commits :: Remote (Array RelatedContentCommit)
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route
  | FetchedCommits (Fetch (Array RelatedContentCommit))

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
initialState input = { contentId: input.contentId, commits: Loading }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "org-draft-history" ] 
    [ remoteWith state.commits \commits-> 
        HH.div [ css "box" ]
          (map renderCommit commits)
    ]
  where
  renderCommit :: RelatedContentCommit -> H.ComponentHTML Action ChildSlots m
  renderCommit commit =
    HH.div [ css "node" ]
      [ dateTime commit.timestamp
      ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.contentId \contentId->
      callbackQuery FetchedCommits $ getContentCommits contentId
  HandleInput input -> do
    state <- H.get
    when (input.contentId /= state.contentId) do
      H.put $ initialState input
      handleAction Initialize
  Navigate event route -> navigateRoute event route
  FetchedCommits fetch -> do
    forRemote fetch \commits->
      H.modify_ _ { commits = commits }