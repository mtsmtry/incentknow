module Incentknow.API.Session where

import Prelude

import Control.Promise (Promise)
import Effect (Effect)
import Incentknow.API (authenticate)
import Incentknow.API.Execution (CommandAPI(..))

foreign import storeSession :: Promise String -> Promise {}

login :: { email :: String, password :: String } -> Promise {}
login args = storeSession $ getPromise $ authenticate args

getPromise (CommandAPI api) = api