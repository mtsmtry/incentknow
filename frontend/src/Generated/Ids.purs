
module Incentknow.Data.Ids where

import Prelude

import Data.Newtype (class Newtype)


newtype ContainerId = ContainerId String
derive instance eqContainerId :: Eq ContainerId
derive instance ordContainerId :: Ord ContainerId
derive instance newtypeContainerId :: Newtype ContainerId _

newtype SpaceId = SpaceId String
derive instance eqSpaceId :: Eq SpaceId
derive instance ordSpaceId :: Ord SpaceId
derive instance newtypeSpaceId :: Newtype SpaceId _

newtype SpaceDisplayId = SpaceDisplayId String
derive instance eqSpaceDisplayId :: Eq SpaceDisplayId
derive instance ordSpaceDisplayId :: Ord SpaceDisplayId
derive instance newtypeSpaceDisplayId :: Newtype SpaceDisplayId _

newtype UserId = UserId String
derive instance eqUserId :: Eq UserId
derive instance ordUserId :: Ord UserId
derive instance newtypeUserId :: Newtype UserId _

newtype UserDisplayId = UserDisplayId String
derive instance eqUserDisplayId :: Eq UserDisplayId
derive instance ordUserDisplayId :: Ord UserDisplayId
derive instance newtypeUserDisplayId :: Newtype UserDisplayId _

newtype StructureId = StructureId String
derive instance eqStructureId :: Eq StructureId
derive instance ordStructureId :: Ord StructureId
derive instance newtypeStructureId :: Newtype StructureId _

newtype FormatId = FormatId String
derive instance eqFormatId :: Eq FormatId
derive instance ordFormatId :: Ord FormatId
derive instance newtypeFormatId :: Newtype FormatId _

newtype FormatDisplayId = FormatDisplayId String
derive instance eqFormatDisplayId :: Eq FormatDisplayId
derive instance ordFormatDisplayId :: Ord FormatDisplayId
derive instance newtypeFormatDisplayId :: Newtype FormatDisplayId _

newtype ContentId = ContentId String
derive instance eqContentId :: Eq ContentId
derive instance ordContentId :: Ord ContentId
derive instance newtypeContentId :: Newtype ContentId _

newtype SemanticId = SemanticId String
derive instance eqSemanticId :: Eq SemanticId
derive instance ordSemanticId :: Ord SemanticId
derive instance newtypeSemanticId :: Newtype SemanticId _

newtype ContentCommitId = ContentCommitId String
derive instance eqContentCommitId :: Eq ContentCommitId
derive instance ordContentCommitId :: Ord ContentCommitId
derive instance newtypeContentCommitId :: Newtype ContentCommitId _

newtype ContentDraftId = ContentDraftId String
derive instance eqContentDraftId :: Eq ContentDraftId
derive instance ordContentDraftId :: Ord ContentDraftId
derive instance newtypeContentDraftId :: Newtype ContentDraftId _

newtype MaterialId = MaterialId String
derive instance eqMaterialId :: Eq MaterialId
derive instance ordMaterialId :: Ord MaterialId
derive instance newtypeMaterialId :: Newtype MaterialId _

newtype MaterialCommitId = MaterialCommitId String
derive instance eqMaterialCommitId :: Eq MaterialCommitId
derive instance ordMaterialCommitId :: Ord MaterialCommitId
derive instance newtypeMaterialCommitId :: Newtype MaterialCommitId _

newtype MaterialDraftId = MaterialDraftId String
derive instance eqMaterialDraftId :: Eq MaterialDraftId
derive instance ordMaterialDraftId :: Ord MaterialDraftId
derive instance newtypeMaterialDraftId :: Newtype MaterialDraftId _

newtype MaterialSnapshotId = MaterialSnapshotId String
derive instance eqMaterialSnapshotId :: Eq MaterialSnapshotId
derive instance ordMaterialSnapshotId :: Ord MaterialSnapshotId
derive instance newtypeMaterialSnapshotId :: Newtype MaterialSnapshotId _

newtype ContentSnapshotId = ContentSnapshotId String
derive instance eqContentSnapshotId :: Eq ContentSnapshotId
derive instance ordContentSnapshotId :: Ord ContentSnapshotId
derive instance newtypeContentSnapshotId :: Newtype ContentSnapshotId _

newtype CrawlerId = CrawlerId String
derive instance eqCrawlerId :: Eq CrawlerId
derive instance ordCrawlerId :: Ord CrawlerId
derive instance newtypeCrawlerId :: Newtype CrawlerId _

newtype CrawlerOperationId = CrawlerOperationId Number
derive instance eqCrawlerOperationId :: Eq CrawlerOperationId
derive instance ordCrawlerOperationId :: Ord CrawlerOperationId
derive instance newtypeCrawlerOperationId :: Newtype CrawlerOperationId _

newtype CrawlerTaskId = CrawlerTaskId Number
derive instance eqCrawlerTaskId :: Eq CrawlerTaskId
derive instance ordCrawlerTaskId :: Ord CrawlerTaskId
derive instance newtypeCrawlerTaskId :: Newtype CrawlerTaskId _

newtype CrawlerCacheId = CrawlerCacheId Number
derive instance eqCrawlerCacheId :: Eq CrawlerCacheId
derive instance ordCrawlerCacheId :: Ord CrawlerCacheId
derive instance newtypeCrawlerCacheId :: Newtype CrawlerCacheId _

newtype ReactorId = ReactorId String
derive instance eqReactorId :: Eq ReactorId
derive instance ordReactorId :: Ord ReactorId
derive instance newtypeReactorId :: Newtype ReactorId _

