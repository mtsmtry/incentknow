
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



foreign import buildActivityAction :: E.ActivityType -> ActivityActionOptions -> Maybe E.ActivityAction
foreign import getActivityType :: E.ActivityAction -> E.ActivityType
foreign import getActivityActionOptions :: E.ActivityAction -> ActivityActionOptions



type ActivityActionOptions
  = { content :: Maybe E.RelatedContent
    , comment :: Maybe E.RelatedComment
    }

defaultActivityActionOptions :: ActivityActionOptions
defaultActivityActionOptions =
  { content: Nothing
  , comment: Nothing
  }



foreign import buildNotificationAction :: E.NotificationType -> NotificationActionOptions -> Maybe E.NotificationAction
foreign import getNotificationType :: E.NotificationAction -> E.NotificationType
foreign import getNotificationActionOptions :: E.NotificationAction -> NotificationActionOptions



type NotificationActionOptions
  = { content :: Maybe E.RelatedContent
    , comment :: Maybe E.RelatedComment
    }

defaultNotificationActionOptions :: NotificationActionOptions
defaultNotificationActionOptions =
  { content: Nothing
  , comment: Nothing
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



