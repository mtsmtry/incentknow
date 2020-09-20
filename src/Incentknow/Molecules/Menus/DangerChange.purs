module Incentknow.Molecules.DangerChange where

import Prelude
import Data.Maybe (Maybe(..))
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Atoms.Inputs (button, dangerButton)
import Incentknow.HTML.Utils (css, whenElem)

type Input
  = { text :: String, title :: String, message :: String }

type State
  = { text :: String, title :: String, message :: String, isFocused :: Boolean }

data Action
  = ClickButton
  | Cancel
  | Execute

type Slot p
  = forall q. H.Slot q Unit p

type ChildSlots
  = ()

component :: forall q o m. MonadEffect m => H.Component HH.HTML q Input Unit m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction }
    }

initialState :: Input -> State
initialState input =
  { text: input.text
  , title: input.title
  , message: input.message
  , isFocused: false
  }

render :: forall m. State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div []
    [ dangerButton state.text ClickButton
    , whenElem state.isFocused
        $ \_ ->
            HH.div [ css "mol-danger-change" ]
              [ HH.div [ css "title" ] [ HH.text state.title ]
              , HH.div [ css "message" ] [ HH.text state.message ]
              , HH.div [ css "button" ]
                  [ button "キャンセル" Cancel
                  , dangerButton "実行" Execute
                  ]
              ]
    ]

handleAction :: forall o m. MonadEffect m => Action -> H.HalogenM State Action ChildSlots Unit m Unit
handleAction = case _ of
  ClickButton -> H.modify_ _ { isFocused = true }
  Cancel -> H.modify_ _ { isFocused = false }
  Execute -> H.raise unit