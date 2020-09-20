module Incentknow.Molecules.MembershipMethodMenu where

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
import Incentknow.Data.Ids (FormatId(..), SpaceId(..))
import Incentknow.Data.Property (Enumerator, PropertyInfo, Type(..), getTypeName)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.FormatMenu as FormatMenu
import Incentknow.Molecules.SelectMenu (SelectMenuItem, SelectMenuResource(..))
import Incentknow.Molecules.SelectMenu as SelectMenu

type Input
  = { value :: Maybe String
    , disabled :: Boolean
    }

type State
  = { membershipMethod :: Maybe String
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | Change (Maybe String)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot Unit
    )

type Output
  = Maybe String

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
  = { id :: String
    , name :: String
    , desc :: String
    }

authItems :: Array Item
authItems =
  [ { id: "none", name: "None", desc: "メンバーの追加は行われません" }
  , { id: "app", name: "Application and approval", desc: "メンバー加入者による申請とスペース管理者による承認によって、メンバーシップの加入は管理されます" }
  ]

toSelectMenuItem :: Item -> SelectMenuItem
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
  { membershipMethod: input.value
  , disabled: input.disabled
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div_
    [ HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
        { resource: SelectMenuResourceAllCandidates $ map toSelectMenuItem authItems, value: state.membershipMethod, disabled: state.disabled }
        (Just <<< Change)
    ]

handleAction :: forall m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> when (isJust input.value) $ H.put $ initialState input
  Change membershipMethod -> do
    H.modify_ _ { membershipMethod = membershipMethod }
    H.raise membershipMethod
