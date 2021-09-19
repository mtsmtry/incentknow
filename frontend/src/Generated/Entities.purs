
module Incentknow.Data.Entities where

import Prelude

import Data.Maybe (Maybe)
import Data.Argonaut.Core (Json)

import Incentknow.Data.Ids (ContainerSk, ContainerId, ContentSk, ContentId, ContentCommitSk, ContentCommitId, ContentDraftSk, ContentDraftId, FormatSk, FormatId, FormatDisplayId, SemanticId, MetaPropertySk, MetaPropertyId, PropertySk, PropertyId, StructureSk, StructureId, MaterialSk, MaterialId, MaterialCommitSk, MaterialCommitId, MaterialDraftSk, MaterialDraftId, MaterialEditingSk, MaterialEditingId, MaterialSnapshotSk, MaterialSnapshotId, ActivitySk, ActivityId, CommentSk, CommentId, CommentLikeSk, ContentLikeSk, NotificationSk, NotificationId, ReactorSk, ReactorId, SpaceSk, SpaceId, SpaceDisplayId, SpaceFollowSk, SpaceMemberSk, SpaceMembershipApplicationSk, UserSk, UserId, UserDisplayId, DocumentBlockId)


type Date = String



data ContentGenerator
  = ContentGeneratorNone
  | ContentGeneratorReactor
  | ContentGeneratorCrawler

derive instance eqContentGenerator :: Eq ContentGenerator
derive instance ordContentGenerator :: Ord ContentGenerator



data ContentDraftState
  = ContentDraftStateEditing
  | ContentDraftStateCanceled
  | ContentDraftStateCommitted

derive instance eqContentDraftState :: Eq ContentDraftState
derive instance ordContentDraftState :: Ord ContentDraftState



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
  | TypeNameContent
  | TypeNameUrl
  | TypeNameObject
  | TypeNameText
  | TypeNameArray
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
  = MaterialTypePlaintext
  | MaterialTypeDocument

derive instance eqMaterialType :: Eq MaterialType
derive instance ordMaterialType :: Ord MaterialType



data MaterialChangeType
  = Initial
  | Write
  | Remove

derive instance eqMaterialChangeType :: Eq MaterialChangeType
derive instance ordMaterialChangeType :: Ord MaterialChangeType



data MaterialType2
  = MaterialType2Plaintext
  | MaterialType2Document

derive instance eqMaterialType2 :: Eq MaterialType2
derive instance ordMaterialType2 :: Ord MaterialType2



data MaterialEditingState
  = MaterialEditingStateEditing
  | MaterialEditingStateCommitted
  | MaterialEditingStateCanceld

derive instance eqMaterialEditingState :: Eq MaterialEditingState
derive instance ordMaterialEditingState :: Ord MaterialEditingState



data ActivityType
  = ActivityTypeContentCreated
  | ActivityTypeContentUpdated
  | ActivityTypeContentCommented

derive instance eqActivityType :: Eq ActivityType
derive instance ordActivityType :: Ord ActivityType



data CommentState
  = CommentStateNormal
  | CommentStateDeleted

derive instance eqCommentState :: Eq CommentState
derive instance ordCommentState :: Ord CommentState



data NotificationType
  = NotificationTypeContentCommented
  | NotificationTypeCommentReplied

derive instance eqNotificationType :: Eq NotificationType
derive instance ordNotificationType :: Ord NotificationType



data ReactorState
  = Invaild

derive instance eqReactorState :: Eq ReactorState
derive instance ordReactorState :: Ord ReactorState



data MembershipMethod
  = MembershipMethodNone
  | MembershipMethodApp

derive instance eqMembershipMethod :: Eq MembershipMethod
derive instance ordMembershipMethod :: Ord MembershipMethod



data SpaceAuthority
  = SpaceAuthorityNone
  | SpaceAuthorityVisible
  | SpaceAuthorityReadable
  | SpaceAuthorityWritable

derive instance eqSpaceAuthority :: Eq SpaceAuthority
derive instance ordSpaceAuthority :: Ord SpaceAuthority



data MemberType
  = MemberTypeNormal
  | MemberTypeOwner

derive instance eqMemberType :: Eq MemberType
derive instance ordMemberType :: Ord MemberType



type RelatedContainer
  = { containerId :: ContainerId
    , space :: RelatedSpace
    , format :: RelatedFormat
    , createdAt :: Number
    , updatedAt :: Number
    , contentCount :: Int
    , generator :: Maybe ContentGenerator
    }



type AdditionalContainerInfo
  = { contentCount :: Int
    , latestUpdatedAt :: Maybe Date
    }



type FocusedContainer
  = { containerId :: ContainerId
    , space :: RelatedSpace
    , format :: RelatedFormat
    , createdAt :: Number
    , updatedAt :: Number
    , generator :: Maybe ContentGenerator
    , reactor :: Maybe IntactReactor
    , contentCount :: Int
    , latestUpdatedAt :: Maybe Number
    }



data Authority
  = AuthorityNone
  | AuthorityReadable
  | AuthorityWritable

derive instance eqAuthority :: Eq Authority
derive instance ordAuthority :: Ord Authority



type RelatedContent
  = { contentId :: ContentId
    , createdAt :: Number
    , updatedAt :: Number
    , creatorUser :: RelatedUser
    , updaterUser :: RelatedUser
    , updateCount :: Int
    , viewCount :: Int
    , commentCount :: Int
    , format :: FocusedFormat
    , data :: Json
    , authority :: Authority
    , semanticId :: Maybe String
    }



type FocusedContent
  = { contentId :: ContentId
    , createdAt :: Number
    , updatedAt :: Number
    , creatorUser :: RelatedUser
    , updaterUser :: RelatedUser
    , updateCount :: Int
    , viewCount :: Int
    , commentCount :: Int
    , format :: FocusedFormat
    , authority :: Authority
    , data :: Json
    , semanticId :: Maybe String
    }



type ContentRelation
  = { contents :: Array RelatedContent
    , relation :: Relation
    }



type SearchedContent
  = { content :: RelatedContent
    , highlights :: Array String
    , score :: Number
    }



type IntactContentPage
  = { content :: FocusedContent
    , draft :: Maybe RelatedContentDraft
    , comments :: Array FocusedTreeComment
    , relations :: Array ContentRelation
    }



type RelatedContentCommit
  = { commitId :: ContentCommitId
    , timestamp :: Number
    , committerUser :: RelatedUser
    , contentId :: ContentId
    }



type FocusedContentCommit
  = { commitId :: ContentCommitId
    , timestamp :: Number
    , committerUser :: RelatedUser
    , contentId :: ContentId
    }



type RelatedContentDraft
  = { draftId :: ContentDraftId
    , createdAt :: Number
    , updatedAt :: Number
    , data :: Json
    , contentId :: Maybe ContentId
    , format :: FocusedFormat
    }



type FocusedContentDraft
  = { draftId :: ContentDraftId
    , createdAt :: Number
    , updatedAt :: Number
    , data :: Json
    , contentId :: Maybe ContentId
    , format :: FocusedFormat
    }



type RelatedFormat
  = { formatId :: FormatId
    , displayId :: FormatDisplayId
    , displayName :: String
    , description :: String
    , icon :: Maybe String
    , space :: RelatedSpace
    , usage :: FormatUsage
    , currentStructureId :: StructureId
    }



type Relation
  = { property :: PropertyInfo
    , contentCount :: Number
    , formatId :: FormatId
    }



type FocusedFormat
  = { formatId :: FormatId
    , displayId :: FormatDisplayId
    , displayName :: String
    , description :: String
    , icon :: Maybe String
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
    , id :: PropertyId
    , optional :: Boolean
    , semantic :: Maybe String
    , icon :: Maybe String
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
  | ContentType FocusedFormat
  | UrlType 
  | ObjectType (Array PropertyInfo)
  | TextType 
  | ArrayType Type
  | EnumType (Array Enumerator)
  | DocumentType 
  | ImageType 
  | EntityType FocusedFormat

derive instance eqType :: Eq Type



type RelatedStructure
  = { formatId :: FormatId
    , structureId :: StructureId
    , version :: Int
    , title :: Maybe String
    , createdAt :: Number
    }



type FocusedStructure
  = { structureId :: StructureId
    , version :: Int
    , title :: Maybe String
    , properties :: Array PropertyInfo
    , createdAt :: Number
    }



data BlockType
  = Paragraph
  | Header

derive instance eqBlockType :: Eq BlockType
derive instance ordBlockType :: Ord BlockType



type DocumentBlock
  = { id :: DocumentBlockId
    , data :: BlockData
    }



data BlockData
  = ParagraphBlockData String
  | HeaderBlockData Int String

derive instance eqBlockData :: Eq BlockData



type Document
  = { blocks :: Array DocumentBlock
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



data MaterialData
  = PlaintextMaterialData String
  | DocumentMaterialData Document

derive instance eqMaterialData :: Eq MaterialData



type FocusedMaterial
  = { materialId :: MaterialId
    , contentId :: Maybe ContentId
    , displayName :: String
    , materialType :: MaterialType
    , createdAt :: Number
    , creatorUser :: RelatedUser
    , updatedAt :: Number
    , updaterUser :: RelatedUser
    , data :: MaterialData
    , draft :: Maybe RelatedMaterialDraft
    }



type RelatedMaterialCommit
  = { commitId :: MaterialCommitId
    , timestamp :: Number
    , textCount :: Number
    , basedCommitId :: Maybe MaterialCommitId
    , committerUser :: RelatedUser
    }



type FocusedMaterialCommit
  = { commitId :: MaterialCommitId
    , timestamp :: Number
    , data :: String
    , textCount :: Number
    }



type RelatedMaterialDraft
  = { draftId :: MaterialDraftId
    , displayName :: String
    , createdAt :: Number
    , updatedAt :: Number
    , isEditing :: Boolean
    }



type FocusedMaterialDraft
  = { draftId :: MaterialDraftId
    , displayName :: String
    , createdAt :: Number
    , updatedAt :: Number
    , material :: Maybe RelatedMaterial
    , basedCommitId :: Maybe MaterialCommitId
    , data :: MaterialData
    , isEditing :: Boolean
    }



type MaterialDraftUpdation
  = { draftId :: MaterialDraftId
    , data :: MaterialData
    }



type IntactMaterialEditing
  = { materialEditingId :: MaterialEditingId
    , createdAt :: Number
    , updatedAt :: Number
    }



type RelatedMaterialSnapshot
  = { textCount :: Number
    , displayName :: String
    , timestamp :: Number
    }



type FocusedMaterialSnapshot
  = { data :: MaterialData
    , textCount :: Number
    , displayName :: String
    , timestamp :: Number
    }



data ActivityAction
  = ContentCreatedActivityAction RelatedContent
  | ContentUpdatedActivityAction RelatedContent
  | ContentCommentedActivityAction RelatedContent RelatedComment

derive instance eqActivityAction :: Eq ActivityAction



type IntactActivityBySpace
  = { activityId :: ActivityId
    , action :: ActivityAction
    , actorUser :: RelatedUser
    , timestamp :: Number
    }



type IntactActivityByUser
  = { activityId :: ActivityId
    , action :: ActivityAction
    , space :: RelatedSpace
    , timestamp :: Number
    }



type RelatedComment
  = { commentId :: CommentId
    , user :: RelatedUser
    , text :: String
    , createdAt :: Number
    , updatedAt :: Number
    }



type FocusedComment
  = { commentId :: CommentId
    , user :: RelatedUser
    , text :: String
    , createdAt :: Number
    , updatedAt :: Number
    , likeCount :: Int
    }



type FocusedTreeComment
  = { commentId :: CommentId
    , user :: RelatedUser
    , text :: String
    , createdAt :: Number
    , updatedAt :: Number
    , likeCount :: Int
    , replies :: Array FocusedComment
    }



data NotificationAction
  = ContentCommentedNotificationAction RelatedContent RelatedComment
  | CommentRepliedNotificationAction RelatedContent RelatedComment

derive instance eqNotificationAction :: Eq NotificationAction



type IntactNotification
  = { notificationId :: NotificationId
    , action :: NotificationAction
    , notifiedFromUser :: RelatedUser
    , timestamp :: Number
    , isRead :: Boolean
    }



type IntactReactor
  = { reactorId :: ReactorId
    , container :: RelatedContainer
    , state :: ReactorState
    , definitionId :: Maybe ContentId
    , createdAt :: Number
    , creatorUser :: RelatedUser
    }



type AdditionalSpaceInfo
  = { containerCount :: Number
    , memberCount :: Number
    , formatCount :: Number
    }



type RelatedSpace
  = { spaceId :: SpaceId
    , displayId :: SpaceDisplayId
    , displayName :: String
    , description :: String
    , createdAt :: Number
    , headerImage :: Maybe String
    , published :: Boolean
    , membershipMethod :: MembershipMethod
    , defaultAuthority :: SpaceAuthority
    }



type FocusedSpace
  = { spaceId :: SpaceId
    , displayId :: SpaceDisplayId
    , displayName :: String
    , description :: String
    , creatorUser :: RelatedUser
    , createdAt :: Number
    , headerImage :: Maybe String
    , published :: Boolean
    , membershipMethod :: MembershipMethod
    , defaultAuthority :: SpaceAuthority
    , containerCount :: Int
    , memberCount :: Int
    , contentCount :: Int
    , formatCount :: Int
    , containers :: Array RelatedContainer
    }



type IntactSpageHomePage
  = { activities :: Array IntactActivityBySpace
    , topics :: Array FocusedContent
    , members :: Array IntactSpaceMember
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
    , iconImage :: Maybe String
    , createdAt :: Number
    , email :: String
    }



type RelatedUser
  = { userId :: UserId
    , displayId :: UserDisplayId
    , displayName :: String
    , iconImage :: Maybe String
    , createdAt :: Number
    }



type FocusedUser
  = { userId :: UserId
    , displayId :: UserDisplayId
    , displayName :: String
    , iconImage :: Maybe String
    , createdAt :: Number
    }



type AuthInfo
  = { session :: String
    , userId :: UserId
    }



