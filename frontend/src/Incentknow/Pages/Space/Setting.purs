module Incentknow.Pages.Space.Setting where

import Prelude

import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (unwrap, wrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getAvailableSpaceDisplayId, setSpaceDefaultAuthority, setSpaceDescription, setSpaceDisplayId, setSpaceDisplayName, setSpaceMembershipMethod, setSpacePublished, uploadSpaceHeaderImage)
import Incentknow.API.Execution (callCommand, callQuery)
import Incentknow.API.Static (getHeaderImageUrl)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (FocusedSpace, MembershipMethod(..), SpaceAuthority(..))
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.DisplayId as DisplayId
import Incentknow.Molecules.Setting (SettingOutput)
import Incentknow.Molecules.Setting.AuthMenu as SettingAuthMenu
import Incentknow.Molecules.Setting.Checkbox as SettingCheckbox
import Incentknow.Molecules.Setting.DisplayId as SettingDisplayId
import Incentknow.Molecules.Setting.Image as SettingImage
import Incentknow.Molecules.Setting.MembershipMethodMenu as MembershipMethodMenu
import Incentknow.Molecules.Setting.Text as SettingText
import Incentknow.Templates.Page (section)

type Input
  = { space :: FocusedSpace
    , disabled :: Boolean
    }

type State
  = { space :: FocusedSpace
    , disabled :: Boolean
    }

data Action
  = Initialize
  | HandleInput Input
  | Edit SettingOutput

type Slot p
  = forall q. H.Slot q Void p

type ChildSlots
  = ( displayName :: SettingText.Slot Unit
    , displayId :: SettingDisplayId.Slot Unit
    , homeImage :: SettingImage.Slot Unit
    , authMenu :: SettingAuthMenu.Slot Unit
    , published :: SettingCheckbox.Slot Unit
    , membershipMethodMenu :: MembershipMethodMenu.Slot Unit
    )

component :: forall q o m. Behaviour m => MonadAff m => MonadEffect m => H.Component HH.HTML q Input o m
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
            }
    }

initialState :: Input -> State
initialState input =
  { space: input.space
  , disabled: input.disabled
  }

displayName_ = SProxy :: SProxy "displayName"

homeImage_ = SProxy :: SProxy "homeImage"

published_ = SProxy :: SProxy "published"

displayId_ = SProxy :: SProxy "displayId"

authMenu_ = SProxy :: SProxy "authMenu"

membershipMethodMenu_ = SProxy :: SProxy "membershipMethodMenu"

render :: forall m. MonadAff m => Behaviour m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  section "page-user-setting"
    [ HH.slot displayName_ unit SettingText.component
        { submit: callCommand <<< setSpaceDisplayName state.space.spaceId
        , value: state.space.displayName
        , title: "表示名"
        , desc: ""
        , disabled: state.disabled
        }
        (Just <<< Edit)
    , HH.slot displayName_ unit SettingText.component
        { submit: callCommand <<< setSpaceDescription state.space.spaceId
        , value: state.space.description
        , title: "説明"
        , desc: ""
        , disabled: state.disabled
        }
        (Just <<< Edit)
    , HH.slot homeImage_ unit SettingImage.component
        { submit: callCommand <<< \blob-> uploadSpaceHeaderImage { spaceId: state.space.spaceId, blob }
        , value: Just $ getHeaderImageUrl state.space.headerImage
        , disabled: state.disabled
        }
        (Just <<< Edit)
    , HH.slot published_ unit (SettingCheckbox.component "公開する")
        { submit: callCommand <<< setSpacePublished state.space.spaceId
        , value: state.space.published
        , title: "一般公開"
        , desc: "この設定をオンにすると、スペースの検索結果やスペースの一覧にこのスペースの名前や説明が表示されます"
        , disabled: state.disabled
        }
        (Just <<< Edit)
    , HH.slot authMenu_ unit SettingAuthMenu.component
        { submit: callCommand <<< \x -> setSpaceDefaultAuthority state.space.spaceId $ fromMaybe SpaceAuthorityNone x
        , value: Just state.space.defaultAuthority
        , title: "標準権限"
        , desc: "スペースのメンバー以外の人を含む全ての人に適用される権限を設定します"
        , disabled: state.disabled
        }
        (Just <<< Edit)
    , HH.slot membershipMethodMenu_ unit MembershipMethodMenu.component
        { submit: callCommand <<< \x -> setSpaceMembershipMethod state.space.spaceId $ fromMaybe MembershipMethodNone x
        , value: Just state.space.membershipMethod
        , title: "メンバー加入方法"
        , desc: "メンバーがどのような方法でスペースに加入するかを設定します"
        , disabled: state.disabled
        }
        (Just <<< Edit)
    , HH.slot displayId_ unit (SettingDisplayId.component $ callQuery <<< getAvailableSpaceDisplayId <<< wrap)
        { submit: callCommand <<< \x -> setSpaceDisplayId state.space.spaceId $ wrap x.displayId
        , value: { displayId: unwrap state.space.displayId, checkState: DisplayId.Available }
        , title: "表示ID"
        , desc: "IDを設定します"
        , disabled: state.disabled
        }
        (Just <<< Edit)
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put $ initialState input
  Edit _ -> do
    -- discard $ H.query displayName_ unit $ H.tell Reset
    pure unit
