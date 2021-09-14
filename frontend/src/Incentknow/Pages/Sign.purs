module Incentknow.Pages.Sign where

import Prelude

import Data.Either (Either(..), isLeft, isRight)
import Data.Maybe (Maybe(..), isJust)
import Data.String (length)
import Data.String.Regex (match, regex)
import Data.String.Regex.Flags (noFlags)
import Data.Tuple (Tuple(..))
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.API (createUser)
import Incentknow.API.Execution (executeAPI, executeCommand)
import Incentknow.API.Session (loadPage, login, reloadPage)
import Incentknow.AppM (class Behaviour, navigate, navigateRoute, resetMessage)
import Incentknow.Atoms.Inputs (submitButton)
import Incentknow.Atoms.Message (success)
import Incentknow.HTML.Utils (css, link, whenElem)
import Incentknow.Route (Route(..), routeToPath)
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
    , email :: Either String String
    , password :: Either String String
    , username :: Either String String
    , isRegistering :: Boolean
    , isLogining :: Boolean
    , resultMessage :: Maybe String
    , focused :: Maybe String
    }

data Action
  = Register
  | Login
  | ChangeMode Mode
  | ChangeUsername (Either String String)
  | ChangeEmail (Either String String)
  | ChangePassword (Either String String)
  | Navigate MouseEvent Route
  | Focused String

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
  , email: Left ""
  , password: Left ""
  , username: Left ""
  , isRegistering: false
  , isLogining: false
  , resultMessage: Nothing
  , focused: Nothing
  }

textbox ::
  forall a m.
  { value :: Either String String
  , placeholder :: String
  , type_ :: HP.InputType
  , onChange :: Either String String -> a
  , onFocus :: Maybe a
  , isDisabled :: Boolean
  , validate :: String -> Boolean
  } ->
  H.ComponentHTML a () m
textbox input =
  HH.div [ css "textbox" ]
    [ HH.input
        [ HP.placeholder input.placeholder
        , HP.type_ input.type_
        , HP.disabled input.isDisabled
        , HP.value $ toString input.value
        , HE.onValueInput \x-> Just $ input.onChange $ if input.validate x then Right x else Left x
        , HE.onFocus \_-> input.onFocus
        ]
    , HH.div [ css "icon" ] 
        [ HH.img 
            [ HP.src $ if isRight input.value then "/assets/imgs/checkmark_ok.svg" else "/assets/imgs/checkmark_ng.svg" 
            ] 
        ]
    ]
  
toString :: Either String String -> String
toString = case _ of
  Right x -> x
  Left x -> x

validateUsername :: String -> Boolean
validateUsername x = length x >= 4

validatePassword :: String -> Boolean
validatePassword x = length x >= 8

validateEmail :: String -> Boolean
validateEmail x = case reg of
  Right r -> isJust $ match r x 
  _ -> false
  where
  reg = regex "^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$" noFlags

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
                          HH.div [ css "register" ]
                            [ textbox
                                { value: state.username
                                , placeholder: "ユーザー名"
                                , type_: HP.InputText
                                , onChange: ChangeUsername
                                , onFocus: Just $ Focused "username"
                                , isDisabled: state.isRegistering
                                , validate: validateUsername
                                }
                            , whenElem (state.focused == Just "username") \_->
                                HH.div [ css "rule" ] [ HH.text "4文字以上で入力してください" ]
                            , textbox
                                { value: state.email
                                , placeholder: "メールアドレス"
                                , type_: HP.InputEmail
                                , onChange: ChangeEmail
                                , onFocus: Just $ Focused "email"
                                , isDisabled: state.isRegistering
                                , validate: validateEmail
                                }
                            , textbox
                                { value: state.password
                                , placeholder: "パスワード"
                                , type_: HP.InputPassword
                                , onChange: ChangePassword
                                , onFocus: Just $ Focused "password"
                                , isDisabled: state.isRegistering
                                , validate: validatePassword
                                }
                            , whenElem (state.focused == Just "password") \_->
                                HH.div [ css "rule" ] [ HH.text "半角英字、数字、記号を組み合わせて 8文字以上で入力してください" ]
                            , submitButton
                                { isDisabled: state.isRegistering || isLeft state.username || isLeft state.email || isLeft state.password
                                , isLoading: state.isRegistering
                                , loadingText: ""
                                , text: "登録"
                                , onClick: Register
                                }
                            ]
                        LoginMode ->
                          HH.div [ css "login" ]
                            [ textbox
                                { value: state.email
                                , placeholder: "メールアドレス"
                                , type_: HP.InputEmail
                                , onChange: ChangeEmail
                                , onFocus: Just $ Focused "login-email"
                                , isDisabled: state.isLogining
                                , validate: validateEmail
                                }
                            , textbox
                                { value: state.password
                                , placeholder: "パスワード"
                                , type_: HP.InputPassword
                                , onChange: ChangePassword
                                , onFocus: Just $ Focused "login-password"
                                , isDisabled: state.isLogining
                                , validate: validatePassword
                                }
                            , submitButton
                                { isDisabled: state.isLogining || isLeft state.email || isLeft state.password
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
  Focused focused -> H.modify_ _ { focused = Just focused }
  Register -> do
    state <- H.get
    H.modify_ (_ { isRegistering = true })
    let
      user =
        { displayName: toString state.username
        , email: toString state.email
        , password: toString state.password
        }
    result <- executeCommand $ createUser user
    case result of
      Just _ -> do
        H.modify_ (_ { resultMessage = Just $ "登録が完了しました。" <> toString state.email <> "に送信したリンクからメールアドレスを認証してください。" })
        resetMessage
      Nothing -> H.modify_ (_ { isRegistering = false })
  Login -> do
    state <- H.get
    H.modify_ _ { isLogining = true }
    let
      user =
        { email: toString state.email
        , password: toString state.password
        }
    result <- executeAPI $ login user
    case result of
      Just _ -> H.liftEffect $ loadPage $ routeToPath Home
      Nothing -> H.modify_ _ { isLogining = false }
