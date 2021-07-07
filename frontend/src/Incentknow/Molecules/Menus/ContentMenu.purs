module Incentknow.Molecules.ContentMenu where

import Prelude

import Data.Argonaut.Core (jsonNull)
import Data.Array (filter, fromFoldable)
import Data.Foldable (for_)
import Data.Map as M
import Data.Map as Map
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap, wrap)
import Data.Symbol (SProxy(..))
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Incentknow.API (getContent, getContents, getRelatedContent)
import Incentknow.API.Execution (Fetch, executeAPI, forItem, toQueryCallback)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Content (ContentSemanticData, getContentSemanticData)
import Incentknow.Data.Entities (RelatedContent)
import Incentknow.Data.Ids (ContentId(..), FormatId(..), SpaceId(..))
import Incentknow.HTML.Utils (css, maybeElem)
import Incentknow.Molecules.SelectMenu (emptyCandidateSet)
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)

type Input
  = { value :: Maybe ContentId
    , formatId :: FormatId
    , spaceId :: Maybe SpaceId
    , disabled :: Boolean
    }

type State
  = { contentId :: Maybe ContentId
    , formatId :: FormatId
    , spaceId :: Maybe SpaceId
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeValue (Maybe ContentId)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot ContentId Unit )

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
  { contentId: input.value
  , spaceId: input.spaceId
  , formatId: input.formatId
  , disabled: input.disabled
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
    { value: state.contentId
    , disabled: state.disabled
    , fetchMultiple: case _ of
        Nothing -> case state.spaceId of 
          Just spaceId -> Just $ toQueryCallback $ map (\items-> { items, completed: true }) $ map (map toSelectMenuItem) $ getContents spaceId state.formatId
          Nothing -> Nothing
        _ -> Nothing
    , fetchSingle: Just $ \x-> toQueryCallback $ map toSelectMenuItem $ getRelatedContent x
    , fetchId: unwrap state.formatId
    , initial: emptyCandidateSet
    }
    (Just <<< ChangeValue)

toSelectMenuItem :: RelatedContent -> SelectMenuItem ContentId
toSelectMenuItem content =
  { id: content.contentId
  , name: semanticData.title
  , searchWord: semanticData.title
  , html: fromContentToHtml semanticData
  }
  where
  semanticData = getContentSemanticData content.data content.format -- TODO

fromContentToHtml :: ContentSemanticData -> forall a s m. H.ComponentHTML a s m
fromContentToHtml src =
  HH.div [ css "name" ]
    [ HH.text $ src.title
    , maybeElem src.image \image ->
        HH.img [ HP.src image ]
    ]

handleAction :: forall m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> do
    state <- H.get
    if state.formatId /= input.formatId || state.spaceId /= input.spaceId then do
      H.put $ initialState input
      handleAction Initialize
    else
      H.modify_ _ { contentId = input.value, disabled = input.disabled }
  ChangeValue value -> H.raise value
