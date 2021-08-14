module Incentknow.Molecules.Setting.IconMenu where

import Prelude
import Data.Maybe (Maybe(..), isJust)
import Data.Symbol (SProxy(..))
import Halogen.HTML as HH
import Incentknow.Molecules.IconMenu as IconMenu
import Incentknow.Molecules.Setting as Setting
import Data.Either (Either)
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Incentknow.AppM (class Behaviour)
import Incentknow.Molecules.Setting (SettingOutput, SettingQuery)

type Slot
  = Setting.Slot

component :: forall t3.
  MonadAff t3 => Behaviour t3 => H.Component HH.HTML SettingQuery
                                   { desc :: String
                                   , disabled :: Boolean
                                   , submit :: Maybe String -> Aff (Either String (Record ()))
                                   , title :: String
                                   , value :: Maybe String
                                   }
                                   SettingOutput
                                   t3
component =
  Setting.component
    { editor:
        \change -> \disabled -> \val ->
          HH.slot (SProxy :: SProxy "icon") unit IconMenu.component
            { value: val, disabled: false }
            (Just <<< change)
    , viewer:
        \val ->
          HH.slot (SProxy :: SProxy "icon") unit IconMenu.component
            { value: val, disabled: true }
            (const Nothing)
    , validate: isJust
    }
