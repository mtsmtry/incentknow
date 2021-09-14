module Incentknow.Pages.Activate where

import Prelude

import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Newtype (wrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getPublishedSpaces)
import Incentknow.API.Execution (Fetch, Remote(..), callbackQuery, executeAPI, executeCommand, forRemote)
import Incentknow.API.Session (activate, loadPage, reloadPage)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (FocusedSpace, RelatedSpace)
import Incentknow.HTML.Utils (css)
import Incentknow.Organisms.SpaceCardView as SpaceCardView
import Incentknow.Pages.Content as Content
import Incentknow.Pages.Space as Space
import Incentknow.Route (ContentSpec(..), Route(..), routeToPath)
import Incentknow.Templates.Main (centerLayout)

type Input
  = { token :: String }

type State
  = { token :: String }

data Action
  = Initialize

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ()

component :: forall q o m. Behaviour m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input = { token: input.token }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state = HH.text ""

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    state <- H.get
    _ <- executeAPI $ activate state.token
    H.liftEffect $ loadPage $ routeToPath Home