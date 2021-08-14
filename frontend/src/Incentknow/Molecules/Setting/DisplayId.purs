module Incentknow.Molecules.Setting.DisplayId where

import Prelude

import Data.Either (Either)
import Data.Maybe (Maybe(..))
import Data.Symbol (SProxy(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.Molecules.DisplayId (CheckState)
import Incentknow.Molecules.DisplayId as DisplayId
import Incentknow.Molecules.Setting (SettingOutput, SettingQuery)
import Incentknow.Molecules.Setting as Setting

type Slot = Setting.Slot

component :: forall t4.
  MonadAff t4 => (String -> Aff (Either String Boolean))
                 -> H.Component HH.HTML SettingQuery
                      { desc :: String
                      , disabled :: Boolean
                      , submit :: { checkState :: CheckState
                                  , displayId :: String
                                  }
                                  -> Aff (Either String (Record ()))
                      , title :: String
                      , value :: { checkState :: CheckState
                                 , displayId :: String
                                 }
                      }
                      SettingOutput
                      t4
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