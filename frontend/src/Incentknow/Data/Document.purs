module Incentknow.Data.Document where

import Data.Argonaut.Core (Json)

type Document
  = Array Section

type Section
  = { type :: String
    , id :: String
    , data :: Json
    }
