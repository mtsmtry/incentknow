
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
  = { format :: Maybe E.FocusedFormat
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



foreign import buildBlockData :: E.BlockType -> BlockDataOptions -> Maybe E.BlockData
foreign import getBlockType :: E.BlockData -> E.BlockType
foreign import getBlockDataOptions :: E.BlockData -> BlockDataOptions



type BlockDataOptions
  = { level :: Maybe Int
    , text :: Maybe String
    }

defaultBlockDataOptions :: BlockDataOptions
defaultBlockDataOptions =
  { level: Nothing
  , text: Nothing
  }



foreign import buildMaterialData :: E.MaterialType -> MaterialDataOptions -> Maybe E.MaterialData
foreign import getMaterialType :: E.MaterialData -> E.MaterialType
foreign import getMaterialDataOptions :: E.MaterialData -> MaterialDataOptions



type MaterialDataOptions
  = { document :: Maybe E.Document
    , text :: Maybe String
    }

defaultMaterialDataOptions :: MaterialDataOptions
defaultMaterialDataOptions =
  { document: Nothing
  , text: Nothing
  }



foreign import buildMaterialComposition :: E.MaterialCompositionType -> MaterialCompositionOptions -> Maybe E.MaterialComposition
foreign import getMaterialCompositionType :: E.MaterialComposition -> E.MaterialCompositionType
foreign import getMaterialCompositionOptions :: E.MaterialComposition -> MaterialCompositionOptions



type MaterialCompositionOptions
  = { propertyId :: Maybe String
    , materialId :: Maybe E.MaterialId
    , data :: Maybe String
    }

defaultMaterialCompositionOptions :: MaterialCompositionOptions
defaultMaterialCompositionOptions =
  { propertyId: Nothing
  , materialId: Nothing
  , data: Nothing
  }



