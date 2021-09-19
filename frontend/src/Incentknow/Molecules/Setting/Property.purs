module Incentknow.Molecules.Setting.Property where

import Prelude

import Data.Either (Either)
import Data.Maybe (Maybe(..), fromMaybe, isJust)
import Data.Symbol (SProxy(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff)
import Halogen as H
import Halogen.HTML as HH
import Incentknow.AppM (class Behaviour)
import Incentknow.Data.Entities (Type)
import Incentknow.Data.Ids (FormatId)
import Incentknow.Molecules.PropertyMenu as PropertyMenu
import Incentknow.Molecules.Setting (SettingOutput, SettingQuery)
import Incentknow.Molecules.Setting as Setting

type Slot = Setting.Slot

component :: forall t4.
  Behaviour t4 => MonadAff t4 => { formatId :: FormatId, type :: Maybe Type }
                -> H.Component HH.HTML SettingQuery
                { desc :: String
                , disabled :: Boolean
                , submit :: Maybe String -> Aff (Either String (Record ()))
                , title :: String
                , value :: Maybe String
                }
                SettingOutput
                t4
component config = Setting.component
  { editor: \change-> \disabled-> \val->
      HH.slot (SProxy :: SProxy "edit") unit PropertyMenu.component
        { formatId: config.formatId
        , type: config.type
        , disabled: disabled
        , value: val
        }
        (Just <<< change)
  , viewer: \val-> HH.text $ fromMaybe "" val
  , validate: isJust
  }