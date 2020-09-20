module Incentknow.Molecules.Setting.Password where

import Prelude
import Data.Either (Either)
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.Setting (ChangingState(..), SettingQuery(..), SettingOutput(..), handleSettingQuery, renderEditButton, renderMessage, renderSubmitButton, toState)

type Input
  = { submit :: { oldPassword :: String, newPassword :: String } -> Aff (Either String {})
    }

type State
  = { submit :: { oldPassword :: String, newPassword :: String } -> Aff (Either String {})
    , state :: ChangingState
    , typingOldPassword :: String
    , typingNewPassword :: String
    }

data Action
  = Initialize
  | HandleInput Input
  | ChangeOldPassword String
  | ChangeNewPassword String
  | Edit
  | Submit
  | Cancel

type Slot
  = H.Slot SettingQuery SettingOutput

type ChildSlots
  = ()

component :: forall o m. MonadAff m => MonadEffect m => H.Component HH.HTML SettingQuery Input SettingOutput m
component =
  H.mkComponent
    { initialState
    , render
    , eval:
        H.mkEval
          H.defaultEval
            { initialize = Just Initialize
            , receive = Just <<< HandleInput
            , handleAction = handleAction
            , handleQuery = handleSettingQuery
            }
    }

initialState :: Input -> State
initialState input =
  { submit: input.submit
  , state: None
  , typingOldPassword: ""
  , typingNewPassword: ""
  }

setInput :: Input -> State -> State
setInput input state =
  { submit: input.submit
  , state: state.state
  , typingOldPassword: ""
  , typingNewPassword: ""
  }

render :: forall m. State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "item" ]
    [ HH.div [ css "main" ]
        [ HH.div [ css "left" ]
            [ HH.label_ [ HH.text "パスワード" ]
            , HH.div [ css "value" ]
                [ case state.state of
                    None -> HH.text "************"
                    Changing ->
                      renderPasswordForm
                        state.typingOldPassword
                        state.typingNewPassword
                        ChangeOldPassword
                        ChangeNewPassword
                        false
                    Sending ->
                      renderPasswordForm
                        state.typingOldPassword
                        state.typingNewPassword
                        ChangeOldPassword
                        ChangeNewPassword
                        true
                    Failed _ ->
                      renderPasswordForm
                        state.typingOldPassword
                        state.typingNewPassword
                        ChangeOldPassword
                        ChangeNewPassword
                        false
                    Changed -> HH.text "************"
                ]
            ]
        , HH.div [ css "right" ] [ renderEditButton state.state Edit ]
        ]
    , renderSubmitButton state.state Submit Cancel false
    , renderMessage "パスワードを変更しました" state.state
    ]
  where
  renderPasswordForm :: String -> String -> (String -> Action) -> (String -> Action) -> Boolean -> H.ComponentHTML Action ChildSlots m
  renderPasswordForm old new changeOld changeNew disabled =
    HH.div []
      [ HH.span [ css "subtext" ] [ HH.text "現在のパスワード" ]
      , HH.input
          [ css "atom-textarea"
          , HP.value old
          , HP.type_ HP.InputPassword
          , HP.disabled disabled
          , HE.onValueInput $ Just <<< changeOld
          ]
      , HH.span [ css "subtext" ] [ HH.text "新しいパスワード" ]
      , HH.input
          [ css "atom-textarea"
          , HP.value new
          , HP.type_ HP.InputPassword
          , HP.disabled disabled
          , HE.onValueInput $ Just <<< changeNew
          ]
      ]

handleAction :: forall o m. MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots SettingOutput m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.modify_ $ setInput input
  ChangeOldPassword oldPassword -> H.modify_ _ { typingOldPassword = oldPassword }
  ChangeNewPassword newPassword -> H.modify_ _ { typingNewPassword = newPassword }
  Edit -> do
    H.modify_ _ { state = Changing }
    H.raise Edited
  Submit -> do
    H.modify_ _ { state = Sending }
    state <- H.get
    resposne <- H.liftAff $ state.submit { oldPassword: state.typingOldPassword, newPassword: state.typingNewPassword } -- writeError $ client.account.changePassword { body: { oldPassword: state.typingOldPassword, newPassword: state.typingNewPassword } }
    H.modify_ _ { state = toState resposne }
  Cancel -> H.modify_ _ { state = None }
