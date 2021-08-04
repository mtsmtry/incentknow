module Incentknow.Pages.Space.ContainerList where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getSpaceContainers)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (RelatedContainer)
import Incentknow.Data.Ids (SpaceDisplayId, SpaceId)
import Incentknow.HTML.Utils (css)
import Incentknow.Route (Route(..))

type Input
  = { spaceId :: SpaceId, spaceDisplayId :: SpaceDisplayId }

type State
  = { spaceId :: SpaceId, spaceDisplayId :: SpaceDisplayId, containers :: Remote (Array RelatedContainer) }

data Action
  = Initialize
  | Navigate Route
  | FetchedContainers (Fetch (Array RelatedContainer))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( )

component :: forall q o m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { spaceId: input.spaceId, spaceDisplayId: input.spaceDisplayId, containers: Loading }

-- toCardViewItem :: State -> RelatedContainer -> CardViewItem
toCardViewItem state container =
  { title: container.format.displayName
  , route: Container state.spaceDisplayId container.format.displayId
  , desc: ""
  , info: ""
  }

render :: forall m. MonadEffect m => Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-space-page-list" ]
    [ HH.div [ css "table" ]
        [ HH.div [ css "header" ]
            [ HH.div [ css "column" ]
                [ --HH.text "ã‚¹ãƒšãƒ¼ã‚¹"]
                ]
            , HH.div [ css "body" ]
                [ remoteWith state.containers \containers ->
                    HH.text "" --HH.slot (SProxy :: SProxy "cardview") unit CardView.component { items: map (toCardViewItem state) containers } absurd
                ]
            ]
        ]
    ]

handleAction :: forall o m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedContainers $ getSpaceContainers state.spaceId
  FetchedContainers fetch -> do
    forRemote fetch \containers ->
      H.modify_ _ { containers = containers }
  Navigate route -> navigate route
