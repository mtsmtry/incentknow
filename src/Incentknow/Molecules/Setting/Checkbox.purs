module Incentknow.Molecules.Setting.Checkbox where

import Prelude

import Data.Either (Either)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Effect.Class (class MonadEffect)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.Atoms.Inputs (checkbox, disabledCheckbox)
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.Setting as Setting

type Slot = Setting.Slot

component text = Setting.component
  { editor: \change-> \disabled-> \val-> checkbox text val change disabled
  , viewer: \val-> disabledCheckbox text val
  , validate: const true
  }