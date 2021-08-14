module Incentknow.Pages.Format.Setting where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap, wrap)
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.API (getAvailableFormatDisplayId, setFormatDisplayId, setFormatDisplayName, setFormatIcon)
import Incentknow.API.Execution (callCommand, callQuery)
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (FocusedFormat)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.DisplayId as DisplayId
import Incentknow.Molecules.Setting (SettingOutput)
import Incentknow.Molecules.Setting.DisplayId as SettingDisplayId
import Incentknow.Molecules.Setting.GeneratorMenu as GeneratorMenu
import Incentknow.Molecules.Setting.IconMenu as SettingIconMenu
import Incentknow.Molecules.Setting.Text as SettingText

type Input
  = { format :: FocusedFormat
    , disabled :: Boolean
    }

type State
  = { format :: FocusedFormat
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
    , icon :: SettingIconMenu.Slot Unit
    , generatorMenu :: GeneratorMenu.Slot Unit
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
  { format: input.format
  , disabled: input.disabled
  }

render :: forall m. MonadAff m => Behaviour m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-user-setting" ]
    [ HH.slot (SProxy :: SProxy "displayName") unit SettingText.component
        { submit: callCommand <<< setFormatDisplayName state.format.formatId
        , value: state.format.displayName
        , title: "表示名"
        , desc: ""
        , disabled: state.disabled
        }
        (Just <<< Edit)
    , HH.slot (SProxy :: SProxy "displayId") unit (SettingDisplayId.component $ callQuery <<< getAvailableFormatDisplayId <<< wrap)
        { submit: callCommand <<< \x -> setFormatDisplayId state.format.formatId $ wrap x.displayId
        , value: { displayId: unwrap state.format.displayId, checkState: DisplayId.Available }
        , title: "表示ID"
        , desc: "IDを設定します"
        , disabled: state.disabled
        }
        (Just <<< Edit)
    , HH.slot (SProxy :: SProxy "icon") unit SettingIconMenu.component
        { submit: callCommand <<< \x -> setFormatIcon state.format.formatId x
        , value: state.format.icon
        , title: "アイコン"
        , desc: ""
        , disabled: state.disabled
        }
        (Just <<< Edit)
      --whenElem (state.format.usage == "internal") \_ ->
     --   HH.slot (SProxy :: SProxy "generatorMenu") unit GeneratorMenu.component
     --     { submit: callAPI <<< \x -> setContentGenerator state.format.formatId (fromMaybe "" x)
     --     , value: Just state.format.generator
      --    , title: "ジェネレータの設定"
      --    , desc: "コンテンツを自動的に生成する設定をします"
      --    , disabled: state.disabled
      --    }
      --    (Just <<< Edit)
    ]

handleAction :: forall o m. Behaviour m => MonadAff m => MonadEffect m => Action -> H.HalogenM State Action ChildSlots o m Unit
handleAction = case _ of
  Initialize -> pure unit
  HandleInput input -> H.put $ initialState input
  Edit _ -> do
    -- discard $ H.query displayName_ unit $ H.tell Reset
    pure unit
