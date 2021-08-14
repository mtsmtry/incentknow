module Incentknow.Molecules.GeneratorMenu where

import Prelude

import Data.Maybe (Maybe(..), isJust)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (ContentGenerator(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)

type Input
  = { value :: Maybe ContentGenerator
    , disabled :: Boolean
    }

type State
  = { generator :: Maybe ContentGenerator
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | Change (Maybe ContentGenerator)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot ContentGenerator Unit
    )

type Output
  = Maybe ContentGenerator

component :: forall q m. Behaviour m => MonadAff m => H.Component HH.HTML q Input Output m
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

type Item
  = { id :: ContentGenerator
    , name :: String
    , desc :: String
    }

generators :: Array Item
generators =
  [ { id: ContentGeneratorNone, name: "None", desc: "ジェネレータは設定しません" }
  , { id: ContentGeneratorReactor, name: "Reactor", desc: "取得毎にコンテンツを生成するジェネレータを設定します" }
  ]

toSelectMenuItem :: Item -> SelectMenuItem ContentGenerator
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
  { generator: input.value
  , disabled: input.disabled
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div_
    [ HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
        { value: state.generator
        , disabled: state.disabled
        , fetchMultiple: \_-> Nothing
        , fetchSingle: Nothing
        , fetchId: ""
        , initial: { items: map toSelectMenuItem generators, completed: true }
        , visibleCrossmark: false
        }
        (Just <<< Change)
    ]

handleAction :: forall m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> when (isJust input.value) $ H.put $ initialState input
  Change generator -> do
    H.modify_ _ { generator = generator }
    H.raise generator
