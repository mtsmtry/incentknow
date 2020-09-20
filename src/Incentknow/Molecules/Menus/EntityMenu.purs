module Incentknow.Molecules.EntityMenu where

import Prelude

import Control.Promise (Promise)
import Data.Array (filter, singleton)
import Data.Array as Array
import Data.Either (Either, either)
import Data.Foldable (for_)
import Data.Map as M
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (unwrap, wrap)
import Data.Nullable (notNull, toMaybe)
import Data.Set as Set
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Foreign.NullOrUndefined (null)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Api (Content, Format, getContent, getContents, getContentsByFormat, getContentsByReactor, onLoadContentBySemanticId)
import Incentknow.Api.Utils (callApi, callbackApi, executeApi)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Ids (ContentId(..), FormatId(..), SemanticId(..), SpaceId(..))
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Molecules.ContentMenu (fromContentToHtml)
import Incentknow.Molecules.SelectMenu (SelectMenuItem, SelectMenuResource(..))
import Incentknow.Molecules.SelectMenu as SelectMenu

type Input
  = { value :: Maybe SemanticId
    , formatId :: FormatId
    , disabled :: Boolean
    }

type State
  = { semanticId :: Maybe SemanticId
    , formatId :: FormatId
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeValue (Maybe String)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot Unit )

type Output
  = Maybe ContentId

component :: forall q m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input Output m
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
  { semanticId: input.value
  , formatId: input.formatId
  , disabled: input.disabled
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
    { resource: SelectMenuResourceFetchFunctions { search, get }, 
      value: map unwrap state.semanticId, disabled: state.disabled }
    (Just <<< ChangeValue)
  where
  search :: String -> Aff (Either String (Array SelectMenuItem))
  search words = do
    result <- callApi promise
    pure $ map (map toSelectMenuItem) result
    where
    promise = getContentsByReactor { formatId: state.formatId, words: notNull words, conditions: null }

  get :: String -> (SelectMenuItem -> Effect Unit) -> Effect Unit
  get semanticId callback =
    onLoadContentBySemanticId state.formatId (wrap semanticId) callback2
    where
    callback2 content = callback $ toSelectMenuItem content

toSelectMenuItem :: Content -> SelectMenuItem
toSelectMenuItem content =
  { id: maybe (unwrap content.contentId) unwrap semanticData.semanticId 
  , name: semanticData.title
  , searchWord: semanticData.title
  , html: fromContentToHtml semanticData
  }
  where
  semanticData = getContentSemanticData content.data content.format

handleAction :: forall m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.modify_ _ { formatId = input.formatId, semanticId = input.value, disabled = input.disabled }
  ChangeValue value -> H.raise $ map ContentId value
