module Incentknow.Molecules.CompositionMenu where

import Prelude

import Data.Maybe (Maybe(..), isJust, isNothing)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Page (ContentComposition(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)

type Input
  = { value :: Maybe ContentComposition
    , disabled :: Boolean
    }

type State
  = { typeItems :: Array (SelectMenuItem String)
    , disabled :: Boolean
    , type :: Maybe String
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeType (Maybe String)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot String Unit
    )

type Output
  = Maybe ContentComposition

component :: forall q m. Behaviour m => MonadAff m => H.Component HH.HTML q Input Output m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          $ H.defaultEval
              { initialize = Just Initialize
              , handleAction = handleAction
              , receive = Just <<< HandleInput
              }
    }

type Item
  = { id :: String
    , name :: String
    , desc :: String
    }

typeItems :: Array Item
typeItems =
  [ --{ id: "board", name: "Integer", desc: "整数" }
  --, { id: "timeline", name: "String", desc: "文字列(改行なし)" }
  --, { id: "gallery", name: "Text", desc: "文字列(改行あり)" }
   { id: "list", name: "リスト", desc: "一覧表示します" }
  --, { id: "table", name: "Boolean", desc: "ブール値" }
  --, { id: "outliner", name: "Enum", desc: "列挙体" }
  ]

toSelectMenuItem :: Item -> SelectMenuItem String
toSelectMenuItem format =
  { id: format.id
  , name: format.name
  , searchWord: format.name
  , html
  }
  where
  html :: forall a s m. H.ComponentHTML a s m
  html =
    HH.div []
      [ HH.div [ css "name" ] [ HH.text format.name ]
      , HH.div [ css "desc" ] [ HH.text format.desc ]
      ]

initialState :: Input -> State
initialState input =
  { typeItems: map toSelectMenuItem typeItems
  , disabled: input.disabled
  , type: map getCompositionType input.value
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div_
    [ HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
        { value: state.type
        , disabled: state.disabled
        , fetchMultiple: \_-> Nothing
        , fetchSingle: Nothing
        , fetchId: ""
        , initial: { items: state.typeItems, completed: true }
        , visibleCrossmark: true
        }
        (Just <<< ChangeType)
    ]

getCompositionType :: ContentComposition -> String
getCompositionType = case _ of
  CompositionList -> "list"
  _ -> "list"

mkContentComposition :: String -> Maybe ContentComposition
mkContentComposition ty = case ty of
  "list" -> pure CompositionList
  _ -> Nothing

buildContentComposition :: State -> Maybe (Maybe ContentComposition)
buildContentComposition state = case state.type of
  Just ty -> case mkContentComposition ty of
    Just composition -> Just $ Just composition
    Nothing -> Nothing
  Nothing -> Just Nothing

-- Just Just x: 値あり
-- Just Nothing: 値なし
-- Nothing: 保留
raiseOrModify :: forall m. State -> H.HalogenM State Action ChildSlots Output m Unit
raiseOrModify state = case buildContentComposition state of
  Just value -> do
    H.raise value
    when (isNothing value) $ H.put state
  Nothing -> H.put state

handleAction :: forall m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> when (isJust input.value) $ H.put $ initialState input
  ChangeType ty -> do
    state <- H.get
    raiseOrModify $ state { type = ty }