module Incentknow.Pages.User.Setting where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getMyAccount, setMyDisplayName, setMyEmail, uploadMyIcon, setMyPassword)
import Incentknow.API.Execution (Fetch, Remote(..), callCommand, callbackQuery, forRemote)
import Incentknow.API.Static (getFullsizeIconUrl, getIconUrl)
import Incentknow.AppM (class Behaviour)
import Incentknow.Atoms.Icon (remoteWith)
import Incentknow.Data.Entities (IntactAccount)
import Incentknow.Molecules.Setting (SettingOutput)
import Incentknow.Molecules.Setting.DisplayId as SettingDisplayId
import Incentknow.Molecules.Setting.Image as SettingImage
import Incentknow.Molecules.Setting.Password as SettingPassword
import Incentknow.Molecules.Setting.Text as SettingText
import Incentknow.Templates.Page (section)

type Input
  = {}

type State
  = { account :: Remote IntactAccount
    }

data Action
  = Initialize
  | ChangeAccount (Fetch IntactAccount)
  | Edit SettingOutput

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( displayName :: SettingText.Slot Unit
    , displayId :: SettingDisplayId.Slot Unit
    , email :: SettingText.Slot Unit
    , icon :: SettingImage.Slot Unit
    , password :: SettingPassword.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
component =
  H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { initialize = Just Initialize, handleAction = handleAction }
    }

initialState :: Input -> State
initialState input =
  { account: Loading
  }

displayName_ = SProxy :: SProxy "displayName"

icon_ = SProxy :: SProxy "icon"

password_ = SProxy :: SProxy "password"

email_ = SProxy :: SProxy "email"

render :: forall m. MonadAff m => Behaviour m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  remoteWith state.account \account ->
    section "page-user-setting"
      [ HH.slot displayName_ unit SettingText.component
          { submit: callCommand <<< setMyDisplayName
          , value: account.displayName
          , title: "表示名"
          , desc: ""
          , disabled: false
          }
          (Just <<< Edit)
      , HH.slot icon_ unit SettingImage.component
          { submit: \blob-> callCommand $ uploadMyIcon { blob }
          , value: Just $ getFullsizeIconUrl account.iconImage
          , disabled: false
          }
          (Just <<< Edit)
      , HH.slot password_ unit SettingPassword.component
          { submit: callCommand <<< setMyPassword }
          (Just <<< Edit)
      , HH.slot email_ unit SettingText.component
          { submit: callCommand <<< setMyEmail
          , value: account.email
          , title: "メールアドレス"
          , desc: ""
          , disabled: false
          }
          (Just <<< Edit)
      ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> do
    callbackQuery ChangeAccount $ getMyAccount unit
  ChangeAccount fetch -> do
    forRemote fetch \account ->
      H.modify_ _ { account = account }
  Edit _ -> do
    -- discard $ H.query displayName_ unit $ H.tell Reset
    pure unit
