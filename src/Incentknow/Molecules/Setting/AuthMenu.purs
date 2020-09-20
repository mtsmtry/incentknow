module Incentknow.Molecules.Setting.AuthMenu where

import Prelude
import Data.Either (Either)
import Data.Maybe (Maybe(..), isJust)
import Data.Symbol (SProxy(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.AuthMenu as AuthMenu
import Incentknow.Molecules.Setting as Setting

type Slot
  = Setting.Slot

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
