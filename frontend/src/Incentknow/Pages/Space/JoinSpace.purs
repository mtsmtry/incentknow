module Incentknow.Pages.JoinSpace where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (applySpaceMembership)
import Incentknow.API.Execution (Fetch, Remote(..), executeCommand, forRemote)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Data.Entities (FocusedSpace)
import Incentknow.Data.Ids (SpaceId)
import Incentknow.Templates.Page (section)

type Input
  = { spaceId :: SpaceId }

type State
  = { spaceId :: SpaceId, space :: Remote FocusedSpace }

data Action
  = Submit
  | Initialize
  | FetchedSpace (Fetch FocusedSpace)

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { spaceId: input.spaceId, space: Loading }

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  section "page-community-join"
    [ HH.text $ ""
    , submitButton
        { isDisabled: false
        , isLoading: false
        , loadingText: ""
        , text: "スペースへの加入を申請する"
        , onClick: Submit
        }
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    --state <- H.get
    --fetchAPI FetchedSpace $ getSpace state.spaceId
    pure unit
  FetchedSpace fetch ->
    forRemote fetch \space ->
      H.modify_ _ { space = space }
  Submit -> do
    state <- H.get
    response <- executeCommand $ applySpaceMembership state.spaceId
    pure unit
