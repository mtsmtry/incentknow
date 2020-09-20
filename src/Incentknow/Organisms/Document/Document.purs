module Incentknow.Organisms.Document where

import Prelude
import Data.Argonaut.Core (Json, jsonNull)
import Data.Argonaut.Decode (decodeJson)
import Data.Argonaut.Encode (encodeJson)
import Data.Argonaut.Parser (jsonParser)
import Data.Array (cons)
import Data.Either (either)
import Data.Foldable (traverse_)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (wrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Inputs (button)
import Incentknow.Data.Document (Section)
import Incentknow.Data.Ids (ContentId, generateId)
import Incentknow.HTML.Utils (maybeElem)
import Incentknow.Organisms.Content.Common (EditEnvironment)
import Incentknow.Organisms.Content.ValueViewer as Value
import Incentknow.Organisms.Document.Section (ContentComponent)
import Incentknow.Organisms.Document.Section as Section

type Input
  = { value :: Json, env :: EditEnvironment, contentComponent :: ContentComponent }

type State
  = { sections :: Array Section, env :: EditEnvironment, contentComponent :: ContentComponent }

data Action
  = Initialize
  | HandleInput Input
  | AddSection
  | ChangeSection Section

type Slot p
  = forall q. H.Slot q Output p

type Output
  = Json

type ChildSlots
  = ( section :: Section.Slot String )

component :: forall q m. Behaviour m => MonadEffect m => MonadAff m => H.Component HH.HTML q Input Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , handleAction = handleAction
            , receive = Just <<< HandleInput
            }
    }

initialState :: Input -> State
initialState input =
  { sections: either (const []) (\x -> x) $ decodeJson input.value
  , env: input.env
  , contentComponent: input.contentComponent
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div_
    [ button "追加" AddSection
    , HH.div_ (map renderSection state.sections)
    ]
  where
  renderSection section = HH.slot (SProxy :: SProxy "section") section.id Section.component { value: section, env: state.env, contentComponent: state.contentComponent } (Just <<< ChangeSection)

handleAction :: forall m. Behaviour m => MonadEffect m => MonadAff m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put $ initialState input
  ChangeSection section -> do
    state <- H.get
    H.raise $ encodeJson $ map (\y -> if y.id == section.id then section else y) state.sections
  AddSection -> do
    state <- H.get
    newId <- generateId 6
    H.raise $ encodeJson $ cons (defautSection newId) state.sections
    where
    defautSection id = { type: "text", id, data: jsonNull }
