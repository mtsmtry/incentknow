
module Incentknow.Data.EntityUtils where

import Prelude

import Data.Maybe (Maybe(..))
import Data.Argonaut.Core (Json)
import Incentknow.Data.Entities as E
import Incentknow.Data.Ids as E


foreign import buildType :: E.TypeName -> TypeOptions -> Maybe E.Type
foreign import getTypeName :: E.Type -> E.TypeName
foreign import getTypeOptions :: E.Type -> TypeOptions

type TypeOptions
  = { format :: Maybe E.FormatId
    , subType :: Maybe E.Type
    , language :: Maybe E.Language
    , properties :: Maybe (Array E.PropertyInfo)
    , enumerators :: Maybe (Array E.Enumerator)
    }

defaultTypeOptions :: TypeOptions
defaultTypeOptions =
  { format: Nothing
  , subType: Nothing
  , language: Nothing
  , properties: Nothing
  , enumerators: Nothing
  }

