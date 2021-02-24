module Incentknow.Pages.Format.Reactor where

import Prelude
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing)
import Data.Maybe.Utils (flatten)
import Data.Newtype (wrap)
import Data.Nullable (notNull)
import Data.Nullable as N
import Data.String (length)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (checkSpaceDisplayId, createSpace, getReactor, setReactorDefinitionId)
import Incentknow.Api.Execution (Fetch, Remote(..), callApi, executeApi, fetchApi, forFetch, toMaybe)
import Incentknow.AppM (class Behaviour, Message(..), message, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Data.Entities (FocusedFormat, IntactReactor)
import Incentknow.Data.Ids (ContentId(..), FormatId(..))
import Incentknow.Data.Utils (generateId)
import Incentknow.HTML.Utils (maybeElem)
import Incentknow.Molecules.ContentMenu as ContentMenu
import Incentknow.Molecules.DisplayId (CheckState(..))
import Incentknow.Molecules.DisplayId as DisplayId
import Incentknow.Molecules.Form (define, defineText)
import Incentknow.Route (Route(..), SpaceTab(..))
import Incentknow.Templates.Page (creationPage, section)

type Input
  = { format :: FocusedFormat }

type State
  = { format :: FocusedFormat
    , reactor :: Remote IntactReactor
    , loading :: Boolean
    , definitionId :: Maybe ContentId
    }

data Action
  = Initialize
  | Submit
  | ChangeDefinitionId (Maybe ContentId)
  | FetchedReactor (Fetch IntactReactor)

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( contentMenu :: ContentMenu.Slot Unit )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input =
  { format: input.format
  , reactor: Loading
  , definitionId: Nothing
  , loading: false
  }

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  creationPage { title: "Reactorを設定する", desc: "" }
    [ remoteWith state.reactor \reactor ->
        HH.div []
          [ define "ID"
              [ HH.slot (SProxy :: SProxy "contentMenu") unit ContentMenu.component
                  { formatId: wrap "n7rocAV23l29"
                  , spaceId: Just reactor.space.spaceId
                  , disabled: false
                  , value: state.definitionId
                  }
                  (Just <<< ChangeDefinitionId)
              ]
          , submitButton
              { isDisabled: state.loading || isNothing state.definitionId
              , isLoading: state.loading
              , loadingText: ""
              , text: "スペースを作成"
              , onClick: Submit
              }
          ]
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    fetchApi FetchedReactor $ getReactor state.format.formatId
  FetchedReactor fetch -> do
    forFetch fetch \reactor ->
      H.modify_ _ { reactor = reactor, definitionId = flatten $ map (\x -> N.toMaybe x.definitionId) $ toMaybe reactor }
  ChangeDefinitionId definitionId -> H.modify_ _ { definitionId = definitionId }
  Submit -> do
    state <- H.get
    for_ state.definitionId \definitionId -> do
      H.modify_ _ { loading = true }
      response <- executeApi $ setReactorDefinitionId state.format.formatId definitionId
      for_ response \spaceId -> do
        message $ Success "変更しました"
      H.modify_ _ { loading = false }
