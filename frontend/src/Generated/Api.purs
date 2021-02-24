
module Incentknow.API where

import Prelude

import Control.Promise (Promise)
import Data.Argonaut.Core (Json)
import Data.Maybe (Maybe)
import Incentknow.API.Execution (CommandAPI, QueryAPI, __commandAPI, __queryAPI)
import Incentknow.Data.Entities as E
import Incentknow.Data.Ids as E


---------------------------------------------------------
--  ContainerService
---------------------------------------------------------

foreign import __getContainers :: 
  E.SpaceId -> Promise (Array E.RelatedContainer)

getContainers :: E.SpaceId -> QueryAPI (Array E.RelatedContainer)
getContainers = __queryAPI "getContainers" <<< __getContainers

---------------------------------------------------------
--  ContentService
---------------------------------------------------------

foreign import __startContentEditing :: 
  E.ContentId -> Maybe E.ContentCommitId -> Promise E.ContentDraftId

startContentEditing :: E.ContentId -> Maybe E.ContentCommitId -> CommandAPI E.ContentDraftId
startContentEditing = __commandAPI "startContentEditing" <<< __startContentEditing

foreign import __createNewContentDraft :: 
  E.StructureId -> Maybe E.SpaceId -> Maybe Json -> Promise E.ContentDraftId

createNewContentDraft :: E.StructureId -> Maybe E.SpaceId -> Maybe Json -> CommandAPI E.ContentDraftId
createNewContentDraft = __commandAPI "createNewContentDraft" <<< __createNewContentDraft

foreign import __editContentDraft :: 
  E.ContentDraftId -> Json -> Promise (Maybe E.RelatedContentRevision)

editContentDraft :: E.ContentDraftId -> Json -> CommandAPI (Maybe E.RelatedContentRevision)
editContentDraft = __commandAPI "editContentDraft" <<< __editContentDraft

foreign import __commitContent :: 
  E.ContentDraftId -> Json -> Promise (Maybe E.RelatedContentCommit)

commitContent :: E.ContentDraftId -> Json -> CommandAPI (Maybe E.RelatedContentCommit)
commitContent = __commandAPI "commitContent" <<< __commitContent

foreign import __getContent :: 
  E.ContentId -> Promise E.FocusedContent

getContent :: E.ContentId -> QueryAPI E.FocusedContent
getContent = __queryAPI "getContent" <<< __getContent

foreign import __getRelatedContent :: 
  E.ContentId -> Promise E.RelatedContent

getRelatedContent :: E.ContentId -> QueryAPI E.RelatedContent
getRelatedContent = __queryAPI "getRelatedContent" <<< __getRelatedContent

foreign import __getContents :: 
  E.SpaceId -> E.FormatId -> Promise (Array E.RelatedContent)

getContents :: E.SpaceId -> E.FormatId -> QueryAPI (Array E.RelatedContent)
getContents = __queryAPI "getContents" <<< __getContents

foreign import __getMyContentDrafts :: 
  Promise (Array E.RelatedContentDraft)

getMyContentDrafts :: QueryAPI (Array E.RelatedContentDraft)
getMyContentDrafts = __queryAPI "getMyContentDrafts" <<< __getMyContentDrafts

foreign import __getContentDraft :: 
  E.ContentDraftId -> Promise E.FocusedContentDraft

getContentDraft :: E.ContentDraftId -> QueryAPI E.FocusedContentDraft
getContentDraft = __queryAPI "getContentDraft" <<< __getContentDraft

foreign import __getContentCommits :: 
  E.ContentId -> Promise (Array E.RelatedContentCommit)

getContentCommits :: E.ContentId -> QueryAPI (Array E.RelatedContentCommit)
getContentCommits = __queryAPI "getContentCommits" <<< __getContentCommits

foreign import __getContentEditingNodes :: 
  E.ContentDraftId -> Promise (Array E.ContentNode)

getContentEditingNodes :: E.ContentDraftId -> QueryAPI (Array E.ContentNode)
getContentEditingNodes = __queryAPI "getContentEditingNodes" <<< __getContentEditingNodes

foreign import __getContentRevision :: 
  E.ContentWholeRevisionId -> Promise E.FocusedContentRevision

getContentRevision :: E.ContentWholeRevisionId -> QueryAPI E.FocusedContentRevision
getContentRevision = __queryAPI "getContentRevision" <<< __getContentRevision

foreign import __getContentCommit :: 
  E.ContentCommitId -> Promise E.FocusedContentCommit

getContentCommit :: E.ContentCommitId -> QueryAPI E.FocusedContentCommit
getContentCommit = __queryAPI "getContentCommit" <<< __getContentCommit

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
createFormat = __commandAPI "createFormat" <<< __createFormat

foreign import __getFormat :: 
  E.FormatDisplayId -> Promise E.FocusedFormat

getFormat :: E.FormatDisplayId -> QueryAPI E.FocusedFormat
getFormat = __queryAPI "getFormat" <<< __getFormat

foreign import __getFocusedFormat :: 
  E.FormatId -> Promise E.FocusedFormat

getFocusedFormat :: E.FormatId -> QueryAPI E.FocusedFormat
getFocusedFormat = __queryAPI "getFocusedFormat" <<< __getFocusedFormat

foreign import __getRelatedFormat :: 
  E.FormatId -> Promise E.RelatedFormat

getRelatedFormat :: E.FormatId -> QueryAPI E.RelatedFormat
getRelatedFormat = __queryAPI "getRelatedFormat" <<< __getRelatedFormat

foreign import __getFormats :: 
  E.SpaceId -> Promise (Array E.RelatedFormat)

getFormats :: E.SpaceId -> QueryAPI (Array E.RelatedFormat)
getFormats = __queryAPI "getFormats" <<< __getFormats

foreign import __getStructures :: 
  E.FormatId -> Promise (Array E.RelatedStructure)

getStructures :: E.FormatId -> QueryAPI (Array E.RelatedStructure)
getStructures = __queryAPI "getStructures" <<< __getStructures

foreign import __updateFormatStructure :: 
  E.FormatId -> Array E.PropertyInfo -> Promise {}

updateFormatStructure :: E.FormatId -> Array E.PropertyInfo -> CommandAPI {}
updateFormatStructure = __commandAPI "updateFormatStructure" <<< __updateFormatStructure

---------------------------------------------------------
--  MaterialService
---------------------------------------------------------

foreign import __startMaterialEditing :: 
  E.MaterialId -> Maybe E.MaterialCommitId -> Promise E.RelatedMaterialDraft

startMaterialEditing :: E.MaterialId -> Maybe E.MaterialCommitId -> CommandAPI E.RelatedMaterialDraft
startMaterialEditing = __commandAPI "startMaterialEditing" <<< __startMaterialEditing

foreign import __startBlankMaterialEditing :: 
  E.SpaceId -> E.MaterialType -> Promise E.RelatedMaterialDraft

startBlankMaterialEditing :: E.SpaceId -> E.MaterialType -> CommandAPI E.RelatedMaterialDraft
startBlankMaterialEditing = __commandAPI "startBlankMaterialEditing" <<< __startBlankMaterialEditing

foreign import __editMaterialDraft :: 
  E.MaterialDraftId -> String -> Promise (Maybe E.RelatedMaterialRevision)

editMaterialDraft :: E.MaterialDraftId -> String -> CommandAPI (Maybe E.RelatedMaterialRevision)
editMaterialDraft = __commandAPI "editMaterialDraft" <<< __editMaterialDraft

foreign import __commitMaterial :: 
  E.MaterialDraftId -> Promise E.RelatedMaterialRevision

commitMaterial :: E.MaterialDraftId -> CommandAPI E.RelatedMaterialRevision
commitMaterial = __commandAPI "commitMaterial" <<< __commitMaterial

foreign import __getMaterial :: 
  E.MaterialId -> Promise E.FocusedMaterial

getMaterial :: E.MaterialId -> QueryAPI E.FocusedMaterial
getMaterial = __queryAPI "getMaterial" <<< __getMaterial

foreign import __getMyMaterialDrafts :: 
  Promise (Array E.RelatedMaterialDraft)

getMyMaterialDrafts :: QueryAPI (Array E.RelatedMaterialDraft)
getMyMaterialDrafts = __queryAPI "getMyMaterialDrafts" <<< __getMyMaterialDrafts

foreign import __getMaterialDraft :: 
  E.MaterialDraftId -> Promise E.FocusedMaterialDraft

getMaterialDraft :: E.MaterialDraftId -> QueryAPI E.FocusedMaterialDraft
getMaterialDraft = __queryAPI "getMaterialDraft" <<< __getMaterialDraft

foreign import __getMaterialCommits :: 
  E.MaterialId -> Promise (Array E.RelatedMaterialCommit)

getMaterialCommits :: E.MaterialId -> QueryAPI (Array E.RelatedMaterialCommit)
getMaterialCommits = __queryAPI "getMaterialCommits" <<< __getMaterialCommits

foreign import __getMaterialEditingNodes :: 
  E.MaterialDraftId -> Promise (Array E.MaterialNode)

getMaterialEditingNodes :: E.MaterialDraftId -> QueryAPI (Array E.MaterialNode)
getMaterialEditingNodes = __queryAPI "getMaterialEditingNodes" <<< __getMaterialEditingNodes

foreign import __getMaterialRevision :: 
  E.MaterialRevisionId -> Promise E.FocusedMaterialRevision

getMaterialRevision :: E.MaterialRevisionId -> QueryAPI E.FocusedMaterialRevision
getMaterialRevision = __queryAPI "getMaterialRevision" <<< __getMaterialRevision

foreign import __getMaterialCommit :: 
  E.MaterialCommitId -> Promise E.FocusedMaterialCommit

getMaterialCommit :: E.MaterialCommitId -> QueryAPI E.FocusedMaterialCommit
getMaterialCommit = __queryAPI "getMaterialCommit" <<< __getMaterialCommit

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
createSpace = __commandAPI "createSpace" <<< __createSpace

foreign import __getSpace :: 
  E.SpaceDisplayId -> Promise E.FocusedSpace

getSpace :: E.SpaceDisplayId -> QueryAPI E.FocusedSpace
getSpace = __queryAPI "getSpace" <<< __getSpace

foreign import __getMySpaces :: 
  Promise (Array E.RelatedSpace)

getMySpaces :: QueryAPI (Array E.RelatedSpace)
getMySpaces = __queryAPI "getMySpaces" <<< __getMySpaces

foreign import __getRelatedSpace :: 
  E.SpaceId -> Promise E.RelatedSpace

getRelatedSpace :: E.SpaceId -> QueryAPI E.RelatedSpace
getRelatedSpace = __queryAPI "getRelatedSpace" <<< __getRelatedSpace

foreign import __getSpaceMembers :: 
  E.SpaceId -> Promise (Array E.IntactSpaceMember)

getSpaceMembers :: E.SpaceId -> QueryAPI (Array E.IntactSpaceMember)
getSpaceMembers = __queryAPI "getSpaceMembers" <<< __getSpaceMembers

foreign import __getSpaceMembershipApplications :: 
  E.SpaceId -> Promise (Array E.IntactSpaceMembershipApplication)

getSpaceMembershipApplications :: E.SpaceId -> QueryAPI (Array E.IntactSpaceMembershipApplication)
getSpaceMembershipApplications = __queryAPI "getSpaceMembershipApplications" <<< __getSpaceMembershipApplications

foreign import __getAvailableSpaceDisplayId :: 
  E.SpaceDisplayId -> Promise Boolean

getAvailableSpaceDisplayId :: E.SpaceDisplayId -> QueryAPI Boolean
getAvailableSpaceDisplayId = __queryAPI "getAvailableSpaceDisplayId" <<< __getAvailableSpaceDisplayId

foreign import __getFollowingSpaces :: 
  Promise (Array E.RelatedSpace)

getFollowingSpaces :: QueryAPI (Array E.RelatedSpace)
getFollowingSpaces = __queryAPI "getFollowingSpaces" <<< __getFollowingSpaces

foreign import __getPublishedSpaces :: 
  Promise (Array E.RelatedSpace)

getPublishedSpaces :: QueryAPI (Array E.RelatedSpace)
getPublishedSpaces = __queryAPI "getPublishedSpaces" <<< __getPublishedSpaces

foreign import __applySpaceMembership :: 
  E.SpaceId -> Promise {}

applySpaceMembership :: E.SpaceId -> CommandAPI {}
applySpaceMembership = __commandAPI "applySpaceMembership" <<< __applySpaceMembership

foreign import __acceptSpaceMembership :: 
  E.SpaceId -> E.UserId -> Promise {}

acceptSpaceMembership :: E.SpaceId -> E.UserId -> CommandAPI {}
acceptSpaceMembership = __commandAPI "acceptSpaceMembership" <<< __acceptSpaceMembership

foreign import __rejectSpaceMembership :: 
  E.SpaceId -> E.UserId -> Promise {}

rejectSpaceMembership :: E.SpaceId -> E.UserId -> CommandAPI {}
rejectSpaceMembership = __commandAPI "rejectSpaceMembership" <<< __rejectSpaceMembership

foreign import __cancelSpaceMembershipApplication :: 
  E.SpaceId -> Promise {}

cancelSpaceMembershipApplication :: E.SpaceId -> CommandAPI {}
cancelSpaceMembershipApplication = __commandAPI "cancelSpaceMembershipApplication" <<< __cancelSpaceMembershipApplication

foreign import __setSpaceMembershipMethod :: 
  E.SpaceId -> E.MembershipMethod -> Promise {}

setSpaceMembershipMethod :: E.SpaceId -> E.MembershipMethod -> CommandAPI {}
setSpaceMembershipMethod = __commandAPI "setSpaceMembershipMethod" <<< __setSpaceMembershipMethod

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
createUser = __commandAPI "createUser" <<< __createUser

foreign import __getMyUser :: 
  Promise E.FocusedUser

getMyUser :: QueryAPI E.FocusedUser
getMyUser = __queryAPI "getMyUser" <<< __getMyUser

foreign import __getMyAccount :: 
  Promise E.IntactAccount

getMyAccount :: QueryAPI E.IntactAccount
getMyAccount = __queryAPI "getMyAccount" <<< __getMyAccount

foreign import __getUser :: 
  E.UserDisplayId -> Promise E.FocusedUser

getUser :: E.UserDisplayId -> QueryAPI E.FocusedUser
getUser = __queryAPI "getUser" <<< __getUser

foreign import __authenticate :: 
  { email :: String
  , password :: String
  }
  -> Promise String

authenticate :: 
  { email :: String
  , password :: String
  }
  -> CommandAPI String
authenticate = __commandAPI "authenticate" <<< __authenticate

foreign import __getFocusedUser :: 
  E.UserId -> Promise E.FocusedUser

getFocusedUser :: E.UserId -> QueryAPI E.FocusedUser
getFocusedUser = __queryAPI "getFocusedUser" <<< __getFocusedUser

foreign import __getRelatedUser :: 
  E.UserId -> Promise E.RelatedUser

getRelatedUser :: E.UserId -> QueryAPI E.RelatedUser
getRelatedUser = __queryAPI "getRelatedUser" <<< __getRelatedUser

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
setMyPassword = __commandAPI "setMyPassword" <<< __setMyPassword

foreign import __setMyDisplayName :: 
  String -> Promise {}

setMyDisplayName :: String -> CommandAPI {}
setMyDisplayName = __commandAPI "setMyDisplayName" <<< __setMyDisplayName

foreign import __setMyDisplayId :: 
  E.UserDisplayId -> Promise {}

setMyDisplayId :: E.UserDisplayId -> CommandAPI {}
setMyDisplayId = __commandAPI "setMyDisplayId" <<< __setMyDisplayId

foreign import __setMyEmail :: 
  String -> Promise {}

setMyEmail :: String -> CommandAPI {}
setMyEmail = __commandAPI "setMyEmail" <<< __setMyEmail

foreign import __setMyIcon :: 
  String -> Promise {}

setMyIcon :: String -> CommandAPI {}
setMyIcon = __commandAPI "setMyIcon" <<< __setMyIcon

