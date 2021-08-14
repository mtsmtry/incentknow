module Incentknow.Molecules.MembershipMethodMenu where

import Prelude
import Data.Maybe (Maybe(..), isJust)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (MembershipMethod(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)

type Input
  = { value :: Maybe MembershipMethod
    , disabled :: Boolean
    }

type State
  = { membershipMethod :: Maybe MembershipMethod
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | Change (Maybe MembershipMethod)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot MembershipMethod Unit
    )

type Output
  = Maybe MembershipMethod

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
  = { id :: MembershipMethod
    , name :: String
    , desc :: String
    }

authItems :: Array Item
authItems =
  [ { id: MembershipMethodNone, name: "None", desc: "メンバーの追加は行われません" }
  , { id: MembershipMethodApp, name: "Application and approval", desc: "メンバー加入者による申請とスペース管理者による承認によって、メンバーシップの加入は管理されます" }
  ]

toSelectMenuItem :: Item -> SelectMenuItem MembershipMethod
toSelectMenuItem item =
  { id: item.id
  , name: item.name
  , searchWord: item.name
  , html
  }
  where
  html :: forall a s m. H.ComponentHTML a s m
  html =
    HH.div []
      [ HH.div [ css "name" ] [ HH.text item.name ]
      , HH.div [ css "desc" ] [ HH.text item.desc ]
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
        { value: state.membershipMethod
        , disabled: state.disabled
        , fetchMultiple: \_ -> Nothing
        , fetchSingle: Nothing
        , fetchId: ""
        , initial: { items: map toSelectMenuItem authItems, completed: true }
        , visibleCrossmark: false
        }
        (Just <<< Change)
    ]

handleAction :: forall m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots Output m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> when (isJust input.value) $ H.put $ initialState input
  Change membershipMethod -> do
    H.modify_ _ { membershipMethod = membershipMethod }
    H.raise membershipMethod
