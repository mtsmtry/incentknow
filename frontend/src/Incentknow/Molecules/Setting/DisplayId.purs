module Incentknow.Molecules.Setting.DisplayId where

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
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.Setting as Setting
import Incentknow.Molecules.DisplayId as DisplayId

type Slot = Setting.Slot

component check = Setting.component
  { editor: \change-> \disabled-> \val->
      HH.slot (SProxy :: SProxy "edit") unit DisplayId.component
        { checkId: check
        , disabled: disabled
        , value: val
        }
        (Just <<< change)
  , viewer: \val-> HH.text $ val.displayId
  , validate: \val-> val.checkState == DisplayId.Available
  }