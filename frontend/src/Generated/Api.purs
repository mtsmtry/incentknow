
module Incentknow.Api where

import Prelude

import Data.Maybe (Maybe)
import Data.Argonaut.Core (Json)
import Control.Promise (Promise)
import Incentknow.Data.Entities as E
import Incentknow.Data.Ids as E


---------------------------------------------------------
--  Container
---------------------------------------------------------

foreign import getContents :: 
  E.SpaceId -> E.FormatId -> Promise (Array E.RelatedContent)

---------------------------------------------------------
--  Content
---------------------------------------------------------

foreign import startContentEditing :: 
  E.ContentId -> Maybe E.ContentCommitId -> Promise E.RelatedContentDraft

foreign import startBlankContentEditing :: 
  E.SpaceId -> String -> E.MaterialType -> Promise E.RelatedContentDraft

foreign import editContent :: 
  E.ContentDraftId -> Json -> Promise (Maybe E.RelatedContentSnapshot)

foreign import commitContent :: 
  E.ContentDraftId -> Json -> Promise (Maybe E.RelatedContentCommit)

foreign import getContent :: 
  E.ContentId -> Promise E.FocusedContent

foreign import getRelatedContent :: 
  E.ContentId -> Promise E.RelatedContent

foreign import getMyContentDrafts :: 
  Promise (Array E.RelatedContentDraft)

foreign import getContentDraft :: 
  E.ContentDraftId -> Promise E.FocusedContentDraft

foreign import getContentCommits :: 
  E.ContentId -> Promise (Array E.RelatedContentCommit)

foreign import getContentEditingNodes :: 
  E.ContentDraftId -> Promise (Array E.ContentNode)

foreign import getContentSnapshot :: 
  E.ContentSnapshotId -> Promise E.FocusedContentSnapshot

foreign import getContentCommit :: 
  E.ContentCommitId -> Promise E.FocusedContentSnapshot

---------------------------------------------------------
--  Format
---------------------------------------------------------

foreign import createFormat :: 
  { spaceId :: E.SpaceId
  , displayName :: String
  , description :: String
  , usage :: E.FormatUsage
  , properties :: Array E.PropertyInfo
  }
  -> Promise E.RelatedFormat

foreign import getFormat :: 
  E.FormatDisplayId -> Promise E.FocusedFormat

foreign import getFocusedFormat :: 
  E.FormatId -> Promise E.FocusedFormat

foreign import getRelatedFormat :: 
  E.FormatId -> Promise E.RelatedFormat

foreign import getFormats :: 
  E.SpaceId -> Promise (Array E.RelatedFormat)

foreign import updateFormatStructure :: 
  E.FormatId -> Array E.PropertyInfo -> Promise {}

---------------------------------------------------------
--  Material
---------------------------------------------------------

foreign import startMaterialEditing :: 
  E.MaterialId -> Maybe E.MaterialCommitId -> Promise E.RelatedMaterialDraft

foreign import startBlankMaterialEditing :: 
  E.SpaceId -> String -> E.MaterialType -> Promise E.RelatedMaterialDraft

foreign import editMaterial :: 
  E.MaterialDraftId -> String -> Promise (Maybe E.RelatedMaterialSnapshot)

foreign import commitMaterial :: 
  E.MaterialDraftId -> String -> Promise (Maybe E.RelatedMaterialCommit)

foreign import getMaterial :: 
  E.MaterialId -> Promise E.FocusedMaterial

foreign import getMyMaterialDrafts :: 
  Promise (Array E.RelatedMaterialDraft)

foreign import getMaterialDraft :: 
  E.MaterialDraftId -> Promise E.FocusedMaterialDraft

foreign import getMaterialCommits :: 
  E.MaterialId -> Promise (Array E.RelatedMaterialCommit)

foreign import getMaterialEditingNodes :: 
  E.MaterialDraftId -> Promise (Array E.MaterialNode)

foreign import getMaterialSnapshot :: 
  E.MaterialSnapshotId -> Promise E.FocusedMaterialSnapshot

foreign import getMaterialCommit :: 
  E.MaterialCommitId -> Promise E.FocusedMaterialCommit

---------------------------------------------------------
--  Space
---------------------------------------------------------

foreign import createSpace :: 
  { displayId :: String
  , displayName :: String
  , description :: String
  }
  -> Promise E.FocusedSpace

foreign import getSpace :: 
  E.SpaceDisplayId -> Promise E.FocusedSpace

foreign import getRelatedSpace :: 
  E.SpaceId -> Promise E.RelatedSpace

foreign import getSpaceMembers :: 
  E.SpaceId -> Promise (Array E.IntactSpaceMember)

foreign import getSpaceMembershipApplications :: 
  E.SpaceId -> Promise (Array E.IntactSpaceMembershipApplication)

foreign import checkSpaceDisplayId :: 
  E.SpaceDisplayId -> Promise Boolean

foreign import getMySpaces :: 
  Promise (Array E.RelatedSpace)

foreign import getPublishedSpaces :: 
  Promise (Array E.RelatedSpace)

foreign import setSpaceDisplayId :: 
  E.SpaceId -> E.SpaceDisplayId -> Promise {}

foreign import setSpaceDisplayName :: 
  E.SpaceId -> String -> Promise {}

foreign import setSpaceAuthority :: 
  E.SpaceId -> E.SpaceAuth -> Promise {}

foreign import setSpacePublished :: 
  E.SpaceId -> Boolean -> Promise {}

foreign import applySpaceMembership :: 
  E.SpaceId -> Promise {}

foreign import acceptSpaceMembership :: 
  E.SpaceId -> E.UserId -> Promise {}

foreign import rejectSpaceMembership :: 
  E.SpaceId -> E.UserId -> Promise {}

foreign import cancelSpaceMembershipApplication :: 
  E.SpaceId -> Promise {}

foreign import setSpaceMembershipMethod :: 
  E.SpaceId -> E.MembershipMethod -> Promise {}

---------------------------------------------------------
--  User
---------------------------------------------------------

foreign import createUser :: 
  { email :: String
  , displayName :: String
  , password :: String
  }
  -> Promise E.FocusedUser

foreign import getMyUser :: 
  Promise E.FocusedUser

foreign import getMyAccount :: 
  Promise E.IntactAccount

foreign import getUser :: 
  E.UserDisplayId -> Promise E.FocusedUser

foreign import authenticate :: 
  { email :: String
  , password :: String
  }
  -> Promise String

foreign import getFocusedUser :: 
  E.UserId -> Promise E.FocusedUser

foreign import getRelatedUser :: 
  E.UserId -> Promise E.RelatedUser

foreign import setMyDisplayName :: 
  String -> Promise {}

foreign import setMyDisplayId :: 
  E.UserDisplayId -> Promise {}

foreign import setMyPassword :: 
  { oldPassword :: String
  , newPassword :: String
  }
  -> Promise {}

foreign import setMyEmail :: 
  String -> Promise {}

foreign import setMyIcon :: 
  String -> Promise {}

---------------------------------------------------------
--  Crawler
---------------------------------------------------------

foreign import createCrawler :: 
  E.SpaceId -> E.ContentId -> String -> Promise E.IntactCrawler

foreign import getCrawlers :: 
  E.SpaceId -> Promise (Array E.IntactCrawler)

foreign import getCrawler :: 
  E.CrawlerId -> Promise E.IntactCrawler

foreign import runCrawler :: 
  E.CrawlerId -> E.CrawlerOperationMethod -> Promise {}

foreign import beginCrawlingTask :: 
  E.CrawlerTaskId -> Promise {}

foreign import completeCrawlingTask :: 
  E.CrawlerTaskId -> E.CrawlerTaskOutput -> Promise {}

foreign import failedCrawlingTask :: 
  { taskId :: E.CrawlerTaskId
  , phase :: String
  , message :: String
  }
  -> Promise {}

---------------------------------------------------------
--  Reactor
---------------------------------------------------------

foreign import getReactor :: 
  E.ReactorId -> Promise E.IntactReactor

foreign import setReactorDefinitionId :: 
  E.ReactorId -> E.ContentId -> Promise {}

