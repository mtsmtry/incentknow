module Incentknow.Pages.Format.Versions where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getStructures)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, forRemote)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (RelatedStructure)
import Incentknow.Data.Ids (FormatId)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.Structure as Structure

type Input
  = { formatId :: FormatId }

type State
  = { formatId :: FormatId, versions :: Remote (Array RelatedStructure) }

data Action
  = Initialize
  | FetchedVersions (Fetch (Array RelatedStructure))

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( structure :: Structure.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { formatId: input.formatId, versions: Loading }

render :: forall m. MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div
    [ css "page-format-versions" ]
    [ remoteWith state.versions \versions ->
        HH.div [ css "list" ] (map renderVersion versions)
    ]
  where
  renderVersion :: RelatedStructure -> H.ComponentHTML Action ChildSlots m
  renderVersion version =
    HH.div [ css "item" ]
      [ HH.div [] [ HH.text $ show version.version ]
      --  , HH.div [] [ HH.text version.creatorUserId ]
      ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    callbackQuery FetchedVersions $ getStructures state.formatId
  FetchedVersions fetch -> do
    forRemote fetch \versions ->
      H.modify_ _ { versions = versions }
