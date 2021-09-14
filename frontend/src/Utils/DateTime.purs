module Data.DateTime.Utils where

import Prelude

import Data.DateTime (DateTime)
import Data.DateTime as DateTime
import Data.DateTime.Instant (instant, toDateTime)
import Data.Enum (class BoundedEnum, fromEnum)
import Data.Int (floor)
import Data.Maybe (Maybe, fromMaybe, maybe)
import Data.String (length)
import Data.Time.Duration (Milliseconds(..))

foreign import getDateTimeNow :: Number

fromTimestampToDateTime :: Number -> Maybe DateTime
fromTimestampToDateTime utcTimestamp = map toDateTime $ instant $ Milliseconds $ (utcTimestamp + 9.0 * 3600.0) * 1000.0


fromTimestampToString :: Number -> String
fromTimestampToString utcTimestamp = maybe "" toString $ fromTimestampToDateTime utcTimestamp


fromTimestampToElapsedTimeString :: Number -> String
fromTimestampToElapsedTimeString utcTimestamp = 
  if seconds > year then
    (show $ floor $ seconds / year) <> "年前"
  else if seconds > month then
    (show $ floor $ seconds / month) <> "ヶ月前"
  else if seconds > day then
    (show $ floor $ seconds / day) <> "日前"
  else if seconds > hour then
    (show $ floor $ seconds / hour) <> "時間前"
  else if seconds > minute then
    (show $ floor $ seconds / minute) <> "分前"
  else "さっき"
  where
  year = 365.0 * 3600.0 * 24.0
  month = 30.0 * 3600.0 * 24.0
  day = 3600.0 * 24.0
  hour = 3600.0
  minute = 60.0
  seconds = getDateTimeNow - utcTimestamp

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
