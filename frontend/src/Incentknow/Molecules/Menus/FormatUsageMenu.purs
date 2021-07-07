module Incentknow.Molecules.FormatUsageMenu where

import Prelude

import Data.Array (elem, filter)
import Data.Maybe (Maybe(..), fromMaybe, isJust, isNothing)
import Data.Maybe.Utils (flatten)
import Data.Newtype (unwrap, wrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (FormatUsage(..))
import Incentknow.Data.Ids (FormatId(..), SpaceId(..))
import Incentknow.Data.Property (Enumerator)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)

type Input
  = { value :: Maybe FormatUsage
    , disabled :: Boolean
    }

type State
  = { generator :: Maybe FormatUsage
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | Change (Maybe FormatUsage)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot FormatUsage Unit
    )

type Output
  = Maybe FormatUsage

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
  = { id :: FormatUsage
    , name :: String
    , desc :: String
    }

usages :: Array Item
usages =
  [ { id: Internal, name: "Internal", desc: "デフォルトです。スペース内部でのみ使用できるフォーマットです。" }
  , { id: External, name: "External", desc: "スペース外部でのみ使用できるフォーマットです。" }
  ]

toSelectMenuItem :: Item -> SelectMenuItem FormatUsage
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
        , initial: { items: map toSelectMenuItem usages, completed: true }
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
