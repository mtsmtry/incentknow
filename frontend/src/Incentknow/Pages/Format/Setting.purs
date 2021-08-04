module Incentknow.Pages.Format.Setting where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (FocusedFormat)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.Setting (SettingOutput)
import Incentknow.Molecules.Setting.GeneratorMenu as GeneratorMenu

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
  = ( generatorMenu :: GeneratorMenu.Slot Unit
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

generatorMenu_ = SProxy :: SProxy "generatorMenu"

render :: forall m. MonadAff m => Behaviour m => MonadEffect m => State -> H.ComponentHTML Action ChildSlots m
render state =
  HH.div [ css "page-user-setting" ]
    [ --whenElem (state.format.usage == "internal") \_ ->
     --   HH.slot generatorMenu_ unit GeneratorMenu.component
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
