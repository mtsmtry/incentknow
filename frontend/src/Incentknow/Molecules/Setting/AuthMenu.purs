module Incentknow.Molecules.Setting.AuthMenu where

import Prelude

import Data.Either (Either)
import Data.Maybe (Maybe(..), isJust)
import Data.Symbol (SProxy(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (SpaceAuthority)
import Incentknow.Molecules.AuthMenu as AuthMenu
import Incentknow.Molecules.Setting (SettingOutput, SettingQuery)
import Incentknow.Molecules.Setting as Setting

type Slot
  = Setting.Slot

component :: forall t3.
  MonadAff t3 => Behaviour t3 => H.Component HH.HTML SettingQuery
                                   { desc :: String
                                   , disabled :: Boolean
                                   , submit :: Maybe SpaceAuthority -> Aff (Either String (Record ()))
                                   , title :: String
                                   , value :: Maybe SpaceAuthority
                                   }
                                   SettingOutput
                                   t3
component =
  Setting.component
    { editor:
        \change -> \disabled -> \val ->
          HH.slot (SProxy :: SProxy "auth") unit AuthMenu.component
            { value: val, disabled: false }
            (Just <<< change)
    , viewer:
        \val ->
          HH.slot (SProxy :: SProxy "auth") unit AuthMenu.component
            { value: val, disabled: true }
            (const Nothing)
    , validate: isJust
    }
