module Incentknow.Molecules.Setting.Text where

import Prelude

import Data.Maybe (Maybe(..))
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.HTML.Utils (css)
import Incentknow.Molecules.Setting as Setting
import Data.Either (Either)
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Incentknow.Molecules.Setting (SettingOutput, SettingQuery)

type Slot = Setting.Slot

component :: forall t24.
  MonadAff t24 => H.Component HH.HTML SettingQuery
                    { desc :: String
                    , disabled :: Boolean
                    , submit :: String -> Aff (Either String (Record ()))
                    , title :: String
                    , value :: String
                    }
                    SettingOutput
                    t24
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