module Incentknow.Organisms.Content.Common where

import Data.Argonaut.Core (Json)
import Data.Maybe (Maybe)
import Incentknow.Data.Entities (FocusedContent, FocusedContentDraft, FocusedFormat)
import Incentknow.Data.Ids (SpaceId(..))

type EditEnvironment
  = { spaceId :: Maybe SpaceId
    }

type EditorInput
  = { format :: FocusedFormat
    , value :: Json
    , env :: EditEnvironment
    }