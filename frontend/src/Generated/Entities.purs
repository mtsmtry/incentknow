
module Incentknow.Data.Entities where

import Prelude

import Data.Maybe (Maybe)
import Data.Argonaut.Core (Json)
import Incentknow.Data.Ids (ContainerSk, ContainerId, ContentSk, ContentId, ContentCommitSk, ContentCommitId, ContentDraftSk, ContentDraftId, ContentEditingSk, ContentEditingId, ContentSnapshotSk, ContentSnapshotId, ContentTransitionSk, ContentTransitionId, FormatSk, FormatId, FormatDisplayId, SemanticId, MetaPropertySk, MetaPropertyId, PropertySk, PropertyId, StructureSk, StructureId, MaterialSk, MaterialId, MaterialCommitSk, MaterialCommitId, MaterialDraftSk, MaterialDraftId, MaterialEditingSk, MaterialEditingId, MaterialSnapshotSk, MaterialSnapshotId, ReactorSk, ReactorId, SpaceSk, SpaceId, SpaceDisplayId, SpaceFollowSk, SpaceMemberSk, SpaceMembershipApplicationSk, UserSk, UserId, UserDisplayId, ContentRevisionId, ContentWholeRevisionId, MaterialRevisionId)




data ContentGenerator
  = ContentGeneratorNone
  | ContentGeneratorReactor
  | ContentGeneratorCrawler

derive instance eqContentGenerator :: Eq ContentGenerator
derive instance ordContentGenerator :: Ord ContentGenerator



data ContentChangeType
  = ContentChangeTypeInitial
  | ContentChangeTypeWrite
  | ContentChangeTypeRemove

derive instance eqContentChangeType :: Eq ContentChangeType
derive instance ordContentChangeType :: Ord ContentChangeType



data ContentEditingState
  = ContentEditingStateEditing
  | ContentEditingStateCommitted
  | ContentEditingStateCanceld

derive instance eqContentEditingState :: Eq ContentEditingState
derive instance ordContentEditingState :: Ord ContentEditingState



data FormatUsage
  = Internal
  | External

derive instance eqFormatUsage :: Eq FormatUsage
derive instance ordFormatUsage :: Ord FormatUsage



data MetaPropertyType
  = ValueRelatively
  | MutualExclutively
  | SeriesDependency

derive instance eqMetaPropertyType :: Eq MetaPropertyType
derive instance ordMetaPropertyType :: Ord MetaPropertyType



data TypeName
  = TypeNameInt
  | TypeNameBool
  | TypeNameString
  | TypeNameFormat
  | TypeNameSpace
  | TypeNameContent
  | TypeNameUrl
  | TypeNameObject
  | TypeNameText
  | TypeNameArray
  | TypeNameCode
  | TypeNameEnum
  | TypeNameDocument
  | TypeNameImage
  | TypeNameEntity

derive instance eqTypeName :: Eq TypeName
derive instance ordTypeName :: Ord TypeName



data Language
  = Python
  | Javascript

derive instance eqLanguage :: Eq Language
derive instance ordLanguage :: Ord Language



data MaterialType
  = MaterialTypeFolder
  | MaterialTypeDocument

derive instance eqMaterialType :: Eq MaterialType
derive instance ordMaterialType :: Ord MaterialType



data MaterialChangeType
  = MaterialChangeTypeInitial
  | MaterialChangeTypeWrite
  | MaterialChangeTypeRemove

derive instance eqMaterialChangeType :: Eq MaterialChangeType
derive instance ordMaterialChangeType :: Ord MaterialChangeType



data MaterialEditingState
  = MaterialEditingStateEditing
  | MaterialEditingStateCommitted
  | MaterialEditingStateCanceld

derive instance eqMaterialEditingState :: Eq MaterialEditingState
derive instance ordMaterialEditingState :: Ord MaterialEditingState



data ReactorState
  = Invaild

derive instance eqReactorState :: Eq ReactorState
derive instance ordReactorState :: Ord ReactorState



data MembershipMethod
  = MembershipMethodNone
  | MembershipMethodApp

derive instance eqMembershipMethod :: Eq MembershipMethod
derive instance ordMembershipMethod :: Ord MembershipMethod



data SpaceAuth
  = SpaceAuthNone
  | SpaceAuthVisible
  | SpaceAuthReadable
  | SpaceAuthWritable

derive instance eqSpaceAuth :: Eq SpaceAuth
derive instance ordSpaceAuth :: Ord SpaceAuth



data MemberType
  = Normal
  | Owner

derive instance eqMemberType :: Eq MemberType
derive instance ordMemberType :: Ord MemberType



type RelatedContainer
  = { containerId :: ContainerId
    , space :: RelatedSpace
    , format :: RelatedFormat
    , createdAt :: Number
    , updatedAt :: Number
    , generator :: Maybe ContentGenerator
    }



type FocusedContainer
  = { containerId :: ContainerId
    , space :: RelatedSpace
    , format :: RelatedFormat
    , createdAt :: Number
    , updatedAt :: Number
    , generator :: Maybe ContentGenerator
    , reactor :: Maybe IntactReactor
    }



type RelatedContent
  = { contentId :: ContentId
    , createdAt :: Number
    , updatedAt :: Number
    , creatorUser :: RelatedUser
    , updaterUser :: RelatedUser
    , updateCount :: Number
    , viewCount :: Number
    , format :: FocusedFormat
    , data :: Json
    }



type FocusedContent
  = { contentId :: ContentId
    , createdAt :: Number
    , updatedAt :: Number
    , creatorUser :: RelatedUser
    , updaterUser :: RelatedUser
    , updateCount :: Number
    , viewCount :: Number
    , format :: FocusedFormat
    , draft :: Maybe RelatedContentDraft
    , data :: Json
    }



type RelatedContentCommit
  = { commitId :: ContentCommitId
    , timestamp :: Number
    , basedCommitId :: Maybe ContentCommitId
    , committerUser :: RelatedUser
    , contentId :: ContentId
    }



type FocusedContentCommit
  = { commitId :: ContentCommitId
    , timestamp :: Number
    , basedCommitId :: Maybe ContentCommitId
    , committerUser :: RelatedUser
    , contentId :: ContentId
    }



type RelatedContentDraft
  = { draftId :: ContentDraftId
    , createdAt :: Number
    , updatedAt :: Number
    , basedCommitId :: Maybe ContentCommitId
    , data :: Json
    , contentId :: Maybe ContentId
    , format :: FocusedFormat
    , changeType :: ContentChangeType
    }



type FocusedContentDraft
  = { draftId :: ContentDraftId
    , createdAt :: Number
    , updatedAt :: Number
    , basedCommitId :: Maybe ContentCommitId
    , data :: Json
    , contentId :: Maybe ContentId
    , materialDrafts :: Array FocusedMaterialDraft
    , format :: FocusedFormat
    , changeType :: ContentChangeType
    }



data ContentNodeType
  = ContentNodeTypeCommitted
  | ContentNodeTypePresent
  | ContentNodeTypeCanceld

derive instance eqContentNodeType :: Eq ContentNodeType
derive instance ordContentNodeType :: Ord ContentNodeType



data ContentNodeTarget
  = ContentNodeTargetContent
  | ContentNodeTargetMaterial
  | ContentNodeTargetWhole

derive instance eqContentNodeTarget :: Eq ContentNodeTarget
derive instance ordContentNodeTarget :: Ord ContentNodeTarget



type ContentNode
  = { type :: ContentNodeType
    , target :: ContentNodeTarget
    , user :: RelatedUser
    , editingId :: Maybe String
    , rivision :: RelatedContentRevision
    }



data ContentRevisionSource
  = ContentRevisionSourceCommit
  | ContentRevisionSourceSnapshot
  | ContentRevisionSourceEditing
  | ContentRevisionSourceDraft

derive instance eqContentRevisionSource :: Eq ContentRevisionSource
derive instance ordContentRevisionSource :: Ord ContentRevisionSource



type ContentRivisionStructure
  = { source :: ContentRevisionSource
    , entityId :: String
    }



type ContentWholeRevisionStructure
  = { content :: ContentRevisionId
    , materials :: Array MaterialRevisionId
    }



type RelatedContentRevision
  = { snapshotId :: ContentWholeRevisionId
    , timestamp :: Number
    }



type FocusedContentRevision
  = { timestamp :: Number
    , data :: Json
    , materials :: Array FocusedMaterialRevision
    }



type RelatedFormat
  = { formatId :: FormatId
    , displayId :: FormatDisplayId
    , displayName :: String
    , description :: String
    , space :: RelatedSpace
    , usage :: FormatUsage
    , createdAt :: Number
    , creatorUser :: RelatedUser
    , updatedAt :: Number
    , updaterUser :: RelatedUser
    , semanticId :: Maybe String
    , currentStructure :: RelatedStructure
    }



type FocusedFormat
  = { formatId :: FormatId
    , displayId :: FormatDisplayId
    , displayName :: String
    , description :: String
    , space :: RelatedSpace
    , usage :: FormatUsage
    , createdAt :: Number
    , creatorUser :: RelatedUser
    , updatedAt :: Number
    , updaterUser :: RelatedUser
    , currentStructure :: FocusedStructure
    , semanticId :: Maybe String
    }



type IntactMetaProperty
  = { id :: MetaPropertyId
    , type :: MetaPropertyType
    }



type PropertyInfo
  = { displayName :: String
    , fieldName :: Maybe String
    , id :: String
    , optional :: Boolean
    , semantic :: Maybe String
    , type :: Type
    , metaProperties :: Array IntactMetaProperty
    }



type Enumerator
  = { id :: String
    , displayName :: String
    , fieldName :: Maybe String
    }



data Type
  = IntType 
  | BoolType 
  | StringType 
  | FormatType 
  | SpaceType 
  | ContentType FormatId
  | UrlType 
  | ObjectType (Array PropertyInfo)
  | TextType 
  | ArrayType Type
  | CodeType Language
  | EnumType (Array Enumerator)
  | DocumentType 
  | ImageType 
  | EntityType FormatId

derive instance eqType :: Eq Type



type RelatedStructure
  = { formatId :: FormatId
    , structureId :: StructureId
    , version :: Number
    , title :: Maybe String
    , createdAt :: Number
    }



type FocusedStructure
  = { structureId :: StructureId
    , version :: Number
    , title :: Maybe String
    , properties :: Array PropertyInfo
    , createdAt :: Number
    }



type RelatedMaterial
  = { materialId :: MaterialId
    , contentId :: Maybe ContentId
    , displayName :: String
    , materialType :: MaterialType
    , createdAt :: Number
    , creatorUser :: RelatedUser
    , updatedAt :: Number
    , updaterUser :: RelatedUser
    }



type FocusedMaterial
  = { materialId :: MaterialId
    , contentId :: Maybe ContentId
    , displayName :: String
    , materialType :: MaterialType
    , createdAt :: Number
    , creatorUser :: RelatedUser
    , updatedAt :: Number
    , updaterUser :: RelatedUser
    , data :: String
    , draft :: Maybe RelatedMaterialDraft
    }



type RelatedMaterialCommit
  = { commitId :: MaterialCommitId
    , timestamp :: Number
    , dataSize :: Number
    , basedCommitId :: Maybe MaterialCommitId
    , committerUser :: RelatedUser
    }



type FocusedMaterialCommit
  = { commitId :: MaterialCommitId
    , timestamp :: Number
    , data :: String
    , dataSize :: Number
    }



type RelatedMaterialDraft
  = { draftId :: MaterialDraftId
    , displayName :: String
    , createdAt :: Number
    , updatedAt :: Number
    }



type FocusedMaterialDraft
  = { draftId :: MaterialDraftId
    , displayName :: String
    , createdAt :: Number
    , updatedAt :: Number
    , contentDraftId :: Maybe ContentDraftId
    , material :: Maybe RelatedMaterial
    , basedCommitId :: Maybe MaterialCommitId
    , data :: String
    }



data MaterialNodeType
  = MaterialNodeTypeCommitted
  | MaterialNodeTypePresent
  | MaterialNodeTypeCanceld

derive instance eqMaterialNodeType :: Eq MaterialNodeType
derive instance ordMaterialNodeType :: Ord MaterialNodeType



type MaterialNode
  = { type :: MaterialNodeType
    , user :: RelatedUser
    , editingId :: Maybe String
    , revision :: RelatedMaterialRevision
    }



data MaterialRevisionSource
  = MaterialRevisionSourceCommit
  | MaterialRevisionSourceSnapshot
  | MaterialRevisionSourceEditing
  | MaterialRevisionSourceDraft

derive instance eqMaterialRevisionSource :: Eq MaterialRevisionSource
derive instance ordMaterialRevisionSource :: Ord MaterialRevisionSource



type MaterialRevisionStructure
  = { source :: MaterialRevisionSource
    , entityId :: String
    }



type RelatedMaterialRevision
  = { snapshotId :: MaterialRevisionId
    , timestamp :: Number
    , dataSize :: Number
    }



type FocusedMaterialRevision
  = { timestamp :: Number
    , data :: String
    }



type IntactReactor
  = { reactorId :: ReactorId
    , container :: RelatedContainer
    , state :: ReactorState
    , definitionId :: Maybe ContentId
    , createdAt :: Number
    , creatorUser :: RelatedUser
    }



type RelatedSpace
  = { spaceId :: SpaceId
    , displayId :: SpaceDisplayId
    , displayName :: String
    , description :: String
    , createdAt :: Number
    , homeUrl :: Maybe String
    , published :: Boolean
    , membershipMethod :: MembershipMethod
    , defaultAuthority :: SpaceAuth
    }



type FocusedSpace
  = { spaceId :: SpaceId
    , displayId :: SpaceDisplayId
    , displayName :: String
    , description :: String
    , creatorUser :: RelatedUser
    , createdAt :: Number
    , homeUrl :: Maybe String
    , published :: Boolean
    , membershipMethod :: MembershipMethod
    , defaultAuthority :: SpaceAuth
    }



type IntactSpaceMember
  = { user :: RelatedUser
    , joinedAt :: Number
    , type :: MemberType
    }



type IntactSpaceMembershipApplication
  = { user :: RelatedUser
    , appliedAt :: Number
    }



type IntactAccount
  = { userId :: UserId
    , displayId :: UserDisplayId
    , displayName :: String
    , iconUrl :: Maybe String
    , createdAt :: Number
    , email :: String
    }



type RelatedUser
  = { userId :: UserId
    , displayId :: UserDisplayId
    , displayName :: String
    , iconUrl :: Maybe String
    , createdAt :: Number
    }



type FocusedUser
  = { userId :: UserId
    , displayId :: UserDisplayId
    , displayName :: String
    , iconUrl :: Maybe String
    , createdAt :: Number
    }



data MaterialCompositionType
  = Creation
  | Move

derive instance eqMaterialCompositionType :: Eq MaterialCompositionType
derive instance ordMaterialCompositionType :: Ord MaterialCompositionType



data MaterialComposition
  = CreationMaterialComposition String String
  | MoveMaterialComposition MaterialId

derive instance eqMaterialComposition :: Eq MaterialComposition



