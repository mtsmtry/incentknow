module Incentknow.Api.Session where

import Prelude

import Control.Promise (Promise)
import Effect (Effect)
import Incentknow.Api (authenticate)

foreign import storeSession :: Promise String -> Promise {}

login :: { email :: String, password :: String } -> Promise {}
login args = storeSession $ authenticate args