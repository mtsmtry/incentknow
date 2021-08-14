module Incentknow.Molecules.Setting where

import Prelude

import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Incentknow.Atoms.Inputs (button, submitButton)
import Incentknow.HTML.Utils (css, whenElem)

type StaticState val slots m
  = { editor :: (val -> Action val) -> Boolean -> val -> H.ComponentHTML (Action val) slots m
    , viewer :: val -> H.ComponentHTML (Action val) slots m
    , validate :: val -> Boolean
    }

type Input val
  = { value :: val
    , title :: String
    , desc :: String
    , submit :: val -> Aff (Either String {})
    , disabled :: Boolean
    }

type State val
  = { state :: ChangingState
    , typingValue :: val
    , nowValue :: val
    , title :: String
    , desc :: String
    , submit :: val -> Aff (Either String {})
    , disabled :: Boolean
    }

data Action val
  = Initialize
  | HandleInput (Input val)
  | Change val
  | Edit
  | Submit
  | Cancel
  | DoubleClicked

type Slot
  = H.Slot SettingQuery SettingOutput

component :: forall m val slots. Eq val => MonadAff m => StaticState val slots m -> H.Component HH.HTML SettingQuery (Input val) SettingOutput m
component static =
  H.mkComponent
    { initialState
    , render: render static
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , receive = Just <<< HandleInput
            , handleAction = handleAction static
            , handleQuery = handleSettingQuery
            }
    }

initialState :: forall val. Input val -> State val
initialState input =
  { state: None
  , typingValue: input.value
  , nowValue: input.value
  , title: input.title
  , desc: input.desc
  , submit: input.submit
  , disabled: input.disabled
  }

setInput :: forall val. Input val -> State val -> State val
setInput input state =
  { state: state.state
  , typingValue: input.value
  , nowValue: input.value
  , title: input.title
  , desc: input.desc
  , submit: input.submit
  , disabled: input.disabled
  }

render :: forall val slots m. Eq val => MonadAff m => StaticState val slots m -> State val -> H.ComponentHTML (Action val) slots m
render static state =
  HH.div [ css "item", HE.onDoubleClick (\_-> Just DoubleClicked) ]
    [ HH.div [ css "main" ]
        [ HH.div [ css "left" ]
            [ HH.label_ [ HH.text state.title ]
            , HH.div [ css "value" ]
                [ case state.state of
                    None -> static.viewer state.nowValue
                    Changing -> static.editor Change false state.typingValue
                    Sending -> static.editor Change true state.typingValue
                    Failed _ -> static.editor Change false state.typingValue
                    Changed -> static.viewer state.nowValue
                ]
            , HH.div [ css "desc" ]
                [ HH.text state.desc
                ]
            ]
        , whenElem (not state.disabled) \_-> 
            HH.div [ css "right" ] [ renderEditButton state.state Edit ]
        ]
    , renderSubmitButton state.state Submit Cancel (not (static.validate state.typingValue) || state.nowValue == state.typingValue)
    , renderMessage "変更しました" state.state
    ]

handleAction :: forall val slots m. MonadAff m => StaticState val slots m -> Action val -> H.HalogenM (State val) (Action val) slots SettingOutput m Unit
handleAction static = case _ of
  Initialize -> pure unit
  HandleInput input -> H.modify_ $ setInput input
  Change value -> H.modify_ _ { typingValue = value }
  DoubleClicked -> do
    H.modify_ _ { state = Changing }
    H.raise Edited
  Edit -> do
    H.modify_ _ { state = Changing }
    H.raise Edited
  Submit -> do
    H.modify_ _ { state = Sending }
    state <- H.get
    resposne <- H.liftAff $ state.submit state.typingValue
    H.modify_ _ { state = toState resposne }
  Cancel -> H.modify_ _ { state = None }

data ChangingState
  = None
  | Changing
  | Sending
  | Changed
  | Failed String

derive instance eqChangingState :: Eq ChangingState

data SettingOutput
  = Edited

data SettingQuery a
  = Reset a

toState :: forall a. Either String a -> ChangingState
toState response = case response of
  Right _ -> Changed
  Left msg -> Failed msg

renderMessage :: forall a s m. String -> ChangingState -> H.ComponentHTML a s m
renderMessage successMsg state = case state of
  None -> HH.text ""
  Sending -> HH.text ""
  Changing -> HH.text ""
  Changed -> HH.div [ css "message message-success" ] [ HH.span_ [ HH.text successMsg ] ]
  Failed msg -> HH.div [ css "message message-error" ] [ HH.span_ [ HH.text msg ] ]

renderEditButton :: forall a s m. ChangingState -> a -> H.ComponentHTML a s m
renderEditButton state edit = case state of
  None -> button "変更" edit
  Sending -> HH.text ""
  Changing -> HH.text ""
  Failed _ -> HH.text ""
  Changed -> button "変更" edit

renderSubmitButton :: forall a s m. ChangingState -> a -> a -> Boolean -> H.ComponentHTML a s m
renderSubmitButton state submit cancel disabled = case state of
  None -> HH.text ""
  Changing ->
    HH.div [ css "button" ]
      [ submitButton
          { text: "決定"
          , loadingText: "変更中"
          , isDisabled: disabled
          , isLoading: false
          , onClick: submit
          }
      , renderCancelButton cancel
      ]
  Sending ->
    HH.div [ css "button" ]
      [ submitButton
          { text: "決定"
          , loadingText: "変更中"
          , isDisabled: true
          , isLoading: true
          , onClick: submit
          }
      ]
  Failed _ ->
    HH.div [ css "button" ]
      [ submitButton
          { text: "決定"
          , loadingText: "変更中"
          , isDisabled: disabled
          , isLoading: false
          , onClick: submit
          }
      , renderCancelButton cancel
      ]
  Changed -> HH.text ""

renderCancelButton :: forall a s m. a -> H.ComponentHTML a s m
renderCancelButton cancel = HH.span [ css "cancel", HE.onClick $ \_ -> Just cancel ] [ HH.text "キャンセル" ]

handleSettingQuery :: forall m act a s slot. SettingQuery a -> H.HalogenM ({ state :: ChangingState | s }) act slot SettingOutput m (Maybe a)
handleSettingQuery = case _ of
  Reset k -> do
    H.modify_ _ { state = None }
    pure Nothing
