module Incentknow.Molecules.SpaceMenu where

import Prelude

import Data.Array (filter, fromFoldable)
import Data.Foldable (for_)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getCandidateSpaces, getPublishedSpaces, getRelatedSpace, getSpace)
import Incentknow.API.Execution (Fetch, executeAPI, forItem, toQueryCallback)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (RelatedSpace)
import Incentknow.Data.Ids (SpaceId(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.SelectMenu (emptyCandidateSet)
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)

type Input
  = { value :: Maybe SpaceId
    , disabled :: Boolean
    }

type State
  = { spaceId :: Maybe SpaceId
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeValue (Maybe SpaceId)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot SpaceId Unit )

type Output
  = Maybe SpaceId

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
  { spaceId: input.value
  , disabled: input.disabled
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
    { value: state.spaceId
    , disabled: false
    , fetchMultiple: case _ of
        Just word -> Nothing
        Nothing -> Just $ toQueryCallback $ map (\items-> { items, completed: true }) $ map (map toSelectMenuItem) getCandidateSpaces
    , fetchSingle: Just $ \x-> toQueryCallback $ map toSelectMenuItem $ getRelatedSpace x
    , fetchId: ""
    , initial: emptyCandidateSet
    , visibleCrossmark: false
    }
    (Just <<< ChangeValue)

toSelectMenuItem :: RelatedSpace -> SelectMenuItem SpaceId
toSelectMenuItem space =
  { id: space.spaceId
  , name: space.displayName
  , searchWord: space.displayName
  , html: html
  }
  where
  html :: forall a s m. H.ComponentHTML a s m
  html =
    HH.div [ css "mol-space-menu-item" ]
      [ HH.span [ css "displayName" ] [ HH.text space.displayName ]
      , HH.span [ css "displayId" ] [ HH.text $ "@" <> unwrap space.displayId ]
      ]

handleAction :: forall m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.modify_ _ { spaceId = input.value, disabled = input.disabled }
  ChangeValue value -> H.raise value
