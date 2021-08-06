module Incentknow.Pages.Space.Home where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getFormats)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour, navigate)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (RelatedFormat)
import Incentknow.Data.Ids (FormatId, SpaceDisplayId, SpaceId)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.LatestContentList as LatestContentList
import Incentknow.Organisms.LatestContentListByFormat as LatestContentListByFormat
import Incentknow.Route (Route)

type Input
  = { spaceId :: SpaceId, spaceDisplayId :: SpaceDisplayId }

type State
  = { spaceId :: SpaceId, spaceDisplayId :: SpaceDisplayId, formats :: Remote (Array RelatedFormat) }

data Action
  = Initialize
  | Navigate Route
  | FetchedFormat (Fetch (Array RelatedFormat))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( latestContentList :: LatestContentList.Slot Unit
    , latestContentListByFormat :: LatestContentListByFormat.Slot FormatId
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { spaceId: input.spaceId, spaceDisplayId: input.spaceDisplayId, formats: Loading }

render :: forall m. MonadAff m => Behaviour m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-space-home" ]
    [ HH.slot (SProxy :: SProxy "latestContentList") unit LatestContentList.component { spaceId: state.spaceId } absurd
    , remoteWith state.formats \formats->
        HH.div [ css "byformat" ] (map renderItem formats)
    ]
  where
  renderItem :: RelatedFormat -> H.ComponentHTML Action ChildSlots m
  renderItem format =
    HH.div [ css "item" ]
      [ HH.slot (SProxy :: SProxy "latestContentListByFormat") format.formatId LatestContentListByFormat.component { spaceId: state.spaceId, format } absurd
      ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedFormat $ getFormats state.spaceId
  Navigate route -> navigate route
  FetchedFormat fetch -> do
    forRemote fetch \formats->
      H.modify_ _ { formats = formats }