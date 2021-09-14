module Incentknow.API.Static where

import Prelude

import Data.Maybe (Maybe(..))
import Incentknow.API (apiEndpoint)

getIconUrl :: Maybe String -> String
getIconUrl = case _ of
  Just url -> apiEndpoint <> "/uploaded/" <> url <> ".jpg"
  Nothing -> apiEndpoint <> "/default_icon.jpg"

getFullsizeIconUrl :: Maybe String -> String
getFullsizeIconUrl = case _ of
  Just url -> apiEndpoint <> "/uploaded/" <> url <> ".full.jpg"
  Nothing -> apiEndpoint <> "/default_icon.full.jpg"

getHeaderImageUrl :: Maybe String -> String
getHeaderImageUrl = case _ of
  Just url -> apiEndpoint <> "/uploaded/" <> url <> ".jpg"
  Nothing -> apiEndpoint <> "/default_header.jpg"

getFullsizeHeaderImageUrl :: Maybe String -> String
getFullsizeHeaderImageUrl = case _ of
  Just url -> apiEndpoint <> "/uploaded/" <> url <> ".full.jpg"
  Nothing -> apiEndpoint <> "/default_header.full.jpg"