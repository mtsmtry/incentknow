SELECT 
`x`.`id` AS `x_id`, `x`.`entityId` AS `x_entityId`, 
`x`.`spaceId` AS `x_spaceId`, `x`.`formatId` AS `x_formatId`,
`x`.`createdAt` AS `x_createdAt`, `x`.`updatedAt` AS `x_updatedAt`, 
`x`.`generator` AS `x_generator`, `space`.`id` AS `space_id`,
`space`.`entityId` AS `space_entityId`, `space`.`displayId` AS `space_displayId`,
`space`.`displayName` AS `space_displayName`, `space`.`createdAt` AS `space_createdAt`, 
`space`.`creatorUserId` AS `space_creatorUserId`, `space`.`description` AS `space_description`,
`space`.`homeUrl` AS `space_homeUrl`, `space`.`membershipMethod` AS `space_membershipMethod`, 
`space`.`published` AS `space_published`, `space`.`defaultAuthority` AS `space_defaultAuthority`,
`format`.`id` AS `format_id`, `format`.`entityId` AS `format_entityId`,
`format`.`displayId` AS `format_displayId`, `format`.`displayName` AS `format_displayName`, 
`format`.`spaceId` AS `format_spaceId`, `format`.`description` AS `format_description`, 
`format`.`currentStructureId` AS `format_currentStructureId`, 
`format`.`usage` AS `format_usage`, `format`.`createdAt` AS `format_createdAt`, 
`format`.`creatorUserId` AS `format_creatorUserId`,
`format`.`updatedAt` AS `format_updatedAt`,
`format`.`updaterUserId` AS `format_updaterUserId`, 
`format`.`semanticId` AS `format_semanticId`, 
`format`.`latestVersion` AS `format_latestVersion`, 
`format`.`icon` AS `format_icon`, 

`space`.`id` AS `space_id`, 
`space`.`entityId` AS `space_entityId`, 
`space`.`displayId` AS `space_displayId`, 
`space`.`displayName` AS `space_displayName`, 
`space`.`createdAt` AS `space_createdAt`, 
`space`.`creatorUserId` AS `space_creatorUserId`, 
`space`.`description` AS `space_description`, 
`space`.`homeUrl` AS `space_homeUrl`, 
`space`.`membershipMethod` AS `space_membershipMethod`, 
`space`.`published` AS `space_published`, 
`space`.`defaultAuthority` AS `space_defaultAuthority`, 
space, 
(SELECT COUNT(*) FROM content AS c WHERE c.containerId = `x`.`id`) AS `contentCount` FROM `container` `x` 

LEFT JOIN `space` `space` ON `space`.`id`=`x`.`spaceId`  
LEFT JOIN `format` `format` ON `format`.`id`=`x`.`formatId`  
LEFT JOIN `space` `space` ON `space`.`id`=`format`.`spaceId` 

WHERE `x`.`spaceId` = 1