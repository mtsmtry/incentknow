module Data.DateTime.Utils where

import Prelude

import Data.DateTime (DateTime)
import Data.DateTime as DateTime
import Data.DateTime.Instant (instant, toDateTime)
import Data.Enum (class BoundedEnum, fromEnum)
import Data.Maybe (Maybe, fromMaybe, maybe)
import Data.String (length)
import Data.Time.Duration (Milliseconds(..))

foreign import getDateTimeNow :: Number

fromTimestampToDateTime :: Number -> Maybe DateTime
fromTimestampToDateTime utcTimestamp = map toDateTime $ instant $ Milliseconds $ (utcTimestamp + 9.0 * 3600.0) * 1000.0

fromTimestampToString :: Number -> String
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

fromTimestampToElapsedTimeString :: Number -> String
fromTimestampToElapsedTimeString dt =
  if year > 0 then
    show year <> "年前"
  else if month > 0 then
    show month <> "ヶ月前"
  else if day > 0 then
    show day <> "日前"
  else if hour > 0 then
    show hour <> "時間前"
  else if minute > 0 then
    show minute <> "分前"
  else
    "さっき"
  where
  elapsed = map toDateTime $ instant $ Milliseconds $ (getDateTimeNow - dt - 9.0 * 3600.0) * 1000.0

  date = map DateTime.date elapsed
  time = map DateTime.time elapsed
  
  year = (fromMaybe 0 $ map (fromEnum <<< DateTime.year) date) - 1970
  month = (fromMaybe 0 $ map (fromEnum <<< DateTime.month) date) - 1
  day = (fromMaybe 0 $ map (fromEnum <<< DateTime.day) date) - 1
  hour = fromMaybe 0 $ map (fromEnum <<< DateTime.hour) time
  minute = fromMaybe 0 $ map (fromEnum <<< DateTime.minute) time