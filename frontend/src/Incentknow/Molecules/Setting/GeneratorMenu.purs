module Incentknow.Molecules.Setting.GeneratorMenu where

import Prelude

import Data.Either (Either)
import Data.Maybe (Maybe(..), isJust)
import Data.Symbol (SProxy(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (ContentGenerator)
import Incentknow.Molecules.GeneratorMenu as GeneratorMenu
import Incentknow.Molecules.Setting (SettingOutput, SettingQuery)
import Incentknow.Molecules.Setting as Setting

type Slot
  = Setting.Slot

component :: forall t3.
  MonadAff t3 => Behaviour t3 => H.Component HH.HTML SettingQuery
                                   { desc :: String
                                   , disabled :: Boolean
                                   , submit :: Maybe ContentGenerator -> Aff (Either String (Record ()))
                                   , title :: String
                                   , value :: Maybe ContentGenerator
                                   }
                                   SettingOutput
                                   t3
component =
  Setting.component
    { editor:
        \change -> \disabled -> \val ->
          HH.slot (SProxy :: SProxy "menu") unit GeneratorMenu.component
            { value: val, disabled: false }
            (Just <<< change)
    , viewer:
        \val ->
          HH.slot (SProxy :: SProxy "menu") unit GeneratorMenu.component
            { value: val, disabled: true }
            (const Nothing)
    , validate: isJust
    }
