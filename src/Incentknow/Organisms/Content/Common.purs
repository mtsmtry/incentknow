module Incentknow.Organisms.Content.Common where

import Data.Argonaut.Core (Json)
import Data.Maybe (Maybe)
import Incentknow.Api (Format)
import Incentknow.Data.Ids (SpaceId(..))

type EditEnvironment
  = { spaceId :: Maybe SpaceId
    }

type EditorInput
  = { format :: Format
    , value :: Json
    , env :: EditEnvironment
    }