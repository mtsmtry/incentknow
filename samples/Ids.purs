module Incentknow.Data.Ids where

import Prelude

import Data.Array (range)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (class Newtype, unwrap, wrap)
import Data.String as String
import Data.String.CodeUnits (charAt, fromCharArray)
import Data.Traversable (for)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Random (randomInt)
import Foreign (readString)
import Simple.JSON (class ReadForeign, class WriteForeign, writeImpl)

newtype ContentId = ContentId String
newtype SpaceId = SpaceId String
newtype FormatId = FormatId String
newtype StructureId = StructureId String
newtype DraftId = DraftId String
newtype UserId = UserId String
newtype CrawlerId = CrawlerId String
newtype OperationId = OperationId String
newtype TaskId = TaskId String
newtype CacheId = CacheId String
newtype CommunityId = CommunityId String
newtype SemanticId = SemanticId String


newtype WorkId = WorkId String
newtype SnapshotId = SnapshotId String
newtype ChangeId = ChangeId String

derive instance eqWorkId :: Eq WorkId
derive instance eqSnapshotId :: Eq SnapshotId
derive instance eqChangeId :: Eq ChangeId

type CommitId = ChangeId

derive instance newtypeWorkId :: Newtype WorkId _
derive instance newtypeChangeId :: Newtype ChangeId _

instance readForeignSnapshotId :: ReadForeign SnapshotId where
  readImpl = map wrap <<< readString
instance writeForeignSnapshotId :: WriteForeign SnapshotId where
  writeImpl = writeImpl <<< unwrap
derive instance newtypeSnapshotId :: Newtype SnapshotId _

instance readForeignContentId :: ReadForeign ContentId where
  readImpl = map wrap <<< readString
instance readForeignSpaceId :: ReadForeign SpaceId where
  readImpl = map wrap <<< readString
instance readForeignFormatId :: ReadForeign FormatId where
  readImpl = map wrap <<< readString  
instance readForeignStructureId :: ReadForeign StructureId where
  readImpl = map wrap <<< readString  
instance readForeignDraftId :: ReadForeign DraftId where
  readImpl = map wrap <<< readString  
instance readForeignUserId :: ReadForeign UserId where
  readImpl = map wrap <<< readString  
instance readForeignCrawlerId :: ReadForeign CrawlerId where
  readImpl = map wrap <<< readString  
instance readForeignOperationId :: ReadForeign OperationId where
  readImpl = map wrap <<< readString  
instance readForeignTaskId :: ReadForeign TaskId where
  readImpl = map wrap <<< readString  
instance readForeignCacheId :: ReadForeign CacheId where
  readImpl = map wrap <<< readString  
instance readForeignCommunityId :: ReadForeign CommunityId where
  readImpl = map wrap <<< readString  
instance readForeignSemanticId :: ReadForeign SemanticId where
  readImpl = map wrap <<< readString  

instance writeForeignContentId :: WriteForeign ContentId where
  writeImpl = writeImpl <<< unwrap
instance writeForeignSpaceId :: WriteForeign SpaceId where
  writeImpl = writeImpl <<< unwrap
instance writeForeignFormatId :: WriteForeign FormatId where
  writeImpl = writeImpl <<< unwrap
instance writeForeignStructureId :: WriteForeign StructureId where
  writeImpl = writeImpl <<< unwrap
instance writeForeignDraftId :: WriteForeign DraftId where
  writeImpl = writeImpl <<< unwrap
instance writeForeignUserId :: WriteForeign UserId where
  writeImpl = writeImpl <<< unwrap
instance writeForeignCrawlerId :: WriteForeign CrawlerId where
  writeImpl = writeImpl <<< unwrap
instance writeForeignOperationId :: WriteForeign OperationId where
  writeImpl = writeImpl <<< unwrap
instance writeForeignTaskId :: WriteForeign TaskId where
  writeImpl = writeImpl <<< unwrap
instance writeForeignCacheId :: WriteForeign CacheId where
  writeImpl = writeImpl <<< unwrap
instance writeForeignCommunityId :: WriteForeign CommunityId where
  writeImpl = writeImpl <<< unwrap
instance writeForeignSemanticId :: WriteForeign SemanticId where
  writeImpl = writeImpl <<< unwrap

derive instance eqContentId :: Eq ContentId
derive instance eqSpaceId :: Eq SpaceId
derive instance eqFormatId :: Eq FormatId
derive instance eqStructureId :: Eq StructureId
derive instance edDraftId :: Eq DraftId
derive instance eqUserId :: Eq UserId
derive instance eqCrawlerId :: Eq CrawlerId
derive instance eqOperationId :: Eq OperationId
derive instance eqTaskId :: Eq TaskId
derive instance eqCacheId :: Eq CacheId
derive instance eqCommunityId :: Eq CommunityId
derive instance eqSemanticId :: Eq SemanticId

derive instance ordFormatId :: Ord FormatId
derive instance ordStructureId :: Ord StructureId
derive instance ordUserId :: Ord UserId
derive instance ordContentId :: Ord ContentId

derive instance newtypeContentId :: Newtype ContentId _
derive instance newtypeSpaceId :: Newtype SpaceId _
derive instance newtypeFormatId :: Newtype FormatId _
derive instance newtypeStructureId :: Newtype StructureId _
derive instance newtypeDraftId :: Newtype DraftId _
derive instance newtypeUserId :: Newtype UserId _
derive instance newtypeCrawlerId :: Newtype CrawlerId _
derive instance newtypeOperationId :: Newtype OperationId _
derive instance newtypeTaskId :: Newtype TaskId _
derive instance newtypeCacheId :: Newtype CacheId _
derive instance newtypeCommunityId :: Newtype CommunityId _
derive instance newtypeSemanticId :: Newtype SemanticId _

generateId :: forall m. MonadEffect m => Int -> m String
generateId len = do
  let
    str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  seeds <- for (range 1 len) $ \_ -> liftEffect $ randomInt 0 (String.length str - 1)
  pure $ fromCharArray $ map (fromMaybe 'a' <<< flip charAt str) seeds