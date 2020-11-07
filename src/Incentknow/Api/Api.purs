
module Incentknow.Api where

import Prelude

import Incentknow.Data.Entities as E
import Data.Maybe (Maybe(..))
import Control.Promise (Promise)
import Data.Argonaut.Core (Json)


---------------------------------------------------------
--  Container
---------------------------------------------------------

---------------------------------------------------------
--  Content
---------------------------------------------------------

foreign import startContentEditing :: 
  { contentId :: E.ContentId
  , forkedCommitId :: Maybe E.ContentCommitId
  }
  -> Promise E.RelatedContentDraft

foreign import startBlankContentEditing :: 
  { spaceId :: E.SpaceId
  , displayName :: String
  , type :: E.MaterialType
  }
  -> Promise E.RelatedContentDraft

foreign import editContent :: 
  { contentDraftId :: E.ContentDraftId
  , data :: Json
  }
  -> Promise (Maybe E.RelatedContentSnapshot)

foreign import commitContent :: 
  { contentDraftId :: E.ContentDraftId
  , data :: Json
  }
  -> Promise (Maybe E.RelatedContentCommit)

foreign import getContent :: 
  E.ContentId -> Promise E.FocusedContent

foreign import getContentDraft :: 
  E.ContentDraftId -> Promise E.FocusedContentDraft

foreign import getContentCommits :: 
  E.ContentId -> Promise (Array E.RelatedContentCommit)

foreign import getContentEditingNodes :: 
  E.ContentDraftId -> Promise (Array E.ContentNode)

foreign import getContentSnapshot :: 
  { source :: E.SnapshotSource
  , entityId :: String
  }
  -> Promise E.FocusedContentSnapshot

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

---------------------------------------------------------
--  Material
---------------------------------------------------------

foreign import startMaterialEditing :: 
  { materialId :: E.MaterialId
  , forkedCommitId :: Maybe E.MaterialCommitId
  }
  -> Promise E.RelatedMaterialDraft

foreign import startBlankMaterialEditing :: 
  { spaceId :: E.SpaceId
  , displayName :: String
  , type :: E.MaterialType
  }
  -> Promise E.RelatedMaterialDraft

foreign import editMaterial :: 
  { materialDraftId :: E.MaterialDraftId
  , data :: String
  }
  -> Promise (Maybe E.RelatedMaterialSnapshot)

foreign import commitMaterial :: 
  { materialDraftId :: E.MaterialDraftId
  , data :: String
  }
  -> Promise (Maybe E.RelatedMaterialCommit)

foreign import getMaterial :: 
  E.MaterialId -> Promise E.FocusedMaterial

foreign import getMaterialDraft :: 
  E.MaterialDraftId -> Promise E.FocusedMaterialDraft

foreign import getMaterialCommits :: 
  E.MaterialId -> Promise (Array E.RelatedMaterialCommit)

foreign import getMaterialEditingNodes :: 
  E.MaterialDraftId -> Promise (Array E.MaterialNode)

foreign import getMaterialSnapshot :: 
  { source :: E.SnapshotSource
  , entityId :: String
  }
  -> Promise E.FocusedMaterialSnapshot

foreign import getMaterialCommit :: 
  E.MaterialCommitId -> Promise E.FocusedMaterialCommit

---------------------------------------------------------
--  Space
---------------------------------------------------------

foreign import createSpace :: 
  { displayName :: String
  , description :: String
  }
  -> Promise E.FocusedSpace

foreign import getSpace :: 
  E.SpaceDisplayId -> Promise E.FocusedSpace

foreign import getSpaceMembers :: 
  E.SpaceId -> Promise (Array E.FocusedSpaceMember)

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

foreign import getUser :: 
  E.UserDisplayId -> Promise E.FocusedUser

foreign import setMyDisplayName :: 
  String -> Promise {}

foreign import setMyDisplayId :: 
  E.UserDisplayId -> Promise {}

