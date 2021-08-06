module Incentknow.Organisms.DraftHistory where

import Prelude

import Data.Array (catMaybes, foldr)
import Data.Array as A
import Data.Map.Internal as M
import Data.Maybe (Maybe(..), maybe)
import Data.Traversable (for, for_)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getContentCommits, getContentEditingNodes, getMyContentDrafts)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigateRoute)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (FocusedFormat, RelatedContentCommit, RelatedContentDraft, ContentNode)
import Incentknow.Data.Ids (ContentDraftId, ContentId)
import Incentknow.HTML.DateTime (dateTime)
import Incentknow.HTML.Utils (css, link)
import Incentknow.Route (EditContentTarget(..), EditTarget(..), Route(..))
import Web.UIEvent.MouseEvent (MouseEvent)

type Input
  = { draftId :: Maybe ContentDraftId }

type State
  = { draftId :: Maybe ContentDraftId, nodes :: Remote (Array ContentNode)
    }

data Action
  = Initialize
  | HandleInput Input
  | Navigate MouseEvent Route
  | FetchedNodes (Fetch (Array ContentNode))

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
initialState input = { draftId: input.draftId, nodes: Loading }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "org-draft-history" ] 
    [ remoteWith state.nodes \nodes-> 
        HH.div [ css "box" ]
          (map renderNode nodes)
    ]
  where
  renderNode :: ContentNode -> H.ComponentHTML Action ChildSlots m
  renderNode node =
    HH.div [ css "node" ]
      [ dateTime node.rivision.timestamp
      ]

handleAction :: forall o s m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    for_ state.draftId \draftId->
      callbackQuery FetchedNodes $ getContentEditingNodes draftId
  HandleInput input -> do
    state <- H.get
    when (input.draftId /= state.draftId) do
      H.put $ initialState input
      handleAction Initialize
  Navigate event route -> navigateRoute event route
  FetchedNodes fetch -> do
    forRemote fetch \nodes->
      H.modify_ _ { nodes = nodes }