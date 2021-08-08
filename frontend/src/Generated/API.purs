
module Incentknow.API where

import Prelude

import Data.Maybe (Maybe)
import Data.Argonaut.Core (Json)
import Control.Promise (Promise)
import Incentknow.Data.Entities as E
import Incentknow.Data.Ids as E
import Incentknow.API.Execution (__queryAPI, __commandAPI, QueryAPI, CommandAPI)


---------------------------------------------------------
--  ContainerService
---------------------------------------------------------



foreign import __getContainers :: 
  E.SpaceId -> Promise (Array E.FocusedContainer)

getContainers :: E.SpaceId -> QueryAPI (Array E.FocusedContainer)
getContainers x0 = __queryAPI "getContainers" $ __getContainers x0



---------------------------------------------------------
--  ContentService
---------------------------------------------------------



foreign import __startContentEditing :: 
  E.ContentId -> Maybe E.ContentCommitId -> Promise E.ContentDraftId

startContentEditing :: E.ContentId -> Maybe E.ContentCommitId -> CommandAPI E.ContentDraftId
startContentEditing x0 x1 = __commandAPI "startContentEditing" $ __startContentEditing x0 x1



foreign import __createNewContentDraft :: 
  E.StructureId -> Maybe E.SpaceId -> Maybe Json -> Promise E.ContentDraftId

createNewContentDraft :: E.StructureId -> Maybe E.SpaceId -> Maybe Json -> CommandAPI E.ContentDraftId
createNewContentDraft x0 x1 x2 = __commandAPI "createNewContentDraft" $ __createNewContentDraft x0 x1 x2



foreign import __editContentDraft :: 
  E.ContentDraftId -> Json -> Promise (Maybe E.RelatedContentRevision)

editContentDraft :: E.ContentDraftId -> Json -> CommandAPI (Maybe E.RelatedContentRevision)
editContentDraft x0 x1 = __commandAPI "editContentDraft" $ __editContentDraft x0 x1



foreign import __commitContent :: 
  E.ContentDraftId -> Json -> Promise {}

commitContent :: E.ContentDraftId -> Json -> CommandAPI {}
commitContent x0 x1 = __commandAPI "commitContent" $ __commitContent x0 x1



foreign import __getContent :: 
  E.ContentId -> Promise E.FocusedContent

getContent :: E.ContentId -> QueryAPI E.FocusedContent
getContent x0 = __queryAPI "getContent" $ __getContent x0



foreign import __getRelatedContent :: 
  E.ContentId -> Promise E.RelatedContent

getRelatedContent :: E.ContentId -> QueryAPI E.RelatedContent
getRelatedContent x0 = __queryAPI "getRelatedContent" $ __getRelatedContent x0



foreign import __getContents :: 
  E.SpaceId -> E.FormatId -> Promise (Array E.RelatedContent)

getContents :: E.SpaceId -> E.FormatId -> QueryAPI (Array E.RelatedContent)
getContents x0 x1 = __queryAPI "getContents" $ __getContents x0 x1



foreign import __getContentsByProperty :: 
  E.SpaceId -> E.FormatId -> E.PropertyId -> String -> Promise (Array E.RelatedContent)

getContentsByProperty :: E.SpaceId -> E.FormatId -> E.PropertyId -> String -> QueryAPI (Array E.RelatedContent)
getContentsByProperty x0 x1 x2 x3 = __queryAPI "getContentsByProperty" $ __getContentsByProperty x0 x1 x2 x3



foreign import __getContentsByDisplayId :: 
  E.SpaceDisplayId -> E.FormatDisplayId -> Promise (Array E.RelatedContent)

getContentsByDisplayId :: E.SpaceDisplayId -> E.FormatDisplayId -> QueryAPI (Array E.RelatedContent)
getContentsByDisplayId x0 x1 = __queryAPI "getContentsByDisplayId" $ __getContentsByDisplayId x0 x1



foreign import __getMyContentDrafts :: 
  Promise (Array E.RelatedContentDraft)

getMyContentDrafts :: QueryAPI (Array E.RelatedContentDraft)
getMyContentDrafts  = __queryAPI "getMyContentDrafts" $ __getMyContentDrafts 



foreign import __getContentDraft :: 
  E.ContentDraftId -> Promise E.FocusedContentDraft

getContentDraft :: E.ContentDraftId -> QueryAPI E.FocusedContentDraft
getContentDraft x0 = __queryAPI "getContentDraft" $ __getContentDraft x0



foreign import __getContentCommits :: 
  E.ContentId -> Promise (Array E.RelatedContentCommit)

getContentCommits :: E.ContentId -> QueryAPI (Array E.RelatedContentCommit)
getContentCommits x0 = __queryAPI "getContentCommits" $ __getContentCommits x0



foreign import __getContentEditingNodes :: 
  E.ContentDraftId -> Promise (Array E.ContentNode)

getContentEditingNodes :: E.ContentDraftId -> QueryAPI (Array E.ContentNode)
getContentEditingNodes x0 = __queryAPI "getContentEditingNodes" $ __getContentEditingNodes x0



foreign import __getContentRevision :: 
  E.ContentWholeRevisionId -> Promise E.FocusedContentRevision

getContentRevision :: E.ContentWholeRevisionId -> QueryAPI E.FocusedContentRevision
getContentRevision x0 = __queryAPI "getContentRevision" $ __getContentRevision x0



foreign import __getContentCommit :: 
  E.ContentCommitId -> Promise E.FocusedContentCommit

getContentCommit :: E.ContentCommitId -> QueryAPI E.FocusedContentCommit
getContentCommit x0 = __queryAPI "getContentCommit" $ __getContentCommit x0



foreign import __getSpaceLatestContents :: 
  E.SpaceId -> Promise (Array E.RelatedContent)

getSpaceLatestContents :: E.SpaceId -> QueryAPI (Array E.RelatedContent)
getSpaceLatestContents x0 = __queryAPI "getSpaceLatestContents" $ __getSpaceLatestContents x0



---------------------------------------------------------
--  FormatService
---------------------------------------------------------



foreign import __createFormat :: 
  { spaceId :: E.SpaceId
  , displayName :: String
  , description :: String
  , usage :: E.FormatUsage
  , properties :: Array E.PropertyInfo
  }
  -> Promise E.FormatDisplayId

createFormat :: 
  { spaceId :: E.SpaceId
  , displayName :: String
  , description :: String
  , usage :: E.FormatUsage
  , properties :: Array E.PropertyInfo
  }
  -> CommandAPI E.FormatDisplayId
createFormat x0 = __commandAPI "createFormat" $ __createFormat x0



foreign import __getFormat :: 
  E.FormatDisplayId -> Promise E.FocusedFormat

getFormat :: E.FormatDisplayId -> QueryAPI E.FocusedFormat
getFormat x0 = __queryAPI "getFormat" $ __getFormat x0



foreign import __getFocusedFormat :: 
  E.FormatId -> Promise E.FocusedFormat

getFocusedFormat :: E.FormatId -> QueryAPI E.FocusedFormat
getFocusedFormat x0 = __queryAPI "getFocusedFormat" $ __getFocusedFormat x0



foreign import __getRelatedFormat :: 
  E.FormatId -> Promise E.RelatedFormat

getRelatedFormat :: E.FormatId -> QueryAPI E.RelatedFormat
getRelatedFormat x0 = __queryAPI "getRelatedFormat" $ __getRelatedFormat x0



foreign import __getFocusedFormatByStructure :: 
  E.StructureId -> Promise E.FocusedFormat

getFocusedFormatByStructure :: E.StructureId -> QueryAPI E.FocusedFormat
getFocusedFormatByStructure x0 = __queryAPI "getFocusedFormatByStructure" $ __getFocusedFormatByStructure x0



foreign import __getRelatedStructure :: 
  E.StructureId -> Promise E.RelatedStructure

getRelatedStructure :: E.StructureId -> QueryAPI E.RelatedStructure
getRelatedStructure x0 = __queryAPI "getRelatedStructure" $ __getRelatedStructure x0



foreign import __getFormats :: 
  E.SpaceId -> Promise (Array E.RelatedFormat)

getFormats :: E.SpaceId -> QueryAPI (Array E.RelatedFormat)
getFormats x0 = __queryAPI "getFormats" $ __getFormats x0



foreign import __getStructures :: 
  E.FormatId -> Promise (Array E.RelatedStructure)

getStructures :: E.FormatId -> QueryAPI (Array E.RelatedStructure)
getStructures x0 = __queryAPI "getStructures" $ __getStructures x0



foreign import __updateFormatStructure :: 
  E.FormatId -> Array E.PropertyInfo -> Promise {}

updateFormatStructure :: E.FormatId -> Array E.PropertyInfo -> CommandAPI {}
updateFormatStructure x0 x1 = __commandAPI "updateFormatStructure" $ __updateFormatStructure x0 x1



foreign import __setFormatDisplayName :: 
  E.FormatId -> String -> Promise {}

setFormatDisplayName :: E.FormatId -> String -> CommandAPI {}
setFormatDisplayName x0 x1 = __commandAPI "setFormatDisplayName" $ __setFormatDisplayName x0 x1



foreign import __setFormatDisplayId :: 
  E.FormatId -> E.FormatDisplayId -> Promise {}

setFormatDisplayId :: E.FormatId -> E.FormatDisplayId -> CommandAPI {}
setFormatDisplayId x0 x1 = __commandAPI "setFormatDisplayId" $ __setFormatDisplayId x0 x1



foreign import __setFormatIcon :: 
  E.FormatId -> Maybe String -> Promise {}

setFormatIcon :: E.FormatId -> Maybe String -> CommandAPI {}
setFormatIcon x0 x1 = __commandAPI "setFormatIcon" $ __setFormatIcon x0 x1



foreign import __getAvailableFormatDisplayId :: 
  E.FormatDisplayId -> Promise Boolean

getAvailableFormatDisplayId :: E.FormatDisplayId -> QueryAPI Boolean
getAvailableFormatDisplayId x0 = __queryAPI "getAvailableFormatDisplayId" $ __getAvailableFormatDisplayId x0



---------------------------------------------------------
--  MaterialService
---------------------------------------------------------



foreign import __startMaterialEditing :: 
  E.MaterialId -> Maybe E.MaterialCommitId -> Promise E.RelatedMaterialDraft

startMaterialEditing :: E.MaterialId -> Maybe E.MaterialCommitId -> CommandAPI E.RelatedMaterialDraft
startMaterialEditing x0 x1 = __commandAPI "startMaterialEditing" $ __startMaterialEditing x0 x1



foreign import __createNewMaterialDraft :: 
  Maybe E.SpaceId -> E.MaterialType -> Maybe E.MaterialData -> Promise E.RelatedMaterialDraft

createNewMaterialDraft :: Maybe E.SpaceId -> E.MaterialType -> Maybe E.MaterialData -> CommandAPI E.RelatedMaterialDraft
createNewMaterialDraft x0 x1 x2 = __commandAPI "createNewMaterialDraft" $ __createNewMaterialDraft x0 x1 x2



foreign import __editMaterialDraft :: 
  E.MaterialDraftId -> E.MaterialData -> Promise (Maybe E.RelatedMaterialRevision)

editMaterialDraft :: E.MaterialDraftId -> E.MaterialData -> CommandAPI (Maybe E.RelatedMaterialRevision)
editMaterialDraft x0 x1 = __commandAPI "editMaterialDraft" $ __editMaterialDraft x0 x1



foreign import __commitMaterial :: 
  E.MaterialDraftId -> E.MaterialData -> Promise E.RelatedMaterialRevision

commitMaterial :: E.MaterialDraftId -> E.MaterialData -> CommandAPI E.RelatedMaterialRevision
commitMaterial x0 x1 = __commandAPI "commitMaterial" $ __commitMaterial x0 x1



foreign import __getMaterial :: 
  E.MaterialId -> Promise E.FocusedMaterial

getMaterial :: E.MaterialId -> QueryAPI E.FocusedMaterial
getMaterial x0 = __queryAPI "getMaterial" $ __getMaterial x0



foreign import __getMyMaterialDrafts :: 
  Promise (Array E.RelatedMaterialDraft)

getMyMaterialDrafts :: QueryAPI (Array E.RelatedMaterialDraft)
getMyMaterialDrafts  = __queryAPI "getMyMaterialDrafts" $ __getMyMaterialDrafts 



foreign import __getMaterialDraft :: 
  E.MaterialDraftId -> Promise E.FocusedMaterialDraft

getMaterialDraft :: E.MaterialDraftId -> QueryAPI E.FocusedMaterialDraft
getMaterialDraft x0 = __queryAPI "getMaterialDraft" $ __getMaterialDraft x0



foreign import __getMaterialCommits :: 
  E.MaterialId -> Promise (Array E.RelatedMaterialCommit)

getMaterialCommits :: E.MaterialId -> QueryAPI (Array E.RelatedMaterialCommit)
getMaterialCommits x0 = __queryAPI "getMaterialCommits" $ __getMaterialCommits x0



foreign import __getMaterialEditingNodes :: 
  E.MaterialDraftId -> Promise (Array E.MaterialNode)

getMaterialEditingNodes :: E.MaterialDraftId -> QueryAPI (Array E.MaterialNode)
getMaterialEditingNodes x0 = __queryAPI "getMaterialEditingNodes" $ __getMaterialEditingNodes x0



foreign import __getMaterialRevision :: 
  E.MaterialRevisionId -> Promise E.FocusedMaterialRevision

getMaterialRevision :: E.MaterialRevisionId -> QueryAPI E.FocusedMaterialRevision
getMaterialRevision x0 = __queryAPI "getMaterialRevision" $ __getMaterialRevision x0



foreign import __getMaterialCommit :: 
  E.MaterialCommitId -> Promise E.FocusedMaterialCommit

getMaterialCommit :: E.MaterialCommitId -> QueryAPI E.FocusedMaterialCommit
getMaterialCommit x0 = __queryAPI "getMaterialCommit" $ __getMaterialCommit x0



---------------------------------------------------------
--  SpaceService
---------------------------------------------------------



foreign import __createSpace :: 
  { displayId :: String
  , displayName :: String
  , description :: String
  }
  -> Promise E.SpaceDisplayId

createSpace :: 
  { displayId :: String
  , displayName :: String
  , description :: String
  }
  -> CommandAPI E.SpaceDisplayId
createSpace x0 = __commandAPI "createSpace" $ __createSpace x0



foreign import __getSpace :: 
  E.SpaceDisplayId -> Promise E.FocusedSpace

getSpace :: E.SpaceDisplayId -> QueryAPI E.FocusedSpace
getSpace x0 = __queryAPI "getSpace" $ __getSpace x0



foreign import __getRelatedSpace :: 
  E.SpaceId -> Promise E.RelatedSpace

getRelatedSpace :: E.SpaceId -> QueryAPI E.RelatedSpace
getRelatedSpace x0 = __queryAPI "getRelatedSpace" $ __getRelatedSpace x0



foreign import __getSpaceMembers :: 
  E.SpaceId -> Promise (Array E.IntactSpaceMember)

getSpaceMembers :: E.SpaceId -> QueryAPI (Array E.IntactSpaceMember)
getSpaceMembers x0 = __queryAPI "getSpaceMembers" $ __getSpaceMembers x0



foreign import __getSpaceMembershipApplications :: 
  E.SpaceId -> Promise (Array E.IntactSpaceMembershipApplication)

getSpaceMembershipApplications :: E.SpaceId -> QueryAPI (Array E.IntactSpaceMembershipApplication)
getSpaceMembershipApplications x0 = __queryAPI "getSpaceMembershipApplications" $ __getSpaceMembershipApplications x0



foreign import __getAvailableSpaceDisplayId :: 
  E.SpaceDisplayId -> Promise Boolean

getAvailableSpaceDisplayId :: E.SpaceDisplayId -> QueryAPI Boolean
getAvailableSpaceDisplayId x0 = __queryAPI "getAvailableSpaceDisplayId" $ __getAvailableSpaceDisplayId x0



foreign import __getCandidateSpaces :: 
  Promise (Array E.RelatedSpace)

getCandidateSpaces :: QueryAPI (Array E.RelatedSpace)
getCandidateSpaces  = __queryAPI "getCandidateSpaces" $ __getCandidateSpaces 



foreign import __getMySpaces :: 
  Promise (Array E.FocusedSpace)

getMySpaces :: QueryAPI (Array E.FocusedSpace)
getMySpaces  = __queryAPI "getMySpaces" $ __getMySpaces 



foreign import __getFollowingSpaces :: 
  Promise (Array E.FocusedSpace)

getFollowingSpaces :: QueryAPI (Array E.FocusedSpace)
getFollowingSpaces  = __queryAPI "getFollowingSpaces" $ __getFollowingSpaces 



foreign import __getPublishedSpaces :: 
  Promise (Array E.FocusedSpace)

getPublishedSpaces :: QueryAPI (Array E.FocusedSpace)
getPublishedSpaces  = __queryAPI "getPublishedSpaces" $ __getPublishedSpaces 



foreign import __applySpaceMembership :: 
  E.SpaceId -> Promise {}

applySpaceMembership :: E.SpaceId -> CommandAPI {}
applySpaceMembership x0 = __commandAPI "applySpaceMembership" $ __applySpaceMembership x0



foreign import __acceptSpaceMembership :: 
  E.SpaceId -> E.UserId -> Promise {}

acceptSpaceMembership :: E.SpaceId -> E.UserId -> CommandAPI {}
acceptSpaceMembership x0 x1 = __commandAPI "acceptSpaceMembership" $ __acceptSpaceMembership x0 x1



foreign import __rejectSpaceMembership :: 
  E.SpaceId -> E.UserId -> Promise {}

rejectSpaceMembership :: E.SpaceId -> E.UserId -> CommandAPI {}
rejectSpaceMembership x0 x1 = __commandAPI "rejectSpaceMembership" $ __rejectSpaceMembership x0 x1



foreign import __cancelSpaceMembershipApplication :: 
  E.SpaceId -> Promise {}

cancelSpaceMembershipApplication :: E.SpaceId -> CommandAPI {}
cancelSpaceMembershipApplication x0 = __commandAPI "cancelSpaceMembershipApplication" $ __cancelSpaceMembershipApplication x0



foreign import __setSpaceMembershipMethod :: 
  E.SpaceId -> E.MembershipMethod -> Promise {}

setSpaceMembershipMethod :: E.SpaceId -> E.MembershipMethod -> CommandAPI {}
setSpaceMembershipMethod x0 x1 = __commandAPI "setSpaceMembershipMethod" $ __setSpaceMembershipMethod x0 x1



foreign import __setSpaceDisplayName :: 
  E.SpaceId -> String -> Promise {}

setSpaceDisplayName :: E.SpaceId -> String -> CommandAPI {}
setSpaceDisplayName x0 x1 = __commandAPI "setSpaceDisplayName" $ __setSpaceDisplayName x0 x1



foreign import __setSpaceDisplayId :: 
  E.SpaceId -> E.SpaceDisplayId -> Promise {}

setSpaceDisplayId :: E.SpaceId -> E.SpaceDisplayId -> CommandAPI {}
setSpaceDisplayId x0 x1 = __commandAPI "setSpaceDisplayId" $ __setSpaceDisplayId x0 x1



foreign import __setSpacePublished :: 
  E.SpaceId -> Boolean -> Promise {}

setSpacePublished :: E.SpaceId -> Boolean -> CommandAPI {}
setSpacePublished x0 x1 = __commandAPI "setSpacePublished" $ __setSpacePublished x0 x1



foreign import __setSpaceDefaultAuthority :: 
  E.SpaceId -> E.SpaceAuth -> Promise {}

setSpaceDefaultAuthority :: E.SpaceId -> E.SpaceAuth -> CommandAPI {}
setSpaceDefaultAuthority x0 x1 = __commandAPI "setSpaceDefaultAuthority" $ __setSpaceDefaultAuthority x0 x1



foreign import __getSpaceContainers :: 
  E.SpaceId -> Promise (Array E.RelatedContainer)

getSpaceContainers :: E.SpaceId -> QueryAPI (Array E.RelatedContainer)
getSpaceContainers x0 = __queryAPI "getSpaceContainers" $ __getSpaceContainers x0



---------------------------------------------------------
--  UserService
---------------------------------------------------------



foreign import __createUser :: 
  { email :: String
  , displayName :: String
  , password :: String
  }
  -> Promise E.UserId

createUser :: 
  { email :: String
  , displayName :: String
  , password :: String
  }
  -> CommandAPI E.UserId
createUser x0 = __commandAPI "createUser" $ __createUser x0



foreign import __getMyUser :: 
  Promise E.FocusedUser

getMyUser :: QueryAPI E.FocusedUser
getMyUser  = __queryAPI "getMyUser" $ __getMyUser 



foreign import __getMyAccount :: 
  Promise E.IntactAccount

getMyAccount :: QueryAPI E.IntactAccount
getMyAccount  = __queryAPI "getMyAccount" $ __getMyAccount 



foreign import __getUser :: 
  E.UserDisplayId -> Promise E.FocusedUser

getUser :: E.UserDisplayId -> QueryAPI E.FocusedUser
getUser x0 = __queryAPI "getUser" $ __getUser x0



foreign import __authenticate :: 
  { email :: String
  , password :: String
  }
  -> Promise E.AuthInfo

authenticate :: 
  { email :: String
  , password :: String
  }
  -> CommandAPI E.AuthInfo
authenticate x0 = __commandAPI "authenticate" $ __authenticate x0



foreign import __getFocusedUser :: 
  E.UserId -> Promise E.FocusedUser

getFocusedUser :: E.UserId -> QueryAPI E.FocusedUser
getFocusedUser x0 = __queryAPI "getFocusedUser" $ __getFocusedUser x0



foreign import __getRelatedUser :: 
  E.UserId -> Promise E.RelatedUser

getRelatedUser :: E.UserId -> QueryAPI E.RelatedUser
getRelatedUser x0 = __queryAPI "getRelatedUser" $ __getRelatedUser x0



foreign import __setMyPassword :: 
  { oldPassword :: String
  , newPassword :: String
  }
  -> Promise {}

setMyPassword :: 
  { oldPassword :: String
  , newPassword :: String
  }
  -> CommandAPI {}
setMyPassword x0 = __commandAPI "setMyPassword" $ __setMyPassword x0



foreign import __setMyDisplayName :: 
  String -> Promise {}

setMyDisplayName :: String -> CommandAPI {}
setMyDisplayName x0 = __commandAPI "setMyDisplayName" $ __setMyDisplayName x0



foreign import __setMyDisplayId :: 
  E.UserDisplayId -> Promise {}

setMyDisplayId :: E.UserDisplayId -> CommandAPI {}
setMyDisplayId x0 = __commandAPI "setMyDisplayId" $ __setMyDisplayId x0



foreign import __setMyEmail :: 
  String -> Promise {}

setMyEmail :: String -> CommandAPI {}
setMyEmail x0 = __commandAPI "setMyEmail" $ __setMyEmail x0



foreign import __setMyIcon :: 
  String -> Promise {}

setMyIcon :: String -> CommandAPI {}
setMyIcon x0 = __commandAPI "setMyIcon" $ __setMyIcon x0



