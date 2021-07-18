module Incentknow.Molecules.FormatMenu where

import Prelude

import Data.Array (filter, fromFoldable)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), isJust, maybe)
import Data.Newtype (unwrap)
import Data.Nullable (notNull, null)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect, liftEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getFormats, getRelatedFormat)
import Incentknow.API.Execution (Fetch(..), Remote(..), executeAPI, forItem, forRemote, mapCallback, promptCallback, toQueryCallback)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (FormatUsage, RelatedFormat)
import Incentknow.Data.Ids (FormatId(..), SpaceId(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.SelectMenu (emptyCandidateSet)
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)
import Test.Unit.Console (consoleLog)

{- 
  A component for selecting a format on the specified constraint
-}
data FormatFilter
  = Formats (Array RelatedFormat)
  | SpaceBy SpaceId
  | SpaceByAndHasSemanticId SpaceId
  | None

derive instance eqFormatFilter :: Eq FormatFilter

type Input
  = { filter :: FormatFilter
    , value :: Maybe FormatId
    , disabled :: Boolean
    }

type State
  = { filter :: FormatFilter
    , formatId :: Maybe FormatId
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeValue (Maybe FormatId)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot FormatId Unit )

type Output
  = Maybe FormatId

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
  { filter: input.filter
  , formatId: input.value
  , disabled: input.disabled
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
    { value: state.formatId
    , disabled: state.disabled
    , fetchMultiple: \maybeWord-> case state.filter of
        SpaceBy spaceId ->
          case maybeWord of 
            Nothing -> Just $ toQueryCallback $ map (\items-> { items, completed: true }) $ map (map toSelectMenuItem) $ getFormats spaceId
            _ -> Nothing
        SpaceByAndHasSemanticId spaceId ->
          case maybeWord of 
            Nothing -> Just $ toQueryCallback $ map (\items-> { items, completed: true }) $ map (map toSelectMenuItem) $ getFormats spaceId
            _ -> Nothing
        _ -> Nothing
    , fetchSingle: Just $ \x-> toQueryCallback $ map toSelectMenuItem $ getRelatedFormat x
    , fetchId: case state.filter of 
        SpaceBy spaceId -> unwrap spaceId
        SpaceByAndHasSemanticId spaceId -> "Semantic" <> unwrap spaceId
        _ -> ""
    , initial: emptyCandidateSet
    }
    (Just <<< ChangeValue)

toSelectMenuItem :: RelatedFormat -> SelectMenuItem FormatId
toSelectMenuItem format =
  { id: format.formatId
  , name: format.displayName
  , searchWord: format.displayName
  , html: html
  }
  where
  html :: forall a s m. H.ComponentHTML a s m
  html =
    HH.div [ css "name" ]
      [ HH.text format.displayName
      ]

handleAction :: forall m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> do
    state <- H.get
    if input.filter /= state.filter then do
      H.put $ initialState input
      handleAction Initialize
    else
      H.modify_ _ { formatId = input.value, disabled = input.disabled }
  ChangeValue value -> do
    liftEffect $ consoleLog $ "FormatMenu.ChangeValue:" <> maybe "Nothing" unwrap value
    H.raise value
