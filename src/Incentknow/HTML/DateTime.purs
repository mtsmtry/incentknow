module Incentknow.HTML.DateTime where

import Prelude

import Data.DateTime.Utils (fromTimestampToString)
import Data.DateTime (Year(..), Month(..), Day(..), Hour(..), Minute(..))
import Data.DateTime as DateTime
import Data.DateTime.Instant (instant, toDateTime)
import Data.Enum (class BoundedEnum, fromEnum)
import Data.Interval (DurationComponent(..))
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Data.String (length)
import Data.Time.Duration (Milliseconds(..))
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.HTML.Utils (maybeElem)

dateTime :: forall p i . Number -> HH.HTML p i
dateTime timestamp =  HH.text $ fromTimestampToString timestamp
    