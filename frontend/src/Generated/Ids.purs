
module Incentknow.Data.Ids where

import Prelude

import Data.Newtype (class Newtype)


newtype ContainerSk = ContainerSk Int
derive instance eqContainerSk :: Eq ContainerSk
derive instance ordContainerSk :: Ord ContainerSk
derive instance newtypeContainerSk :: Newtype ContainerSk _



newtype ContainerId = ContainerId String
derive instance eqContainerId :: Eq ContainerId
derive instance ordContainerId :: Ord ContainerId
derive instance newtypeContainerId :: Newtype ContainerId _



newtype ContentSk = ContentSk Int
derive instance eqContentSk :: Eq ContentSk
derive instance ordContentSk :: Ord ContentSk
derive instance newtypeContentSk :: Newtype ContentSk _



newtype ContentId = ContentId String
derive instance eqContentId :: Eq ContentId
derive instance ordContentId :: Ord ContentId
derive instance newtypeContentId :: Newtype ContentId _



newtype ContentCommitSk = ContentCommitSk Int
derive instance eqContentCommitSk :: Eq ContentCommitSk
derive instance ordContentCommitSk :: Ord ContentCommitSk
derive instance newtypeContentCommitSk :: Newtype ContentCommitSk _



newtype ContentCommitId = ContentCommitId String
derive instance eqContentCommitId :: Eq ContentCommitId
derive instance ordContentCommitId :: Ord ContentCommitId
derive instance newtypeContentCommitId :: Newtype ContentCommitId _



newtype ContentDraftSk = ContentDraftSk Int
derive instance eqContentDraftSk :: Eq ContentDraftSk
derive instance ordContentDraftSk :: Ord ContentDraftSk
derive instance newtypeContentDraftSk :: Newtype ContentDraftSk _



newtype ContentDraftId = ContentDraftId String
derive instance eqContentDraftId :: Eq ContentDraftId
derive instance ordContentDraftId :: Ord ContentDraftId
derive instance newtypeContentDraftId :: Newtype ContentDraftId _



newtype ContentEditingSk = ContentEditingSk Int
derive instance eqContentEditingSk :: Eq ContentEditingSk
derive instance ordContentEditingSk :: Ord ContentEditingSk
derive instance newtypeContentEditingSk :: Newtype ContentEditingSk _



newtype ContentEditingId = ContentEditingId String
derive instance eqContentEditingId :: Eq ContentEditingId
derive instance ordContentEditingId :: Ord ContentEditingId
derive instance newtypeContentEditingId :: Newtype ContentEditingId _



newtype ContentSnapshotSk = ContentSnapshotSk Int
derive instance eqContentSnapshotSk :: Eq ContentSnapshotSk
derive instance ordContentSnapshotSk :: Ord ContentSnapshotSk
derive instance newtypeContentSnapshotSk :: Newtype ContentSnapshotSk _



newtype ContentSnapshotId = ContentSnapshotId String
derive instance eqContentSnapshotId :: Eq ContentSnapshotId
derive instance ordContentSnapshotId :: Ord ContentSnapshotId
derive instance newtypeContentSnapshotId :: Newtype ContentSnapshotId _



newtype ContentTransitionSk = ContentTransitionSk Int
derive instance eqContentTransitionSk :: Eq ContentTransitionSk
derive instance ordContentTransitionSk :: Ord ContentTransitionSk
derive instance newtypeContentTransitionSk :: Newtype ContentTransitionSk _



newtype ContentTransitionId = ContentTransitionId String
derive instance eqContentTransitionId :: Eq ContentTransitionId
derive instance ordContentTransitionId :: Ord ContentTransitionId
derive instance newtypeContentTransitionId :: Newtype ContentTransitionId _



newtype FormatSk = FormatSk Int
derive instance eqFormatSk :: Eq FormatSk
derive instance ordFormatSk :: Ord FormatSk
derive instance newtypeFormatSk :: Newtype FormatSk _



newtype FormatId = FormatId String
derive instance eqFormatId :: Eq FormatId
derive instance ordFormatId :: Ord FormatId
derive instance newtypeFormatId :: Newtype FormatId _



newtype FormatDisplayId = FormatDisplayId String
derive instance eqFormatDisplayId :: Eq FormatDisplayId
derive instance ordFormatDisplayId :: Ord FormatDisplayId
derive instance newtypeFormatDisplayId :: Newtype FormatDisplayId _



newtype SemanticId = SemanticId String
derive instance eqSemanticId :: Eq SemanticId
derive instance ordSemanticId :: Ord SemanticId
derive instance newtypeSemanticId :: Newtype SemanticId _



newtype MetaPropertySk = MetaPropertySk Int
derive instance eqMetaPropertySk :: Eq MetaPropertySk
derive instance ordMetaPropertySk :: Ord MetaPropertySk
derive instance newtypeMetaPropertySk :: Newtype MetaPropertySk _



newtype MetaPropertyId = MetaPropertyId String
derive instance eqMetaPropertyId :: Eq MetaPropertyId
derive instance ordMetaPropertyId :: Ord MetaPropertyId
derive instance newtypeMetaPropertyId :: Newtype MetaPropertyId _



newtype PropertySk = PropertySk Int
derive instance eqPropertySk :: Eq PropertySk
derive instance ordPropertySk :: Ord PropertySk
derive instance newtypePropertySk :: Newtype PropertySk _



newtype PropertyId = PropertyId String
derive instance eqPropertyId :: Eq PropertyId
derive instance ordPropertyId :: Ord PropertyId
derive instance newtypePropertyId :: Newtype PropertyId _



newtype StructureSk = StructureSk Int
derive instance eqStructureSk :: Eq StructureSk
derive instance ordStructureSk :: Ord StructureSk
derive instance newtypeStructureSk :: Newtype StructureSk _



newtype StructureId = StructureId String
derive instance eqStructureId :: Eq StructureId
derive instance ordStructureId :: Ord StructureId
derive instance newtypeStructureId :: Newtype StructureId _



newtype MaterialSk = MaterialSk Int
derive instance eqMaterialSk :: Eq MaterialSk
derive instance ordMaterialSk :: Ord MaterialSk
derive instance newtypeMaterialSk :: Newtype MaterialSk _



newtype MaterialId = MaterialId String
derive instance eqMaterialId :: Eq MaterialId
derive instance ordMaterialId :: Ord MaterialId
derive instance newtypeMaterialId :: Newtype MaterialId _



newtype MaterialCommitSk = MaterialCommitSk Int
derive instance eqMaterialCommitSk :: Eq MaterialCommitSk
derive instance ordMaterialCommitSk :: Ord MaterialCommitSk
derive instance newtypeMaterialCommitSk :: Newtype MaterialCommitSk _



newtype MaterialCommitId = MaterialCommitId String
derive instance eqMaterialCommitId :: Eq MaterialCommitId
derive instance ordMaterialCommitId :: Ord MaterialCommitId
derive instance newtypeMaterialCommitId :: Newtype MaterialCommitId _



newtype MaterialDraftSk = MaterialDraftSk Int
derive instance eqMaterialDraftSk :: Eq MaterialDraftSk
derive instance ordMaterialDraftSk :: Ord MaterialDraftSk
derive instance newtypeMaterialDraftSk :: Newtype MaterialDraftSk _



newtype MaterialDraftId = MaterialDraftId String
derive instance eqMaterialDraftId :: Eq MaterialDraftId
derive instance ordMaterialDraftId :: Ord MaterialDraftId
derive instance newtypeMaterialDraftId :: Newtype MaterialDraftId _



newtype MaterialEditingSk = MaterialEditingSk Int
derive instance eqMaterialEditingSk :: Eq MaterialEditingSk
derive instance ordMaterialEditingSk :: Ord MaterialEditingSk
derive instance newtypeMaterialEditingSk :: Newtype MaterialEditingSk _



newtype MaterialEditingId = MaterialEditingId String
derive instance eqMaterialEditingId :: Eq MaterialEditingId
derive instance ordMaterialEditingId :: Ord MaterialEditingId
derive instance newtypeMaterialEditingId :: Newtype MaterialEditingId _



newtype MaterialSnapshotSk = MaterialSnapshotSk Int
derive instance eqMaterialSnapshotSk :: Eq MaterialSnapshotSk
derive instance ordMaterialSnapshotSk :: Ord MaterialSnapshotSk
derive instance newtypeMaterialSnapshotSk :: Newtype MaterialSnapshotSk _



newtype MaterialSnapshotId = MaterialSnapshotId String
derive instance eqMaterialSnapshotId :: Eq MaterialSnapshotId
derive instance ordMaterialSnapshotId :: Ord MaterialSnapshotId
derive instance newtypeMaterialSnapshotId :: Newtype MaterialSnapshotId _



newtype ReactorSk = ReactorSk Int
derive instance eqReactorSk :: Eq ReactorSk
derive instance ordReactorSk :: Ord ReactorSk
derive instance newtypeReactorSk :: Newtype ReactorSk _



newtype ReactorId = ReactorId String
derive instance eqReactorId :: Eq ReactorId
derive instance ordReactorId :: Ord ReactorId
derive instance newtypeReactorId :: Newtype ReactorId _



newtype SpaceSk = SpaceSk Int
derive instance eqSpaceSk :: Eq SpaceSk
derive instance ordSpaceSk :: Ord SpaceSk
derive instance newtypeSpaceSk :: Newtype SpaceSk _



newtype SpaceId = SpaceId String
derive instance eqSpaceId :: Eq SpaceId
derive instance ordSpaceId :: Ord SpaceId
derive instance newtypeSpaceId :: Newtype SpaceId _



newtype SpaceDisplayId = SpaceDisplayId String
derive instance eqSpaceDisplayId :: Eq SpaceDisplayId
derive instance ordSpaceDisplayId :: Ord SpaceDisplayId
derive instance newtypeSpaceDisplayId :: Newtype SpaceDisplayId _



newtype SpaceFollowSk = SpaceFollowSk Int
derive instance eqSpaceFollowSk :: Eq SpaceFollowSk
derive instance ordSpaceFollowSk :: Ord SpaceFollowSk
derive instance newtypeSpaceFollowSk :: Newtype SpaceFollowSk _



newtype SpaceMemberSk = SpaceMemberSk Int
derive instance eqSpaceMemberSk :: Eq SpaceMemberSk
derive instance ordSpaceMemberSk :: Ord SpaceMemberSk
derive instance newtypeSpaceMemberSk :: Newtype SpaceMemberSk _



newtype SpaceMembershipApplicationSk = SpaceMembershipApplicationSk Int
derive instance eqSpaceMembershipApplicationSk :: Eq SpaceMembershipApplicationSk
derive instance ordSpaceMembershipApplicationSk :: Ord SpaceMembershipApplicationSk
derive instance newtypeSpaceMembershipApplicationSk :: Newtype SpaceMembershipApplicationSk _



newtype UserSk = UserSk Int
derive instance eqUserSk :: Eq UserSk
derive instance ordUserSk :: Ord UserSk
derive instance newtypeUserSk :: Newtype UserSk _



newtype UserId = UserId String
derive instance eqUserId :: Eq UserId
derive instance ordUserId :: Ord UserId
derive instance newtypeUserId :: Newtype UserId _



newtype UserDisplayId = UserDisplayId String
derive instance eqUserDisplayId :: Eq UserDisplayId
derive instance ordUserDisplayId :: Ord UserDisplayId
derive instance newtypeUserDisplayId :: Newtype UserDisplayId _



newtype ContentRevisionId = ContentRevisionId String
derive instance eqContentRevisionId :: Eq ContentRevisionId
derive instance ordContentRevisionId :: Ord ContentRevisionId
derive instance newtypeContentRevisionId :: Newtype ContentRevisionId _



newtype ContentWholeRevisionId = ContentWholeRevisionId String
derive instance eqContentWholeRevisionId :: Eq ContentWholeRevisionId
derive instance ordContentWholeRevisionId :: Ord ContentWholeRevisionId
derive instance newtypeContentWholeRevisionId :: Newtype ContentWholeRevisionId _



newtype MaterialRevisionId = MaterialRevisionId String
derive instance eqMaterialRevisionId :: Eq MaterialRevisionId
derive instance ordMaterialRevisionId :: Ord MaterialRevisionId
derive instance newtypeMaterialRevisionId :: Newtype MaterialRevisionId _



