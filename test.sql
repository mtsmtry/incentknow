SELECT 
    `x`.`id` AS `x_id`, 
    `x`.`entityId` AS `x_entityId`, 
    `x`.`currentEditingId` AS `x_currentEditingId`,
    `x`.`intendedMaterialType` AS `x_intendedMaterialType`,
    `x`.`materialId` AS `x_materialId`,
    `x`.`intendedContentDraftId` AS `x_intendedContentDraftId`,
    `x`.`intendedSpaceId` AS `x_intendedSpaceId`,
    `x`.`userId` AS `x_userId`, `x`.`createdAt` AS `x_createdAt`,
    `x`.`updatedAt` AS `x_updatedAt`,
    `x`.`changeType` AS `x_changeType`,
    `currentEditing`.`id` AS `currentEditing_id`,
    `currentEditing`.`entityId` AS `currentEditing_entityId`,
    `currentEditing`.`draftId` AS `currentEditing_draftId`,
    `currentEditing`.`snapshotId` AS `currentEditing_snapshotId`,
    `currentEditing`.`createdAt` AS `currentEditing_createdAt`,
    `currentEditing`.`updatedAt` AS `currentEditing_updatedAt`,
    `currentEditing`.`basedCommitId` AS `currentEditing_basedCommitId`,
    `currentEditing`.`state` AS `currentEditing_state`,
    `snapshot`.*, snapshot.data 
    FROM `material_draft` `x` 
    LEFT JOIN `material_editing` `currentEditing` ON `currentEditing`.`id`=`x`.`currentEditingId`
    LEFT JOIN `currentEditing` `snapshot`
    WHERE `x`.`userId` = ?


SELECT `x`.`id` AS `x_id`, 
`x`.`entityId` AS `x_entityId`, `x`.`commitId` AS `x_commitId`,
`x`.`containerId` AS `x_containerId`, `x`.`structureId` AS `x_structureId`,
`x`.`createdAt` AS `x_createdAt`, `x`.`creatorUserId` AS `x_creatorUserId`,
`x`.`updatedAtOnlyData` AS `x_updatedAtOnlyData`, `x`.`updatedAt` AS `x_updatedAt`,
`x`.`updaterUserId` AS `x_updaterUserId`, `x`.`updateCount` AS `x_updateCount`,
`x`.`viewCount` AS `x_viewCount`, `creatorUser`.`id` AS `creatorUser_id`,
`creatorUser`.`entityId` AS `creatorUser_entityId`,
`creatorUser`.`displayId` AS `creatorUser_displayId`,
`creatorUser`.`displayName` AS `creatorUser_displayName`,
`creatorUser`.`passwordHash` AS `creatorUser_passwordHash`,
`creatorUser`.`email` AS `creatorUser_email`,
`creatorUser`.`iconUrl` AS `creatorUser_iconUrl`,
`creatorUser`.`createdAt` AS `creatorUser_createdAt`,
`updaterUser`.`id` AS `updaterUser_id`,
`updaterUser`.`entityId` AS `updaterUser_entityId`,
`updaterUser`.`displayId` AS `updaterUser_displayId`,
`updaterUser`.`displayName` AS `updaterUser_displayName`,
`updaterUser`.`passwordHash` AS `updaterUser_passwordHash`,
`updaterUser`.`email` AS `updaterUser_email`,
`updaterUser`.`iconUrl` AS `updaterUser_iconUrl`,
`updaterUser`.`createdAt` AS `updaterUser_createdAt`,
`materials`.`id` AS `materials_id`, `materials`.`entityId` AS `materials_entityId`, `materials`.`contentId` AS `materials_contentId`, `materials`.`spaceId` AS `materials_spaceId`, `materials`.`not_null_constrain` AS `materials_not_null_constrain`, `materials`.`materialType` AS `materials_materialType`, `materials`.`commitId` AS `materials_commitId`, `materials`.`createdAt` AS `materials_createdAt`, `materials`.`creatorUserId` AS `materials_creatorUserId`, `materials`.`updatedAt` AS `materials_updatedAt`, `materials`.`updaterUserId` AS `materials_updaterUserId`, `materialCommits`.`id` AS `materialCommits_id`, `materialCommits`.`entityId` AS `materialCommits_entityId`, `materialCommits`.`materialId` AS `materialCommits_materialId`, `materialCommits`.`parentCommitId` AS `materialCommits_parentCommitId`, `materialCommits`.`editingId` AS `materialCommits_editingId`, `materialCommits`.`textCount` AS `materialCommits_textCount`, `materialCommits`.`beginning` AS `materialCommits_beginning`, `materialCommits`.`timestamp` AS `materialCommits_timestamp`, `materialCommits`.`basedCommitId` AS `materialCommits_basedCommitId`, `materialCommits`.`committerUserId` AS `materialCommits_committerUserId`, `materialCreatorUsers`.`id` AS `materialCreatorUsers_id`, `materialCreatorUsers`.`entityId` AS `materialCreatorUsers_entityId`, `materialCreatorUsers`.`displayId` AS `materialCreatorUsers_displayId`, `materialCreatorUsers`.`displayName` AS `materialCreatorUsers_displayName`, `materialCreatorUsers`.`passwordHash` AS `materialCreatorUsers_passwordHash`, `materialCreatorUsers`.`email` AS `materialCreatorUsers_email`, `materialCreatorUsers`.`iconUrl` AS `materialCreatorUsers_iconUrl`, `materialCreatorUsers`.`createdAt` AS `materialCreatorUsers_createdAt`, `materialUpdaterUsers`.`id` AS `materialUpdaterUsers_id`, `materialUpdaterUsers`.`entityId` AS `materialUpdaterUsers_entityId`, `materialUpdaterUsers`.`displayId` AS `materialUpdaterUsers_displayId`, `materialUpdaterUsers`.`displayName` AS `materialUpdaterUsers_displayName`, `materialUpdaterUsers`.`passwordHash` AS `materialUpdaterUsers_passwordHash`, `materialUpdaterUsers`.`email` AS `materialUpdaterUsers_email`, `materialUpdaterUsers`.`iconUrl` AS `materialUpdaterUsers_iconUrl`, `materialUpdaterUsers`.`createdAt` AS `materialUpdaterUsers_createdAt`, `commit`.`id` AS `commit_id`, `commit`.`entityId` AS `commit_entityId`, `commit`.`contentId` AS `commit_contentId`, `commit`.`structureId` AS `commit_structureId`, `commit`.`timestamp` AS `commit_timestamp`, `commit`.`committerUserId` AS `commit_committerUserId`, `commit`.`data` AS `commit_data`, `commit`.`data` FROM `content` `x` LEFT JOIN `user` `creatorUser` ON `creatorUser`.`id`=`x`.`creatorUserId`  LEFT JOIN `user` `updaterUser` ON `updaterUser`.`id`=`x`.`updaterUserId`  LEFT JOIN `material` `materials` ON `materials`.`contentId`=`x`.`id`  LEFT JOIN `material_commit` `materialCommits` ON `materialCommits`.`id`=`materials`.`commitId`  LEFT JOIN `user` `materialCreatorUsers` ON `materialCreatorUsers`.`id`=`materials`.`creatorUserId`  LEFT JOIN `user` `materialUpdaterUsers` ON `materialUpdaterUsers`.`id`=`materials`.`updaterUserId`  LEFT JOIN `content_commit` `commit` ON `commit`.`id`=`x`.`commitId` WHERE `x`.`containerId` = ? AND x.data->>"$.KJ" = ?'