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