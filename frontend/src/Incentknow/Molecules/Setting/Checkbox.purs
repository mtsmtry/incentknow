module Incentknow.Molecules.Setting.Checkbox where

import Prelude

import Incentknow.Atoms.Inputs (checkbox, disabledCheckbox)
import Incentknow.Molecules.Setting as Setting
import Data.Either (Either)
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Molecules.Setting (SettingOutput, SettingQuery)

type Slot = Setting.Slot

component :: forall t4.
  MonadAff t4 => String
                 -> H.Component HH.HTML SettingQuery
                      { desc :: String
                      , disabled :: Boolean
                      , submit :: Boolean -> Aff (Either String (Record ()))
                      , title :: String
                      , value :: Boolean
                      }
                      SettingOutput
                      t4
component text = Setting.component
  { editor: \change-> \disabled-> \val-> checkbox text val change disabled
  , viewer: \val-> disabledCheckbox text val
  , validate: const true
  }