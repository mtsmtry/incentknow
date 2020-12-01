module Incentknow.Molecules.Setting.Text where

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

type Slot = Setting.Slot

component = Setting.component
  { editor: \change-> \disabled-> \val-> renderTextArea val change disabled
  , viewer: \val-> HH.text val
  , validate: \val-> true
  }
  where
  renderTextArea value change disabled =
    HH.input
      [ css "atom-textarea"
      , HP.value value
      , HP.disabled disabled
      , HE.onValueInput $ Just <<< change
      ]