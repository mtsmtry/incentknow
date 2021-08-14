module Incentknow.HTML.DateTime where

import Prelude

import Data.DateTime.Utils (fromTimestampToString)
import Halogen.HTML as HH

dateTime :: forall p i . Number -> HH.HTML p i
dateTime timestamp =  HH.text $ fromTimestampToString timestamp
    