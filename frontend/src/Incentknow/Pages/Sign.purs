module Incentknow.Pages.Sign where

import Prelude

import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.Api (createUser)
import Incentknow.Api.Session (login)
import Incentknow.Api.Utils (executeApi)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute, resetMessage)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Atoms.Message (success)
import Incentknow.HTML.Utils (css, link)
import Incentknow.Route (Route(..))
import Web.UIEvent.MouseEvent (MouseEvent)

data Mode
  = RegisterMode
  | LoginMode

instance eqMode :: Eq Mode where
  eq a b = case Tuple a b of
    Tuple RegisterMode RegisterMode -> true
    Tuple LoginMode LoginMode -> true
    _ -> false

type Input
  = {}

type State
  = { mode :: Mode
    , email :: String
    , password :: String
    , username :: String
    , isRegistering :: Boolean
    , isLogining :: Boolean
    , resultMessage :: Maybe String
    }

data Action
  = Register
  | Login
  | ChangeMode Mode
  | ChangeUsername String
  | ChangeEmail String
  | ChangePassword String
  | Navigate MouseEvent Route

type Slot p
  = forall q. H.Slot q Void p

component :: forall q o m. Behaviour m => MonadAff m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction }
    }

initialState :: Input -> State
initialState input =
  { mode: RegisterMode
  , email: ""
  , password: ""
  , username: ""
  , isRegistering: false
  , isLogining: false
  , resultMessage: Nothing
  }

textbox ::
  forall a m.
  { value :: String
  , placeholder :: String
  , type_ :: HP.InputType
  , onChange :: String -> a
  , isDisabled :: Boolean
  } ->
  H.ComponentHTML a () m
textbox input =
  HH.div [ css "textbox" ]
    [ HH.input
        [ HP.placeholder input.placeholder
        , HP.type_ input.type_
        , HP.disabled input.isDisabled
        , HE.onValueInput $ Just <<< input.onChange
        ]
    , HH.div [ css "icon" ] [ HH.img [ HP.src "/assets/imgs/checkmark_ng.svg" ] ]
    ]

render :: forall m. State -> H.ComponentHTML Action () m
render state =
  HH.div
    [ css "page-sign" ]
    [ HH.div
        [ css "container" ]
        [ link Navigate Home [ css "logo" ] [ HH.text "Incentknow" ]
        , HH.div [ css "message" ] [ HH.text "知識と情報を整理し、世界をクリアにする" ]
        , HH.div [ css "text" ]
            [ HH.span [ css "logo" ] [ HH.text "Incentknow" ]
            , HH.text "へようこそ！"
            , HH.br_
            , HH.text "利用するには、登録もしくはログインが必要です。"
            ]
        , case state.resultMessage of
            Just message -> success message
            Nothing ->
              HH.div [ css "before" ]
                [ HH.div [ css "tab" ]
                    [ HH.div
                        [ css $ "register" <> if state.mode == RegisterMode then " selected" else ""
                        , HE.onClick $ \_ -> Just $ ChangeMode RegisterMode
                        ]
                        [ HH.text "登録" ]
                    , HH.div
                        [ css $ "login" <> if state.mode == LoginMode then " selected" else ""
                        , HE.onClick $ \_ -> Just $ ChangeMode LoginMode
                        ]
                        [ HH.text "ログイン" ]
                    ]
                , HH.div [ css "form" ]
                    [ case state.mode of
                        RegisterMode ->
                          HH.div []
                            [ textbox
                                { value: state.username
                                , placeholder: "ユーザー名"
                                , type_: HP.InputText
                                , onChange: ChangeUsername
                                , isDisabled: state.isRegistering
                                }
                            , textbox
                                { value: state.email
                                , placeholder: "メールアドレス"
                                , type_: HP.InputEmail
                                , onChange: ChangeEmail
                                , isDisabled: state.isRegistering
                                }
                            , textbox
                                { value: state.password
                                , placeholder: "パスワード"
                                , type_: HP.InputPassword
                                , onChange: ChangePassword
                                , isDisabled: state.isRegistering
                                }
                            , submitButton
                                { isDisabled: state.isRegistering
                                , isLoading: state.isRegistering
                                , loadingText: ""
                                , text: "登録"
                                , onClick: Register
                                }
                            ]
                        LoginMode ->
                          HH.div []
                            [ textbox
                                { value: state.email
                                , placeholder: "メールアドレス"
                                , type_: HP.InputEmail
                                , onChange: ChangeEmail
                                , isDisabled: state.isLogining
                                }
                            , textbox
                                { value: state.password
                                , placeholder: "パスワード"
                                , type_: HP.InputPassword
                                , onChange: ChangePassword
                                , isDisabled: state.isLogining
                                }
                            , submitButton
                                { isDisabled: state.isLogining
                                , isLoading: state.isLogining
                                , loadingText: ""
                                , text: "ログイン"
                                , onClick: Login
                                }
                            ]
                    ]
                ]
        ]
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => Action -> H.HalogenM State Action () o m Unit
handleAction = case _ of
  ChangeMode mode -> do
    state <- H.get
    if state.isLogining || state.isRegistering then
      pure unit
    else
      H.modify_ (_ { mode = mode })
  ChangeUsername username -> H.modify_ (_ { username = username })
  ChangeEmail email -> H.modify_ (_ { email = email })
  ChangePassword password -> H.modify_ (_ { password = password })
  Navigate event route -> navigateRoute event route
  Register -> do
    state <- H.get
    H.modify_ (_ { isRegistering = true })
    let
      user =
        { displayName: state.username
        , email: state.email
        , password: state.password
        }
    result <- executeApi $ createUser user
    case result of
      Just _ -> do
        H.modify_ (_ { resultMessage = Just $ "登録が完了しました。" <> state.email <> "に送信したリンクからメールアドレスを認証してください。" })
        resetMessage
      Nothing-> H.modify_ (_ { isRegistering = false })
  Login -> do
    state <- H.get
    H.modify_ _ { isLogining = true }
    let
      user =
        { email: state.email
        , password: state.password
        }
    result <- executeApi $ login user
    case result of
      Just _ -> navigate Home
      Nothing -> H.modify_ _ { isLogining = false }
