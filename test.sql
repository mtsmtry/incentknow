SELECT `x`.`id` AS `x_id`, `x`.`entityId` AS `x_entityId`, `x`.`displayId` AS `x_displayId`, `x`.`displayName` AS `x_displayName`, `x`.`createdAt` AS `x_createdAt`, `x`.`creatorUserId` AS `x_creatorUserId`, `x`.`description` AS `x_description`, `x`.`homeUrl` AS `x_homeUrl`, `x`.`membershipMethod` AS `x_membershipMethod`, `x`.`published` AS `x_published`, `x`.`defaultAuthority` AS `x_defaultAuthority`, `creatorUser`.`id` AS `creatorUser_id`, `creatorUser`.`entityId` AS `creatorUser_entityId`, `creatorUser`.`displayId` AS `creatorUser_displayId`, `creatorUser`.`displayName` AS `creatorUser_displayName`, `creatorUser`.`passwordHash` AS `creatorUser_passwordHash`, `creatorUser`.`email` AS `creatorUser_email`, `creatorUser`.`iconUrl` AS `creatorUser_iconUrl`, `creatorUser`.`createdAt` AS `creatorUser_createdAt`, (SELECT COUNT(*) FROM space_member WHERE spaceId = `x`.`id`) AS `memberCount`, (SELECT COUNT(*) FROM format WHERE spaceId = `x`.`id`) AS `formatCount`, (SELECT COUNT(*) FROM content as c INNER JOIN container as con ON c.containerId = con.id WHERE con.spaceId = `x`.`id`) AS `contentCount` FROM `space` `x` LEFT JOIN `members` `m`  LEFT JOIN `user` `creatorUser` ON `creatorUser`.`id`=`x`.`creatorUserId` WHERE m.userId = ?