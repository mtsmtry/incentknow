module Incentknow.Pages.Space.Home where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getFormats, getSpaceHomePage)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (RelatedFormat, IntactSpageHomePage)
import Incentknow.Data.Ids (FormatId, SpaceDisplayId, SpaceId)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.ActivityView as ActivityView
import Incentknow.Organisms.TopicView as TopicView
import Incentknow.Route (Route)

type Input
  = { spaceId :: SpaceId, spaceDisplayId :: SpaceDisplayId }

type State
  = { spaceId :: SpaceId, spaceDisplayId :: SpaceDisplayId, page :: Remote IntactSpageHomePage }

data Action
  = Initialize
  | Navigate Route
  | FetchedHomePace (Fetch IntactSpageHomePage)

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( activity :: ActivityView.Slot Unit
    , topic :: TopicView.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { spaceId: input.spaceId, spaceDisplayId: input.spaceDisplayId, page: Loading }

render :: forall m. MonadAff m => Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-space-home" ]
    [ HH.div [ css "item" ]
        [ HH.slot (SProxy :: SProxy "activity") unit ActivityView.component { value: map _.activities state.page } absurd
        ]
    , HH.div [ css "item" ] 
        [ HH.slot (SProxy :: SProxy "topic") unit TopicView.component { value: map _.topics state.page } absurd
        ]
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedHomePace $ getSpaceHomePage state.spaceId
  Navigate route -> navigate route
  FetchedHomePace fetch -> do
    forRemote fetch \page->
      H.modify_ _ { page = page }