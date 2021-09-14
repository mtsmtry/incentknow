module Incentknow.API.Session where

import Prelude

import Control.Promise (Promise)
import Data.Maybe (Maybe)
import Data.Nullable (Nullable, toMaybe)
import Effect (Effect)
import Incentknow.API (activateAccount, authenticate)
import Incentknow.API.Execution (CommandAPI(..))
import Incentknow.Data.Ids (UserId)

foreign import storeSession :: Promise { session :: String, userId :: UserId } -> Promise {}

foreign import _getMyUserId :: Effect (Nullable UserId)

foreign import logout :: Effect Unit

foreign import reloadPage :: Effect Unit

foreign import loadPage :: String -> Effect Unit

getMyUserId :: Effect (Maybe UserId)
getMyUserId = map toMaybe _getMyUserId

login :: { email :: String, password :: String } -> Promise {}
login args = storeSession $ getPromise $ authenticate args

activate :: String -> Promise {}
activate token = storeSession $ getPromise $ activateAccount token

getPromise :: forall t3. CommandAPI t3 -> Promise t3
getPromise (CommandAPI api) = api