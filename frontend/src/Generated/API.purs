
module Incentknow.API where

import Prelude

import Data.Maybe (Maybe)
import Data.Argonaut.Core (Json)
import Web.File.Blob (Blob)
import Control.Promise (Promise)
import Incentknow.Data.Entities as E
import Incentknow.Data.Ids as E
import Incentknow.API.Execution (__queryAPI, __commandAPI, QueryAPI, CommandAPI)


foreign import apiEndpoint :: String

foreign import fromJsonToRelatedContainer :: Json -> E.RelatedContainer
foreign import fromRelatedContainerToJson :: E.RelatedContainer -> Json


foreign import fromJsonToAdditionalContainerInfo :: Json -> E.AdditionalContainerInfo
foreign import fromAdditionalContainerInfoToJson :: E.AdditionalContainerInfo -> Json


foreign import fromJsonToFocusedContainer :: Json -> E.FocusedContainer
foreign import fromFocusedContainerToJson :: E.FocusedContainer -> Json


foreign import fromJsonToRelatedContent :: Json -> E.RelatedContent
foreign import fromRelatedContentToJson :: E.RelatedContent -> Json


foreign import fromJsonToFocusedContent :: Json -> E.FocusedContent
foreign import fromFocusedContentToJson :: E.FocusedContent -> Json


foreign import fromJsonToContentRelation :: Json -> E.ContentRelation
foreign import fromContentRelationToJson :: E.ContentRelation -> Json


foreign import fromJsonToSearchedContent :: Json -> E.SearchedContent
foreign import fromSearchedContentToJson :: E.SearchedContent -> Json


foreign import fromJsonToIntactContentPage :: Json -> E.IntactContentPage
foreign import fromIntactContentPageToJson :: E.IntactContentPage -> Json


foreign import fromJsonToRelatedContentCommit :: Json -> E.RelatedContentCommit
foreign import fromRelatedContentCommitToJson :: E.RelatedContentCommit -> Json


foreign import fromJsonToFocusedContentCommit :: Json -> E.FocusedContentCommit
foreign import fromFocusedContentCommitToJson :: E.FocusedContentCommit -> Json


foreign import fromJsonToRelatedContentDraft :: Json -> E.RelatedContentDraft
foreign import fromRelatedContentDraftToJson :: E.RelatedContentDraft -> Json


foreign import fromJsonToFocusedContentDraft :: Json -> E.FocusedContentDraft
foreign import fromFocusedContentDraftToJson :: E.FocusedContentDraft -> Json


foreign import fromJsonToRelatedFormat :: Json -> E.RelatedFormat
foreign import fromRelatedFormatToJson :: E.RelatedFormat -> Json


foreign import fromJsonToRelation :: Json -> E.Relation
foreign import fromRelationToJson :: E.Relation -> Json


foreign import fromJsonToFocusedFormat :: Json -> E.FocusedFormat
foreign import fromFocusedFormatToJson :: E.FocusedFormat -> Json


foreign import fromJsonToIntactMetaProperty :: Json -> E.IntactMetaProperty
foreign import fromIntactMetaPropertyToJson :: E.IntactMetaProperty -> Json


foreign import fromJsonToPropertyInfo :: Json -> E.PropertyInfo
foreign import fromPropertyInfoToJson :: E.PropertyInfo -> Json


foreign import fromJsonToEnumerator :: Json -> E.Enumerator
foreign import fromEnumeratorToJson :: E.Enumerator -> Json


foreign import fromJsonToRelatedStructure :: Json -> E.RelatedStructure
foreign import fromRelatedStructureToJson :: E.RelatedStructure -> Json


foreign import fromJsonToFocusedStructure :: Json -> E.FocusedStructure
foreign import fromFocusedStructureToJson :: E.FocusedStructure -> Json


foreign import fromJsonToDocumentBlock :: Json -> E.DocumentBlock
foreign import fromDocumentBlockToJson :: E.DocumentBlock -> Json


foreign import fromJsonToDocument :: Json -> E.Document
foreign import fromDocumentToJson :: E.Document -> Json


foreign import fromJsonToRelatedMaterial :: Json -> E.RelatedMaterial
foreign import fromRelatedMaterialToJson :: E.RelatedMaterial -> Json


foreign import fromJsonToFocusedMaterial :: Json -> E.FocusedMaterial
foreign import fromFocusedMaterialToJson :: E.FocusedMaterial -> Json


foreign import fromJsonToRelatedMaterialCommit :: Json -> E.RelatedMaterialCommit
foreign import fromRelatedMaterialCommitToJson :: E.RelatedMaterialCommit -> Json


foreign import fromJsonToFocusedMaterialCommit :: Json -> E.FocusedMaterialCommit
foreign import fromFocusedMaterialCommitToJson :: E.FocusedMaterialCommit -> Json


foreign import fromJsonToRelatedMaterialDraft :: Json -> E.RelatedMaterialDraft
foreign import fromRelatedMaterialDraftToJson :: E.RelatedMaterialDraft -> Json


foreign import fromJsonToFocusedMaterialDraft :: Json -> E.FocusedMaterialDraft
foreign import fromFocusedMaterialDraftToJson :: E.FocusedMaterialDraft -> Json


foreign import fromJsonToMaterialDraftUpdation :: Json -> E.MaterialDraftUpdation
foreign import fromMaterialDraftUpdationToJson :: E.MaterialDraftUpdation -> Json


foreign import fromJsonToIntactMaterialEditing :: Json -> E.IntactMaterialEditing
foreign import fromIntactMaterialEditingToJson :: E.IntactMaterialEditing -> Json


foreign import fromJsonToRelatedMaterialSnapshot :: Json -> E.RelatedMaterialSnapshot
foreign import fromRelatedMaterialSnapshotToJson :: E.RelatedMaterialSnapshot -> Json


foreign import fromJsonToFocusedMaterialSnapshot :: Json -> E.FocusedMaterialSnapshot
foreign import fromFocusedMaterialSnapshotToJson :: E.FocusedMaterialSnapshot -> Json


foreign import fromJsonToIntactActivityBySpace :: Json -> E.IntactActivityBySpace
foreign import fromIntactActivityBySpaceToJson :: E.IntactActivityBySpace -> Json


foreign import fromJsonToIntactActivityByUser :: Json -> E.IntactActivityByUser
foreign import fromIntactActivityByUserToJson :: E.IntactActivityByUser -> Json


foreign import fromJsonToRelatedComment :: Json -> E.RelatedComment
foreign import fromRelatedCommentToJson :: E.RelatedComment -> Json


foreign import fromJsonToFocusedComment :: Json -> E.FocusedComment
foreign import fromFocusedCommentToJson :: E.FocusedComment -> Json


foreign import fromJsonToFocusedTreeComment :: Json -> E.FocusedTreeComment
foreign import fromFocusedTreeCommentToJson :: E.FocusedTreeComment -> Json


foreign import fromJsonToIntactNotification :: Json -> E.IntactNotification
foreign import fromIntactNotificationToJson :: E.IntactNotification -> Json


foreign import fromJsonToIntactReactor :: Json -> E.IntactReactor
foreign import fromIntactReactorToJson :: E.IntactReactor -> Json


foreign import fromJsonToAdditionalSpaceInfo :: Json -> E.AdditionalSpaceInfo
foreign import fromAdditionalSpaceInfoToJson :: E.AdditionalSpaceInfo -> Json


foreign import fromJsonToRelatedSpace :: Json -> E.RelatedSpace
foreign import fromRelatedSpaceToJson :: E.RelatedSpace -> Json


foreign import fromJsonToFocusedSpace :: Json -> E.FocusedSpace
foreign import fromFocusedSpaceToJson :: E.FocusedSpace -> Json


foreign import fromJsonToIntactSpageHomePage :: Json -> E.IntactSpageHomePage
foreign import fromIntactSpageHomePageToJson :: E.IntactSpageHomePage -> Json


foreign import fromJsonToIntactSpaceMember :: Json -> E.IntactSpaceMember
foreign import fromIntactSpaceMemberToJson :: E.IntactSpaceMember -> Json


foreign import fromJsonToIntactSpaceMembershipApplication :: Json -> E.IntactSpaceMembershipApplication
foreign import fromIntactSpaceMembershipApplicationToJson :: E.IntactSpaceMembershipApplication -> Json


foreign import fromJsonToIntactAccount :: Json -> E.IntactAccount
foreign import fromIntactAccountToJson :: E.IntactAccount -> Json


foreign import fromJsonToRelatedUser :: Json -> E.RelatedUser
foreign import fromRelatedUserToJson :: E.RelatedUser -> Json


foreign import fromJsonToFocusedUser :: Json -> E.FocusedUser
foreign import fromFocusedUserToJson :: E.FocusedUser -> Json


foreign import fromJsonToAuthInfo :: Json -> E.AuthInfo
foreign import fromAuthInfoToJson :: E.AuthInfo -> Json


---------------------------------------------------------
--  ContainerService
---------------------------------------------------------



foreign import __getContainers :: 
  E.SpaceId -> Promise (Array E.FocusedContainer)

getContainers :: E.SpaceId -> QueryAPI (Array E.FocusedContainer)
getContainers x0 = __queryAPI "getContainers" $ __getContainers x0



---------------------------------------------------------
--  ContentAPIService
---------------------------------------------------------



foreign import __upsertContents :: 
  { email :: String, password :: String, space :: E.SpaceDisplayId, format :: E.FormatDisplayId, formatVersion :: Maybe Number, data :: Array Json } -> Promise {}

upsertContents :: { email :: String, password :: String, space :: E.SpaceDisplayId, format :: E.FormatDisplayId, formatVersion :: Maybe Number, data :: Array Json } -> CommandAPI {}
upsertContents x0 = __commandAPI "upsertContents" $ __upsertContents x0



---------------------------------------------------------
--  ContentService
---------------------------------------------------------



foreign import __startContentEditing :: 
  E.ContentId -> Maybe E.ContentCommitId -> Promise E.ContentDraftId

startContentEditing :: E.ContentId -> Maybe E.ContentCommitId -> CommandAPI E.ContentDraftId
startContentEditing x0 x1 = __commandAPI "startContentEditing" $ __startContentEditing x0 x1



foreign import __createNewContentDraft :: 
  E.StructureId -> Maybe E.SpaceId -> Json -> Promise E.ContentDraftId

createNewContentDraft :: E.StructureId -> Maybe E.SpaceId -> Json -> CommandAPI E.ContentDraftId
createNewContentDraft x0 x1 x2 = __commandAPI "createNewContentDraft" $ __createNewContentDraft x0 x1 x2



foreign import __editContentDraft :: 
  E.ContentDraftId -> Json -> Array E.MaterialDraftUpdation -> Promise {}

editContentDraft :: E.ContentDraftId -> Json -> Array E.MaterialDraftUpdation -> CommandAPI {}
editContentDraft x0 x1 x2 = __commandAPI "editContentDraft" $ __editContentDraft x0 x1 x2



foreign import __commitContent :: 
  E.ContentDraftId -> Json -> Array E.MaterialDraftUpdation -> Promise E.ContentId

commitContent :: E.ContentDraftId -> Json -> Array E.MaterialDraftUpdation -> CommandAPI E.ContentId
commitContent x0 x1 x2 = __commandAPI "commitContent" $ __commitContent x0 x1 x2



foreign import __getContent :: 
  E.ContentId -> Promise E.FocusedContent

getContent :: E.ContentId -> QueryAPI E.FocusedContent
getContent x0 = __queryAPI "getContent" $ __getContent x0



foreign import __getContentPage :: 
  E.ContentId -> Promise E.IntactContentPage

getContentPage :: E.ContentId -> QueryAPI E.IntactContentPage
getContentPage x0 = __queryAPI "getContentPage" $ __getContentPage x0



foreign import __getRelatedContent :: 
  E.ContentId -> Promise E.RelatedContent

getRelatedContent :: E.ContentId -> QueryAPI E.RelatedContent
getRelatedContent x0 = __queryAPI "getRelatedContent" $ __getRelatedContent x0



foreign import __getContents :: 
  E.SpaceId -> E.FormatId -> Promise (Array E.RelatedContent)

getContents :: E.SpaceId -> E.FormatId -> QueryAPI (Array E.RelatedContent)
getContents x0 x1 = __queryAPI "getContents" $ __getContents x0 x1



foreign import __getContentsByDisplayId :: 
  E.SpaceDisplayId -> E.FormatDisplayId -> Promise (Array E.RelatedContent)

getContentsByDisplayId :: E.SpaceDisplayId -> E.FormatDisplayId -> QueryAPI (Array E.RelatedContent)
getContentsByDisplayId x0 x1 = __queryAPI "getContentsByDisplayId" $ __getContentsByDisplayId x0 x1



foreign import __getFocusedContentsByDisplayId :: 
  E.SpaceDisplayId -> E.FormatDisplayId -> Promise (Array E.FocusedContent)

getFocusedContentsByDisplayId :: E.SpaceDisplayId -> E.FormatDisplayId -> QueryAPI (Array E.FocusedContent)
getFocusedContentsByDisplayId x0 x1 = __queryAPI "getFocusedContentsByDisplayId" $ __getFocusedContentsByDisplayId x0 x1



foreign import __getMyContentDrafts :: 
  Unit -> Promise (Array E.RelatedContentDraft)

getMyContentDrafts :: Unit -> QueryAPI (Array E.RelatedContentDraft)
getMyContentDrafts x0 = __queryAPI "getMyContentDrafts" $ __getMyContentDrafts x0



foreign import __getContentDraft :: 
  E.ContentDraftId -> Promise E.FocusedContentDraft

getContentDraft :: E.ContentDraftId -> QueryAPI E.FocusedContentDraft
getContentDraft x0 = __queryAPI "getContentDraft" $ __getContentDraft x0



foreign import __cancelContentDraft :: 
  E.ContentDraftId -> Promise {}

cancelContentDraft :: E.ContentDraftId -> CommandAPI {}
cancelContentDraft x0 = __commandAPI "cancelContentDraft" $ __cancelContentDraft x0



foreign import __getContentCommits :: 
  E.ContentId -> Promise (Array E.RelatedContentCommit)

getContentCommits :: E.ContentId -> QueryAPI (Array E.RelatedContentCommit)
getContentCommits x0 = __queryAPI "getContentCommits" $ __getContentCommits x0



foreign import __getContentCommit :: 
  E.ContentCommitId -> Promise E.FocusedContentCommit

getContentCommit :: E.ContentCommitId -> QueryAPI E.FocusedContentCommit
getContentCommit x0 = __queryAPI "getContentCommit" $ __getContentCommit x0



foreign import __getSearchedAllContents :: 
  String -> Promise (Array E.SearchedContent)

getSearchedAllContents :: String -> QueryAPI (Array E.SearchedContent)
getSearchedAllContents x0 = __queryAPI "getSearchedAllContents" $ __getSearchedAllContents x0



foreign import __getSearchedContentsInContainer :: 
  E.SpaceDisplayId -> E.FormatDisplayId -> String -> Promise (Array E.SearchedContent)

getSearchedContentsInContainer :: E.SpaceDisplayId -> E.FormatDisplayId -> String -> QueryAPI (Array E.SearchedContent)
getSearchedContentsInContainer x0 x1 x2 = __queryAPI "getSearchedContentsInContainer" $ __getSearchedContentsInContainer x0 x1 x2



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



foreign import __getFormatsHasSemanticId :: 
  E.SpaceId -> Promise (Array E.RelatedFormat)

getFormatsHasSemanticId :: E.SpaceId -> QueryAPI (Array E.RelatedFormat)
getFormatsHasSemanticId x0 = __queryAPI "getFormatsHasSemanticId" $ __getFormatsHasSemanticId x0



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



foreign import __setFormatSemanticId :: 
  E.FormatId -> Maybe E.SemanticId -> Promise {}

setFormatSemanticId :: E.FormatId -> Maybe E.SemanticId -> CommandAPI {}
setFormatSemanticId x0 x1 = __commandAPI "setFormatSemanticId" $ __setFormatSemanticId x0 x1



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
  Maybe E.SpaceId -> E.MaterialData -> Promise E.RelatedMaterialDraft

createNewMaterialDraft :: Maybe E.SpaceId -> E.MaterialData -> CommandAPI E.RelatedMaterialDraft
createNewMaterialDraft x0 x1 = __commandAPI "createNewMaterialDraft" $ __createNewMaterialDraft x0 x1



foreign import __editMaterialDraft :: 
  E.MaterialDraftId -> E.MaterialData -> Promise {}

editMaterialDraft :: E.MaterialDraftId -> E.MaterialData -> CommandAPI {}
editMaterialDraft x0 x1 = __commandAPI "editMaterialDraft" $ __editMaterialDraft x0 x1



foreign import __commitMaterial :: 
  E.MaterialDraftId -> E.MaterialData -> Promise {}

commitMaterial :: E.MaterialDraftId -> E.MaterialData -> CommandAPI {}
commitMaterial x0 x1 = __commandAPI "commitMaterial" $ __commitMaterial x0 x1



foreign import __getMaterial :: 
  E.MaterialId -> Promise E.FocusedMaterial

getMaterial :: E.MaterialId -> QueryAPI E.FocusedMaterial
getMaterial x0 = __queryAPI "getMaterial" $ __getMaterial x0



foreign import __getMyMaterialDrafts :: 
  Unit -> Promise (Array E.RelatedMaterialDraft)

getMyMaterialDrafts :: Unit -> QueryAPI (Array E.RelatedMaterialDraft)
getMyMaterialDrafts x0 = __queryAPI "getMyMaterialDrafts" $ __getMyMaterialDrafts x0



foreign import __getMaterialDraft :: 
  E.MaterialDraftId -> Promise E.FocusedMaterialDraft

getMaterialDraft :: E.MaterialDraftId -> QueryAPI E.FocusedMaterialDraft
getMaterialDraft x0 = __queryAPI "getMaterialDraft" $ __getMaterialDraft x0



foreign import __cancelMaterialDraft :: 
  E.MaterialDraftId -> Promise {}

cancelMaterialDraft :: E.MaterialDraftId -> CommandAPI {}
cancelMaterialDraft x0 = __commandAPI "cancelMaterialDraft" $ __cancelMaterialDraft x0



foreign import __getMaterialCommits :: 
  E.MaterialId -> Promise (Array E.RelatedMaterialCommit)

getMaterialCommits :: E.MaterialId -> QueryAPI (Array E.RelatedMaterialCommit)
getMaterialCommits x0 = __queryAPI "getMaterialCommits" $ __getMaterialCommits x0



foreign import __getMaterialEditings :: 
  E.MaterialDraftId -> Promise (Array E.IntactMaterialEditing)

getMaterialEditings :: E.MaterialDraftId -> QueryAPI (Array E.IntactMaterialEditing)
getMaterialEditings x0 = __queryAPI "getMaterialEditings" $ __getMaterialEditings x0



foreign import __getMaterialSnapshot :: 
  E.MaterialSnapshotId -> Promise E.FocusedMaterialSnapshot

getMaterialSnapshot :: E.MaterialSnapshotId -> QueryAPI E.FocusedMaterialSnapshot
getMaterialSnapshot x0 = __queryAPI "getMaterialSnapshot" $ __getMaterialSnapshot x0



foreign import __getMaterialCommit :: 
  E.MaterialCommitId -> Promise E.FocusedMaterialCommit

getMaterialCommit :: E.MaterialCommitId -> QueryAPI E.FocusedMaterialCommit
getMaterialCommit x0 = __queryAPI "getMaterialCommit" $ __getMaterialCommit x0



---------------------------------------------------------
--  ReactionService
---------------------------------------------------------



foreign import __commentContent :: 
  E.ContentId -> String -> Promise E.FocusedTreeComment

commentContent :: E.ContentId -> String -> CommandAPI E.FocusedTreeComment
commentContent x0 x1 = __commandAPI "commentContent" $ __commentContent x0 x1



foreign import __replyToComment :: 
  E.CommentId -> String -> Promise E.FocusedComment

replyToComment :: E.CommentId -> String -> CommandAPI E.FocusedComment
replyToComment x0 x1 = __commandAPI "replyToComment" $ __replyToComment x0 x1



foreign import __modifyComment :: 
  E.CommentId -> String -> Promise {}

modifyComment :: E.CommentId -> String -> CommandAPI {}
modifyComment x0 x1 = __commandAPI "modifyComment" $ __modifyComment x0 x1



foreign import __likeComment :: 
  E.CommentId -> Promise {}

likeComment :: E.CommentId -> CommandAPI {}
likeComment x0 = __commandAPI "likeComment" $ __likeComment x0



foreign import __unlikeComment :: 
  E.CommentId -> Promise {}

unlikeComment :: E.CommentId -> CommandAPI {}
unlikeComment x0 = __commandAPI "unlikeComment" $ __unlikeComment x0



foreign import __getNotifications :: 
  Unit -> Promise (Array E.IntactNotification)

getNotifications :: Unit -> QueryAPI (Array E.IntactNotification)
getNotifications x0 = __queryAPI "getNotifications" $ __getNotifications x0



foreign import __getActivitiesBySpace :: 
  E.SpaceId -> Promise (Array E.IntactActivityBySpace)

getActivitiesBySpace :: E.SpaceId -> QueryAPI (Array E.IntactActivityBySpace)
getActivitiesBySpace x0 = __queryAPI "getActivitiesBySpace" $ __getActivitiesBySpace x0



foreign import __getActivitiesByUser :: 
  E.SpaceId -> Promise (Array E.IntactActivityByUser)

getActivitiesByUser :: E.SpaceId -> QueryAPI (Array E.IntactActivityByUser)
getActivitiesByUser x0 = __queryAPI "getActivitiesByUser" $ __getActivitiesByUser x0



foreign import __getNotReadNotificationCount :: 
  Unit -> Promise Int

getNotReadNotificationCount :: Unit -> QueryAPI Int
getNotReadNotificationCount x0 = __queryAPI "getNotReadNotificationCount" $ __getNotReadNotificationCount x0



foreign import __readAllNotifications :: 
  Unit -> Promise {}

readAllNotifications :: Unit -> CommandAPI {}
readAllNotifications x0 = __commandAPI "readAllNotifications" $ __readAllNotifications x0



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
  Unit -> Promise (Array E.RelatedSpace)

getCandidateSpaces :: Unit -> QueryAPI (Array E.RelatedSpace)
getCandidateSpaces x0 = __queryAPI "getCandidateSpaces" $ __getCandidateSpaces x0



foreign import __getMySpaces :: 
  Unit -> Promise (Array E.RelatedSpace)

getMySpaces :: Unit -> QueryAPI (Array E.RelatedSpace)
getMySpaces x0 = __queryAPI "getMySpaces" $ __getMySpaces x0



foreign import __getFollowingSpaces :: 
  Unit -> Promise (Array E.RelatedSpace)

getFollowingSpaces :: Unit -> QueryAPI (Array E.RelatedSpace)
getFollowingSpaces x0 = __queryAPI "getFollowingSpaces" $ __getFollowingSpaces x0



foreign import __getPublishedSpaces :: 
  Unit -> Promise (Array E.RelatedSpace)

getPublishedSpaces :: Unit -> QueryAPI (Array E.RelatedSpace)
getPublishedSpaces x0 = __queryAPI "getPublishedSpaces" $ __getPublishedSpaces x0



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



foreign import __setSpaceDescription :: 
  E.SpaceId -> String -> Promise {}

setSpaceDescription :: E.SpaceId -> String -> CommandAPI {}
setSpaceDescription x0 x1 = __commandAPI "setSpaceDescription" $ __setSpaceDescription x0 x1



foreign import __uploadSpaceHeaderImage :: 
  { spaceId :: E.SpaceId, blob :: Blob } -> Promise {}

uploadSpaceHeaderImage :: { spaceId :: E.SpaceId, blob :: Blob } -> CommandAPI {}
uploadSpaceHeaderImage x0 = __commandAPI "uploadSpaceHeaderImage" $ __uploadSpaceHeaderImage x0



foreign import __setSpaceDisplayId :: 
  E.SpaceId -> E.SpaceDisplayId -> Promise {}

setSpaceDisplayId :: E.SpaceId -> E.SpaceDisplayId -> CommandAPI {}
setSpaceDisplayId x0 x1 = __commandAPI "setSpaceDisplayId" $ __setSpaceDisplayId x0 x1



foreign import __setSpacePublished :: 
  E.SpaceId -> Boolean -> Promise {}

setSpacePublished :: E.SpaceId -> Boolean -> CommandAPI {}
setSpacePublished x0 x1 = __commandAPI "setSpacePublished" $ __setSpacePublished x0 x1



foreign import __setSpaceDefaultAuthority :: 
  E.SpaceId -> E.SpaceAuthority -> Promise {}

setSpaceDefaultAuthority :: E.SpaceId -> E.SpaceAuthority -> CommandAPI {}
setSpaceDefaultAuthority x0 x1 = __commandAPI "setSpaceDefaultAuthority" $ __setSpaceDefaultAuthority x0 x1



foreign import __getSpaceContainers :: 
  E.SpaceId -> Promise (Array E.RelatedContainer)

getSpaceContainers :: E.SpaceId -> QueryAPI (Array E.RelatedContainer)
getSpaceContainers x0 = __queryAPI "getSpaceContainers" $ __getSpaceContainers x0



foreign import __getSpaceHomePage :: 
  E.SpaceId -> Promise E.IntactSpageHomePage

getSpaceHomePage :: E.SpaceId -> QueryAPI E.IntactSpageHomePage
getSpaceHomePage x0 = __queryAPI "getSpaceHomePage" $ __getSpaceHomePage x0



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
  Unit -> Promise E.FocusedUser

getMyUser :: Unit -> QueryAPI E.FocusedUser
getMyUser x0 = __queryAPI "getMyUser" $ __getMyUser x0



foreign import __getMyAccount :: 
  Unit -> Promise E.IntactAccount

getMyAccount :: Unit -> QueryAPI E.IntactAccount
getMyAccount x0 = __queryAPI "getMyAccount" $ __getMyAccount x0



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



foreign import __activateAccount :: 
  String -> Promise E.AuthInfo

activateAccount :: String -> CommandAPI E.AuthInfo
activateAccount x0 = __commandAPI "activateAccount" $ __activateAccount x0



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



foreign import __uploadMyIcon :: 
  { blob :: Blob } -> Promise {}

uploadMyIcon :: { blob :: Blob } -> CommandAPI {}
uploadMyIcon x0 = __commandAPI "uploadMyIcon" $ __uploadMyIcon x0



