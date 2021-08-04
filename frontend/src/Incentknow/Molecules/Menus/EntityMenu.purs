module Incentknow.Molecules.EntityMenu where

import Prelude

import Data.Either (Either(..))
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap, wrap)
import Data.Symbol (SProxy(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Content (getContentSemanticData)
import Incentknow.Data.Entities (RelatedContent)
import Incentknow.Data.Ids (FormatId, SemanticId)
import Incentknow.Molecules.ContentMenu (fromContentToHtml)
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)

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
  | ChangeValue (Maybe SemanticId)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot SemanticId Unit )

type Output
  = Maybe SemanticId

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
    { value: state.semanticId
    , disabled: state.disabled
    , fetchMultiple: \_-> Nothing
    , fetchSingle: Nothing--Just $ \x-> toQueryCallback $ map toSelectMenuItem $ getRelatedContent x
    , fetchId: ""
    , initial: { items: [], completed: false }
    }
    (Just <<< ChangeValue)
  where
  search :: String -> Aff (Either String (Array (SelectMenuItem SemanticId)))
  search words = do -- TODO
    --  result <- callAPI promise
    --  pure $ map (map toSelectMenuItem) result
    pure (Right [])

  --  where
  --  promise = getContentsByReactor { formatId: state.formatId, words: notNull words, conditions: null }
  -- get :: String -> (SelectMenuItem -> Effect Unit) -> Effect Unit
  get semanticId callback =  unit

--onLoadContentBySemanticId state.formatId (wrap semanticId) callback2
--where
--callback2 content = callback $ toSelectMenuItem content
toSelectMenuItem :: RelatedContent -> SelectMenuItem SemanticId
toSelectMenuItem content =
  { id: maybe (wrap $ unwrap content.contentId) (\x -> x) semanticData.semanticId
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
  ChangeValue value -> H.raise value
