module Incentknow.Molecules.AuthMenu where

import Prelude

import Data.Maybe (Maybe(..), isJust)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (SpaceAuthority(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.SelectMenu as SelectMenu
import Incentknow.Molecules.SelectMenuImpl (SelectMenuItem)

type Input
  = { value :: Maybe SpaceAuthority
    , disabled :: Boolean
    }

type State
  = { auth :: Maybe SpaceAuthority
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | Change (Maybe SpaceAuthority)

type Slot p
  = forall q. H.Slot q Output p

type ChildSlots
  = ( selectMenu :: SelectMenu.Slot SpaceAuthority Unit
    )

type Output
  = Maybe SpaceAuthority

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
  = { id :: SpaceAuthority
    , name :: String
    , desc :: String
    }

authItems :: Array Item
authItems =
  [ { id: SpaceAuthorityNone, name: "None", desc: "なし" }
  , { id: SpaceAuthorityVisible, name: "Visible", desc: "スペースの名前や説明を閲覧できます" }
  , { id: SpaceAuthorityReadable, name: "Readable", desc: "コンテンツやメンバーの一覧を閲覧できます" }
  , { id: SpaceAuthorityWritable, name: "Writable", desc: "コンテンツを投稿できます" }
  ]

toSelectMenuItem :: Item -> SelectMenuItem SpaceAuthority
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
  { auth: input.value
  , disabled: input.disabled
  }

render :: forall m. Behaviour m => MonadAff m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div_
    [ HH.slot (SProxy :: SProxy "selectMenu") unit SelectMenu.component
        { value: state.auth
        , disabled: state.disabled
        , fetchMultiple: \_-> Nothing
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
  Change auth -> do
    H.modify_ _ { auth = auth }
    H.raise auth
