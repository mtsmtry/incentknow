module Data.DateTime.Utils where

import Prelude

import Data.DateTime (Year(..), Month(..), Day(..), Hour(..), Minute(..))
import Data.DateTime as DateTime
import Data.DateTime.Instant (instant, toDateTime)
import Data.Enum (class BoundedEnum, fromEnum)
import Data.Interval (DurationComponent(..))
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Data.String (length)
import Data.Time.Duration (Milliseconds(..))
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Incentknow.HTML.Utils (maybeElem)

fromTimestampToDateTime utcTimestamp = map toDateTime $ instant $ Milliseconds $ (utcTimestamp + 9.0 * 3600.0) * 1000.0

fromTimestampToString utcTimestamp = maybe "" toString $ fromTimestampToDateTime utcTimestamp

toString :: DateTime.DateTime -> String
toString dt =
    year <> "/" <> month <> "/" <> day <> " " <> hour <> ":" <> minute 
    where
    date = DateTime.date dt
    time = DateTime.time dt
    
    toStr :: forall a. BoundedEnum a => a -> String
    toStr = addZero <<< show <<< fromEnum 
    
    year = toStr $ DateTime.year date
    month = toStr $ DateTime.month date
    day = toStr $ DateTime.day date
    hour = toStr $ DateTime.hour time
    minute = toStr $ DateTime.minute time
    addZero x = if length x == 1 then "0" <> x else x
