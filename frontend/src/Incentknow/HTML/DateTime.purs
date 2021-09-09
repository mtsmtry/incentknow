module Incentknow.HTML.DateTime where

import Prelude

import Data.DateTime.Utils (fromTimestampToString, fromTimestampToElapsedTimeString)
import Halogen.HTML as HH

dateTime :: forall p i . Number -> HH.HTML p i
dateTime timestamp = HH.text $ fromTimestampToString timestamp
    
elapsedTime :: forall p i . Number -> HH.HTML p i
elapsedTime timestamp = HH.text $ fromTimestampToElapsedTimeString timestamp