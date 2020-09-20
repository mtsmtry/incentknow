module Incentknow.Api where

import Prelude
import Control.Promise (Promise)
import Data.Argonaut.Core (Json)
import Data.Either (Either(..), either)
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Nullable (Nullable)
import Effect (Effect)
import Effect.Aff (Aff, attempt, never)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Exception (Error)
import Foreign (Foreign)
import Incentknow.Data.Ids (CacheId(..), ChangeId(..), CommitId, ContentId, CrawlerId(..), DraftId(..), FormatId(..), OperationId, SemanticId(..), SnapshotId(..), SpaceId, TaskId(..), UserId(..), WorkId(..))
import Incentknow.Data.Page (ContentPage, CollectionPage)
import Incentknow.Data.Property (PropertyInfo, PropertyInfoImpl)
import Web.File.Blob (Blob)

-- User
type UserSetting
  = { defaultSpaceId :: SpaceId
    }

type Account
  = { userId :: UserId
    , user :: User
    , setting :: UserSetting
    , email :: String
    , emailVerified :: Boolean
    , phoneNumber :: String
    , disabled :: Boolean
    }

type Profile
  = {
    }

type User
  = { userId :: UserId
    , displayName :: String
    , displayId :: String
    , iconUrl :: String
    }

-- Format
type Format
  = { formatId :: FormatId
    , spaceId :: SpaceId
    , displayName :: String
    , displayId :: String
    , description :: String
    , defaultStructureId :: String
    , structure :: Structure
    , creatorUserId :: UserId
    , createdAt :: Number
    , updaterUserId :: UserId
    , updatedAt :: Number
    , contentPage :: ContentPage
    , collectionPage :: CollectionPage
    , semanticId :: Nullable String
    , usage :: String -- social, personal
    , generator :: String -- none, reactor:ID, crawler:ID
    }

type Reactor
  = { spaceId :: SpaceId
    , formatId :: FormatId
    , definitionId :: Nullable ContentId
    }

type Structure
  = { version :: String
    , properties :: Array PropertyInfoImpl
    }

-- Content
type Content
  = { contentId :: ContentId
    , version :: Int
    , structureId :: String
    , formatId :: FormatId
    , format :: Format
    , spaceId :: SpaceId
    , data :: Json
    , creatorUserId :: UserId
    , createdAt :: Number
    , updaterUserId :: UserId
    , updatedAt :: Number
    }

type ContentSemanticData
  = { title :: String
    }

type Work
  = { workId :: WorkId
    , contentId :: Nullable ContentId
    , createdAt :: Number
    , updatedAt :: Number
    , formatId :: FormatId
    , structureId :: String
    , format :: Format
    , spaceId :: Nullable SpaceId
    , data :: Json
    , workingChangeId :: Nullable ChangeId
    , state :: String
    }

type Snapshot
  = { snapshotId :: SnapshotId
    , data :: Json
    , formatId :: FormatId
    , structureId :: String
    , timestamp :: Number
    }

type Change
  = { changeId :: ChangeId
    , createdAt :: Number
    , updatedAt :: Number
    }

type Commit
  = { commitId :: CommitId
    , data :: Json
    , structureId :: String
    , timestamp :: Number
    , userId :: UserId
    , version :: Int
    }

type SpaceAuthority
  = { base :: String
    }

-- Space
type Space
  = { spaceId :: SpaceId
    , displayName :: String
    , displayId :: String
    , description :: String
    , formatCount :: Int
    , memberCount :: Int
    , creatorUserId :: UserId
    , createdAt :: Number
    , published :: Boolean
    , homeUrl :: Nullable String
    , published :: Boolean
    , authority :: SpaceAuthority
    , membershipMethod :: String
    , myStatus :: String -- follow, membership, none
    , myMember :: Nullable SpaceMember
    -- , qualification :: Qualification
    }

type Qualification
  = { type :: String
    , emailDomains :: Nullable (Array String)
    }

type SpaceMember
  = { userId :: UserId
    , spaceId :: SpaceId
    , joinedAt :: Number
    , type :: String
    , user :: User
    }

type SpaceCommitter
  = { userId :: UserId
    , firstCommittedAt :: Number
    , lastCommittedAt :: Number
    , commitCount :: Int
    , contentCount :: Int
    }

type Option
  = { source :: String
    }

type Container
  = { formatId :: FormatId
    , spaceId :: SpaceId
    }

type Crawler
  = { crawlerId :: CrawlerId
    , spaceId :: SpaceId
    , definitionId :: ContentId
    , displayName :: String
    --, formatIds :: Array FormatId
    , updatedAt :: Number
    , updaterUserId :: UserId
    }

type CrawlerOperation
  = { crawlerId :: CrawlerId
    , operationId :: OperationId
    , status :: String
    , createdAt :: Number
    , method :: String
    , executorUserId :: UserId
    , contentCount :: Number
    , fetchingCount :: Number
    , scrapingCount :: Number
    , startedAt :: Nullable Number
    , endedAt :: Nullable Number
    }

type CrawlerTaskOutput
  = { indexes :: Array { taskId :: Nullable String, url :: String, class :: String }
    , contents :: Array { contentId :: ContentId, version :: String }
    }

type CrawlerTask
  = { crawlerId :: CrawlerId
    , operationId :: OperationId
    , taskId :: String
    , url :: String
    , scraperId :: ContentId
    , createdAt :: Number
    , status :: String
    , method :: String
    , cacheId :: String
    , output :: Nullable CrawlerTaskOutput
    , message :: Nullable String
    , startedAt :: Nullable Number
    , endedAt :: Nullable Number
    }

type CrawlerCache
  = { cacheId :: CacheId
    , operationId :: OperationId
    , scraperId :: ContentId
    , crawlerId :: CrawlerId
    , url :: String
    , status :: String
    , timestamp :: Number
    }

foreign import defaultIconUrl :: String

--foreign import getAccount :: {} -> Promise (Nullable Account)
foreign import getCurrentUserId :: Effect (Nullable UserId)

foreign import showError :: Error -> String

-- Snapshot
foreign import onSnapshotWork :: String -> (Nullable Work -> Effect Unit) -> Effect (Effect Unit)

foreign import onSnapshotAccount :: (Nullable Account -> Effect Unit) -> Effect (Effect Unit)

foreign import onSnapshotSpace :: SpaceId -> (Nullable Space -> Effect Unit) -> Effect (Effect Unit)

foreign import onSnapshotContent :: ContentId -> (Content -> Effect Unit) -> Effect (Effect Unit)

foreign import onSnapshotContents :: { spaceId :: SpaceId, formatId :: FormatId } -> (Array Content -> Effect Unit) -> Effect (Effect Unit)

foreign import onSnapshotSnapshots :: WorkId -> ChangeId -> (Array Snapshot -> Effect Unit) -> Effect (Effect Unit)

foreign import onSnapshotCrawlerTasks :: CrawlerId -> OperationId -> ((Array CrawlerTask) -> Effect Unit) -> Effect (Effect Unit)

-- Get
foreign import getContentsByReactor :: { formatId :: FormatId, words :: Nullable String, conditions :: Foreign } -> Promise (Array Content)

foreign import getCrawler :: CrawlerId -> Option -> Promise Crawler

foreign import getReactor :: FormatId -> Option -> Promise Reactor

foreign import getPublishedSpaces :: Option -> Promise (Array Space)

foreign import getFormat :: FormatId -> Option -> Promise Format

foreign import getSpace :: SpaceId -> Option -> Promise Space

foreign import getUser :: UserId -> Option -> Promise User

foreign import getContent :: ContentId -> Option -> Promise Content

foreign import getCrawlers :: SpaceId -> Option -> Promise (Array Crawler)

foreign import getCrawlerOperations :: CrawlerId -> Option -> Promise (Array CrawlerOperation)

foreign import getCrawlerCaches :: CrawlerId -> Option -> Promise (Array CrawlerCache)

foreign import getAllSpaceContents :: SpaceId -> Option -> Promise (Array Content)

-- Snapshotは不変
foreign import getSnapshot :: WorkId -> ChangeId -> SnapshotId -> Promise Snapshot

foreign import getContents :: SpaceId -> FormatId -> Option -> Promise (Array Content)

foreign import getContentsByFormat :: FormatId -> Option -> Promise (Array Content)

foreign import getContentsByQuery :: { formatId :: FormatId, property :: String, contentId :: ContentId } -> Option -> Promise (Array Content)

foreign import getFormats :: SpaceId -> Option -> Promise (Array Format)

foreign import getSpaceCommitters :: SpaceId -> Option -> Promise (Array SpaceCommitter)

foreign import getSpaceMembers :: SpaceId -> Nullable String -> Option -> Promise (Array SpaceMember)

foreign import getSpaceMember :: SpaceId -> UserId -> Option -> Promise SpaceMember

foreign import getFormatStructures :: FormatId -> Option -> Promise (Array Structure)

foreign import getMySpaces :: Option -> Promise (Array Space)

foreign import onLoadContentBySemanticId :: FormatId -> SemanticId -> (Content -> Effect Unit) -> Effect Unit

-- Set Content, Work
foreign import createContent ::
  { data :: Json
  , spaceId :: SpaceId
  , formatId :: FormatId
  , workId :: Nullable WorkId
  } ->
  Promise ContentId

foreign import commitContent ::
  { data :: Json
  , contentId :: ContentId
  , structureId :: String
  } ->
  Promise {}

foreign import writeContentWork :: { contentId :: ContentId, structureId :: String, data :: Json } -> Promise {}

foreign import updateBlankWork :: { workId :: WorkId, spaceId :: Nullable SpaceId, formatId :: FormatId, data :: Json, structureId :: String } -> Promise {}

foreign import createBlankWork :: { spaceId :: Nullable SpaceId, formatId :: FormatId, structureId :: String, data :: Json } -> Promise WorkId

foreign import getMyWorks :: { state :: Nullable String } -> Option -> Promise (Array Work)

foreign import deleteWork :: String -> Promise {}

-- Set Account
foreign import register ::
  { displayName :: String
  , email :: String
  , password :: String
  } ->
  Promise UserId

foreign import login ::
  { email :: String
  , password :: String
  } ->
  Promise {}

foreign import logout :: {} -> Promise {}

-- 使用されない関数はindex.jsに出力されない -- 使用されないと -- exports.getContents = async req => { ... }; -- が、以下のようになる -- req => { ... }; -- そして、asyncではない関数が、awaitは使えないと構文エラーが生じる。 -- Maybe aはnullかaではなく、JustかNothingをにする必要がある
foreign import setMyDisplayName :: String -> Promise {}

foreign import setMyIcon :: Blob -> Promise {}

foreign import setMyPassword :: { oldPassword :: String, newPassword :: String } -> Promise {}

foreign import setMyEmail :: String -> Promise {}

-- Set Space
foreign import createSpace ::
  { displayName :: String
  , displayId :: String
  , description :: String
  } ->
  Promise SpaceId

foreign import setSpaceDisplayName :: SpaceId -> String -> Promise {}

foreign import setSpaceHomeImage :: SpaceId -> Blob -> Promise {}

foreign import setSpacePublished :: SpaceId -> Boolean -> Promise {}

foreign import setSpaceDisplayId :: SpaceId -> String -> Promise {}

foreign import setSpaceAuthority :: SpaceId -> SpaceAuthority -> Promise {}

foreign import checkSpaceDisplayId :: String -> Promise Boolean

foreign import applySpaceMembership :: SpaceId -> Promise {}

foreign import acceptSpaceMembership :: SpaceId -> UserId -> Promise {}

foreign import rejectSpaceMembership :: SpaceId -> UserId -> Promise {}

foreign import cancelSpaceMembershipApplication :: SpaceId -> Promise {}

foreign import setSpaceMembershipMethod :: SpaceId -> String -> Promise {}

-- Set Format
foreign import createFormat ::
  { spaceId :: SpaceId
  , structure :: Array PropertyInfoImpl
  , displayName :: String
  , displayId :: String
  , description :: String
  , usage :: String
  } ->
  Promise FormatId

foreign import setFormatContentPage :: FormatId -> ContentPage -> Promise {}

foreign import setFormatCollectionPage :: FormatId -> CollectionPage -> Promise {}

foreign import setContentGenerator :: FormatId -> String -> Promise {}

foreign import setReactorDefinitionId :: FormatId -> ContentId -> Promise {}

foreign import updateFormatStructure :: FormatId -> Array PropertyInfoImpl -> Promise {}

foreign import createCrawler :: { spaceId :: SpaceId, definitionId :: ContentId, displayName :: String } -> Promise CrawlerId

foreign import runCrawler :: { crawlerId :: CrawlerId, method :: String } -> Promise {}
