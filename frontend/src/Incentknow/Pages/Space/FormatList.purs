module Incentknow.Pages.Space.FormatList where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getFormats)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Data.Entities (RelatedFormat)
import Incentknow.Data.Ids (FormatDisplayId, SpaceDisplayId, SpaceId)
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Organisms.FormatList as FormatList
import Incentknow.Pages.Format as Format
import Incentknow.Route (FormatTab, Route(..))

type Input
  = { spaceId :: SpaceId, spaceDisplayId :: SpaceDisplayId, formatTab :: Maybe (Tuple FormatDisplayId FormatTab) }

type State
  = { spaceId :: SpaceId, spaceDisplayId :: SpaceDisplayId, formatTab :: Maybe (Tuple FormatDisplayId FormatTab), formats :: Remote (Array RelatedFormat) }

data Action
  = Initialize
  | Navigate Route
  | HandleInput Input
  | FetchedFormats (Fetch (Array RelatedFormat))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( formatList :: FormatList.Slot Unit
    , format :: Format.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction, receive = Just <<< HandleInput }
    }

initialState :: Input -> State
initialState input = { spaceId: input.spaceId, spaceDisplayId: input.spaceDisplayId, formatTab: input.formatTab, formats: Loading }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-format-list" ]
    [ submitButton { isDisabled: false, isLoading: false, loadingText: "", onClick: Navigate $ NewFormat state.spaceId, text: "新しいフォーマットを作成する" }
    , HH.slot (SProxy :: SProxy "formatList") unit FormatList.component { spaceId: state.spaceId, spaceDisplayId: state.spaceDisplayId } absurd
    , maybeElem state.formatTab \(Tuple formatId formatTab)->
        HH.slot (SProxy :: SProxy "format") unit Format.component { formatId, spaceId: state.spaceDisplayId, tab: formatTab } absurd
    ]
  
handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedFormats $ getFormats state.spaceId
  FetchedFormats fetch -> do
    forRemote fetch \formats ->
      H.modify_ _ { formats = formats }
  Navigate route -> navigate route
  HandleInput input -> do
    state <- H.get
    H.put $ initialState input
    when (state.spaceId /= input.spaceId) do
      handleAction Initialize
