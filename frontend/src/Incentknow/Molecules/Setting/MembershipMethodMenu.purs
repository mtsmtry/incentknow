module Incentknow.Molecules.Setting.MembershipMethodMenu where

import Prelude

import Data.Either (Either)
import Data.Maybe (Maybe(..), isJust)
import Data.Symbol (SProxy(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (MembershipMethod)
import Incentknow.Molecules.MembershipMethodMenu as MembershipMethodMenu
import Incentknow.Molecules.Setting (SettingOutput, SettingQuery)
import Incentknow.Molecules.Setting as Setting

type Slot
  = Setting.Slot

component :: forall t3.
  MonadAff t3 => Behaviour t3 => H.Component HH.HTML SettingQuery
                                   { desc :: String
                                   , disabled :: Boolean
                                   , submit :: Maybe MembershipMethod -> Aff (Either String (Record ()))
                                   , title :: String
                                   , value :: Maybe MembershipMethod
                                   }
                                   SettingOutput
                                   t3
component =
  Setting.component
    { editor:
        \change -> \disabled -> \val ->
          HH.slot (SProxy :: SProxy "menu") unit MembershipMethodMenu.component
            { value: val, disabled: false }
            (Just <<< change)
    , viewer:
        \val ->
          HH.slot (SProxy :: SProxy "menu") unit MembershipMethodMenu.component
            { value: val, disabled: true }
            (const Nothing)
    , validate: isJust
    }
