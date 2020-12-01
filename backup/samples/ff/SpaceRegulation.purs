module Incentknow.Organisms.SpaceRegulation where

import Prelude

import Data.Maybe (Maybe(..), fromMaybe)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Inputs (checkbox)
import Incentknow.HTML.Utils (whenElem)

type Input
  = { value :: SpaceRegulation }

type State
  = { regulation :: SpaceRegulation }

data Action
  = HandleInput Input
  | ChangeFormatLimited Boolean

data Query a
  = GetValue (SpaceRegulation -> a)

type Slot
  = H.Slot Query Void

type ChildSlots
  = ( formatRegulation :: FormatRegulation.Slot Unit )

component :: forall o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML Query Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { handleAction = handleAction
            , handleQuery = handleQuery
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input = { regulation: input.value }

formatRegulation_ = SProxy :: SProxy "formatRegulation"

render :: forall m. Behaviour m => MonadAff m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div []
    [ checkbox "制限する" state.regulation.isFormatLimited ChangeFormatLimited
    , whenElem state.regulation.isFormatLimited \_ ->
        HH.slot formatRegulation_ unit FormatRegulation.component { value: [] } absurd
    ]

handleAction :: forall o m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  HandleInput input -> pure unit
  ChangeFormatLimited isFormatLimited -> H.modify_ \x -> x { regulation = x.regulation { isFormatLimited = isFormatLimited } }

handleQuery :: forall o m a. Query a -> H.HalogenM State Action ChildSlots o m (Maybe a)
handleQuery = case _ of
  GetValue k -> do
    state <- H.get
    formatRegulations <- H.query formatRegulation_ unit (H.request FormatRegulation.GetValue)
    pure $ Just $ k state.regulation { formatRegulations = fromMaybe [] formatRegulations }
