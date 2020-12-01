
module Incentknow.Data.Entities where

import Prelude

import Data.Maybe (Maybe)
import Data.Argonaut.Core (Json)
import Incentknow.Data.Ids (ContainerId, SpaceId, SpaceDisplayId, UserId, UserDisplayId, StructureId, FormatId, FormatDisplayId, ContentId, SemanticId, ContentCommitId, ContentDraftId, MaterialId, MaterialCommitId, MaterialDraftId, MaterialSnapshotId, ContentSnapshotId, CrawlerId, CrawlerOperationId, CrawlerTaskId, CrawlerCacheId, ReactorId)


---------------------------------------------------------
--  Sql
---------------------------------------------------------

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

data ContentGenerator
  = ContentGeneratorNone
  | ContentGeneratorReactor
  | ContentGeneratorCrawler

derive instance eqContentGenerator :: Eq ContentGenerator
derive instance ordContentGenerator :: Ord ContentGenerator

data FormatUsage
  = Internal
  | External

derive instance eqFormatUsage :: Eq FormatUsage
derive instance ordFormatUsage :: Ord FormatUsage

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

data EditingState
  = EditingStateEditing
  | EditingStateCommitted
  | EditingStateCanceld

derive instance eqEditingState :: Eq EditingState
derive instance ordEditingState :: Ord EditingState

data DraftState
  = DraftStateEditing

derive instance eqDraftState :: Eq DraftState
derive instance ordDraftState :: Ord DraftState

data ChangeType
  = Initial
  | Write
  | Remove

derive instance eqChangeType :: Eq ChangeType
derive instance ordChangeType :: Ord ChangeType

data MaterialType
  = MaterialTypeFolder
  | MaterialTypeDocument

derive instance eqMaterialType :: Eq MaterialType
derive instance ordMaterialType :: Ord MaterialType

data CrawlerTaskStatus
  = CrawlerTaskStatusPdending
  | CrawlerTaskStatusRunning
  | CrawlerTaskStatusCompleted
  | CrawlerTaskStatusFailedFetching
  | CrawlerTaskStatusFailedScraping
  | CrawlerTaskStatusFailedImporting

derive instance eqCrawlerTaskStatus :: Eq CrawlerTaskStatus
derive instance ordCrawlerTaskStatus :: Ord CrawlerTaskStatus

data Status

derive instance eqStatus :: Eq Status
derive instance ordStatus :: Ord Status

data CrawlerTaskMethod
  = CrawlerTaskMethodCrawling
  | CrawlerTaskMethodScraping

derive instance eqCrawlerTaskMethod :: Eq CrawlerTaskMethod
derive instance ordCrawlerTaskMethod :: Ord CrawlerTaskMethod

data CrawlerTakeoverClass
  = New
  | Duplication

derive instance eqCrawlerTakeoverClass :: Eq CrawlerTakeoverClass
derive instance ordCrawlerTakeoverClass :: Ord CrawlerTakeoverClass

type CrawlerTaskOutput
  = { indexes :: Array { url :: String, taskId :: Maybe String, class :: CrawlerTakeoverClass }
    , contents :: Maybe (Array { contentId :: String, version :: Number })
    }

data CrawlerOperationStatus
  = CrawlerOperationStatusPending
  | CrawlerOperationStatusRunning
  | CrawlerOperationStatusCompleted

derive instance eqCrawlerOperationStatus :: Eq CrawlerOperationStatus
derive instance ordCrawlerOperationStatus :: Ord CrawlerOperationStatus

data CrawlerOperationMethod
  = CrawlerOperationMethodCrawling
  | CrawlerOperationMethodScraping

derive instance eqCrawlerOperationMethod :: Eq CrawlerOperationMethod
derive instance ordCrawlerOperationMethod :: Ord CrawlerOperationMethod

data CrawlerCacheStatus
  = Stored
  | Deleted

derive instance eqCrawlerCacheStatus :: Eq CrawlerCacheStatus
derive instance ordCrawlerCacheStatus :: Ord CrawlerCacheStatus

data ReactorState
  = Invaild

derive instance eqReactorState :: Eq ReactorState
derive instance ordReactorState :: Ord ReactorState

---------------------------------------------------------
--  Entities
---------------------------------------------------------

type IntactContainer
  = { containerId :: ContainerId
    , space :: RelatedSpace
    , format :: RelatedFormat
    , createdAt :: Number
    , updatedAt :: Number
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

type PropertyInfo
  = { displayName :: String
    , fieldName :: Maybe String
    , id :: String
    , optional :: Boolean
    , semantic :: Maybe String
    , type :: Type
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

type FocusedStructure
  = { structureId :: StructureId
    , properties :: Array PropertyInfo
    , createdAt :: Number
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
    , structure :: FocusedStructure
    , semanticId :: Maybe String
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
    , draftId :: Maybe ContentDraftId
    , data :: Json
    }

type RelatedContentCommit
  = { commitId :: ContentCommitId
    , timestamp :: Number
    , forkedCommitId :: String
    , committerUser :: RelatedUser
    }

type FocusedContentCommit
  = { commitId :: ContentCommitId
    , timestamp :: Number
    , forkedCommitId :: String
    , committerUser :: RelatedUser
    }

type RelatedContentDraft
  = { draftId :: ContentDraftId
    , createdAt :: Number
    , updatedAt :: Number
    , forkedCommitId :: String
    , data :: Json
    , format :: FocusedFormat
    , state :: EditingState
    }

type FocusedContentDraft
  = { draftId :: ContentDraftId
    , createdAt :: Number
    , updatedAt :: Number
    , forkedCommitId :: String
    , data :: String
    , materialDrafts :: Array FocusedMaterialDraft
    , state :: EditingState
    }

type RelatedMaterial
  = { materialId :: MaterialId
    , contentId :: String
    , displayName :: String
    , materialType :: MaterialType
    , createdAt :: Number
    , creatorUser :: RelatedUser
    , updatedAt :: Number
    , updaterUser :: RelatedUser
    }

type FocusedMaterial
  = { materialId :: MaterialId
    , contentId :: String
    , displayName :: String
    , materialType :: MaterialType
    , createdAt :: Number
    , creatorUser :: RelatedUser
    , updatedAt :: Number
    , updaterUser :: RelatedUser
    , data :: String
    , draft :: RelatedMaterialDraft
    }

type RelatedMaterialCommit
  = { commitId :: MaterialCommitId
    , timestamp :: Number
    , dataSize :: Number
    , forkedCommitId :: String
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
    , contentDraftId :: String
    , material :: RelatedMaterial
    , forkedCommitId :: String
    , data :: String
    }

data SnapshotSource
  = SnapshotSourceCommit
  | SnapshotSourceSnapshot
  | SnapshotSourceEditing
  | SnapshotSourceDraft

derive instance eqSnapshotSource :: Eq SnapshotSource
derive instance ordSnapshotSource :: Ord SnapshotSource

data NodeType
  = NodeTypeCommitted
  | NodeTypePresent
  | NodeTypeCanceld

derive instance eqNodeType :: Eq NodeType
derive instance ordNodeType :: Ord NodeType

type MaterialSnapshotStructure
  = { source :: SnapshotSource
    , entityId :: String
    }

type RelatedMaterialSnapshot
  = { snapshotId :: MaterialSnapshotId
    , timestamp :: Number
    , dataSize :: Number
    }

type FocusedMaterialSnapshot
  = { timestamp :: Number
    , data :: String
    }

type MaterialNode
  = { type :: NodeType
    , user :: RelatedUser
    , editingId :: Maybe String
    , snapshot :: RelatedMaterialSnapshot
    }

data NodeTarget
  = NodeTargetContent
  | NodeTargetMaterial
  | NodeTargetWhole

derive instance eqNodeTarget :: Eq NodeTarget
derive instance ordNodeTarget :: Ord NodeTarget

type ContentNode
  = { type :: NodeType
    , target :: NodeTarget
    , user :: RelatedUser
    , editingId :: Maybe String
    , snapshot :: RelatedContentSnapshot
    }

type ContentSnapshotStructure
  = { source :: SnapshotSource
    , entityId :: String
    , materials :: Array MaterialSnapshotId
    }

type RelatedContentSnapshot
  = { snapshotId :: ContentSnapshotId
    , timestamp :: Number
    }

type FocusedContentSnapshot
  = { timestamp :: Number
    , data :: String
    , materials :: Array FocusedMaterialSnapshot
    }

type IntactCrawler
  = { crawlerId :: CrawlerId
    , definitionId :: ContentId
    , displayName :: String
    , spaceId :: SpaceId
    , updatedAt :: Number
    , runningOperation :: Maybe IntactCrawlerOperation
    }

type IntactCrawlerOperation
  = { operationId :: CrawlerOperationId
    , createdAt :: Number
    , executorUser :: RelatedUser
    , method :: CrawlerOperationMethod
    , startedAt :: Maybe Number
    , endedAt :: Maybe Number
    , status :: CrawlerOperationStatus
    }

type IntactCrawlerTask
  = { taskId :: CrawlerTaskId
    , scraperId :: ContentId
    , displayName :: String
    , createdAt :: Number
    , startedAt :: Maybe Number
    , endedAt :: Maybe Number
    , message :: Maybe String
    , output :: CrawlerTaskOutput
    , cacheId :: CrawlerCacheId
    }

type IntendCrawlerCache
  = { cacheId :: CrawlerCacheId
    , operationId :: CrawlerOperationId
    , scraperId :: ContentId
    , url :: String
    , status :: CrawlerCacheStatus
    , createdAt :: Number
    , updatedAt :: Number
    }

type IntactReactor
  = { reactorId :: ReactorId
    , space :: RelatedSpace
    , format :: RelatedFormat
    , state :: ReactorState
    , definitionId :: ContentId
    , createdAt :: Number
    , creatorUser :: RelatedUser
    }

---------------------------------------------------------
--  Container
---------------------------------------------------------

---------------------------------------------------------
--  Content
---------------------------------------------------------

---------------------------------------------------------
--  Format
---------------------------------------------------------

---------------------------------------------------------
--  Material
---------------------------------------------------------

---------------------------------------------------------
--  Space
---------------------------------------------------------

---------------------------------------------------------
--  User
---------------------------------------------------------

---------------------------------------------------------
--  Crawler
---------------------------------------------------------

---------------------------------------------------------
--  Reactor
---------------------------------------------------------

