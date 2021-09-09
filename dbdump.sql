-- MySQL dump 10.13  Distrib 8.0.26, for macos10.15 (x86_64)
--
-- Host: localhost    Database: incentknow
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `container`
--

DROP TABLE IF EXISTS `container`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `container` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `spaceId` int NOT NULL,
  `formatId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `generator` enum('none','reactor','crawler') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_bb325e4206c2c6e8cbea8cd8f1` (`entityId`),
  UNIQUE KEY `IDX_297b677b3724b95b8b6e33a21b` (`spaceId`,`formatId`),
  KEY `FK_fd01ca750e9641e1d7436fbac01` (`formatId`),
  CONSTRAINT `FK_0c59bbd852eee2d1a18a89e1538` FOREIGN KEY (`spaceId`) REFERENCES `space` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_fd01ca750e9641e1d7436fbac01` FOREIGN KEY (`formatId`) REFERENCES `format` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `container`
--

LOCK TABLES `container` WRITE;
/*!40000 ALTER TABLE `container` DISABLE KEYS */;
INSERT INTO `container` VALUES (1,'0rBCkQgXliV2',1,1,'2021-07-23 16:07:32','2021-07-23 16:07:32',NULL),(2,'WNjP5iOU3ECn',1,2,'2021-07-23 16:40:38','2021-07-23 16:40:38',NULL),(3,'vekGiQYZurQB',1,3,'2021-09-05 18:35:26','2021-09-05 18:35:26',NULL);
/*!40000 ALTER TABLE `container` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `commitId` int DEFAULT NULL,
  `containerId` int NOT NULL,
  `structureId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `creatorUserId` int NOT NULL,
  `updatedAtOnlyData` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updaterUserId` int NOT NULL,
  `updateCount` int NOT NULL DEFAULT '1',
  `viewCount` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_b6fd2c0aeb1b73cef9bb551534` (`entityId`),
  UNIQUE KEY `REL_d086c3bb1fc0150a69a0e41df9` (`commitId`),
  KEY `FK_8a4d246d854cf37fed46116f598` (`containerId`),
  KEY `FK_3a51d0f9bf39d6d0e73d429a94f` (`structureId`),
  KEY `FK_02dda362242346f33a41a19ed67` (`creatorUserId`),
  KEY `FK_4a51e66acc189fbe0548aa8d089` (`updaterUserId`),
  CONSTRAINT `FK_02dda362242346f33a41a19ed67` FOREIGN KEY (`creatorUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_3a51d0f9bf39d6d0e73d429a94f` FOREIGN KEY (`structureId`) REFERENCES `structure` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_4a51e66acc189fbe0548aa8d089` FOREIGN KEY (`updaterUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_8a4d246d854cf37fed46116f598` FOREIGN KEY (`containerId`) REFERENCES `container` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_d086c3bb1fc0150a69a0e41df91` FOREIGN KEY (`commitId`) REFERENCES `content_commit` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
INSERT INTO `content` VALUES (4,'MjD3kKAkgz6t',4,1,1,'2021-08-12 01:07:12',1,'2021-08-12 01:07:12','2021-08-12 01:07:12',1,1,0),(5,'e2ZNOyiBp4Ky',5,2,3,'2021-08-12 01:08:34',1,'2021-08-12 01:08:35','2021-08-12 01:08:34',1,1,0),(6,'vME9fV25gHek',17,1,1,'2021-08-12 01:14:35',1,'2021-08-18 15:40:48','2021-08-18 15:40:47',1,1,0),(7,'9Aq9zcIlOJPo',7,1,1,'2021-08-12 12:50:11',1,'2021-08-12 12:50:12','2021-08-12 12:50:12',1,1,0),(8,'umQ5Ctus6u54',8,1,1,'2021-08-12 12:59:45',1,'2021-08-12 12:59:45','2021-08-12 12:59:45',1,1,0),(9,'URgCTAxJ0ehF',9,2,3,'2021-08-12 13:18:29',1,'2021-08-12 13:18:30','2021-08-12 13:18:29',1,1,0),(10,'cccVWHz6G5nh',19,1,1,'2021-08-12 13:31:01',1,'2021-08-19 15:47:41','2021-08-19 15:47:41',1,1,0),(11,'ApofQ9rCKg6t',20,2,9,'2021-08-29 21:02:01',1,'2021-08-29 21:02:02','2021-08-29 21:02:02',1,1,0),(14,'vxKU89pSjKrk',23,2,9,'2021-08-29 21:40:09',1,'2021-08-29 21:40:10','2021-08-29 21:40:09',1,1,0),(15,'5jss5zkvcaL1',24,3,10,'2021-09-05 18:35:26',1,'2021-09-05 18:35:26','2021-09-05 18:35:26',1,1,0),(16,'qO9NENHiTHxp',25,3,10,'2021-09-05 18:35:41',1,'2021-09-05 18:35:41','2021-09-05 18:35:41',1,1,0),(17,'iUvHynxIfTdO',26,3,10,'2021-09-05 18:36:15',1,'2021-09-05 18:36:16','2021-09-05 18:36:15',1,1,0),(21,'18jmiTbsShaC',30,3,10,'2021-09-05 18:40:48',1,'2021-09-05 18:40:48','2021-09-05 18:40:48',1,1,0),(24,'wNnWAU0Z2fe3',33,3,10,'2021-09-05 18:49:50',1,'2021-09-05 18:49:51','2021-09-05 18:49:50',1,1,0),(25,'KKT2IeibKvan',34,3,10,'2021-09-05 18:50:03',1,'2021-09-05 18:50:04','2021-09-05 18:50:03',1,1,0),(26,'UvdoXr0TfzkX',35,3,10,'2021-09-05 18:50:18',1,'2021-09-05 18:50:19','2021-09-05 18:50:18',1,1,0),(27,'nfiYFQSLPLOM',36,3,10,'2021-09-05 18:50:41',1,'2021-09-05 18:50:41','2021-09-05 18:50:41',1,1,0),(29,'NuBRIOKVW2Nr',38,3,10,'2021-09-05 18:55:35',1,'2021-09-05 18:55:35','2021-09-05 18:55:35',1,1,0),(32,'9vYPDJZn7P26',41,2,9,'2021-09-05 19:00:00',1,'2021-09-05 19:00:01','2021-09-05 19:00:00',1,1,0),(35,'EZeR3prUyGon',44,3,10,'2021-09-05 19:11:09',1,'2021-09-05 19:11:10','2021-09-05 19:11:09',1,1,0),(36,'DQ79nCoLjmHu',45,3,10,'2021-09-05 19:12:06',1,'2021-09-05 19:12:07','2021-09-05 19:12:06',1,1,0),(37,'ISJvhblFayEa',46,3,10,'2021-09-05 19:13:47',1,'2021-09-05 19:13:47','2021-09-05 19:13:47',1,1,0),(38,'JdDrZ96GDCQU',47,3,10,'2021-09-05 19:17:15',1,'2021-09-05 19:17:15','2021-09-05 19:17:15',1,1,0),(39,'DfadA52chSiE',48,3,10,'2021-09-05 19:17:26',1,'2021-09-05 19:17:27','2021-09-05 19:17:26',1,1,0),(41,'ntrThsKkS1y3',50,3,10,'2021-09-05 19:18:40',1,'2021-09-05 19:18:40','2021-09-05 19:18:40',1,1,0),(43,'P8d1WZZC0m51',52,3,10,'2021-09-05 19:25:17',1,'2021-09-05 19:25:17','2021-09-05 19:25:17',1,1,0),(44,'R1dwnoFCVGTE',53,3,10,'2021-09-08 00:23:12',1,'2021-09-08 00:23:13','2021-09-08 00:23:12',1,1,0);
/*!40000 ALTER TABLE `content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_commit`
--

DROP TABLE IF EXISTS `content_commit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_commit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `contentId` int NOT NULL,
  `data` text NOT NULL,
  `structureId` int NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `committerUserId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_37791cb3f10b527163096a66fb` (`entityId`),
  KEY `FK_a35307a3877f1523f8384592a05` (`contentId`),
  KEY `FK_6ea4ccc2a905a216645012eeb0b` (`structureId`),
  KEY `FK_73d9f11b31c2618300b39c5cb9b` (`committerUserId`),
  CONSTRAINT `FK_6ea4ccc2a905a216645012eeb0b` FOREIGN KEY (`structureId`) REFERENCES `structure` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_73d9f11b31c2618300b39c5cb9b` FOREIGN KEY (`committerUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_a35307a3877f1523f8384592a05` FOREIGN KEY (`contentId`) REFERENCES `content` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_commit`
--

LOCK TABLES `content_commit` WRITE;
/*!40000 ALTER TABLE `content_commit` DISABLE KEYS */;
INSERT INTO `content_commit` VALUES (4,'h62rhgkRsDDd',4,'{}',1,'2021-08-12 01:07:12',1),(5,'q6UAChIU7ROp',5,'{\"vE\":\"松本\",\"9R\":\"irPp03YmhTmc\",\"en\":null}',3,'2021-08-12 01:08:34',1),(6,'ENMgR9gSSwiZ',6,'{\"Pi\":\"第一回文芸界\",\"Vd\":\"ああ\",\"Bb\":\"5paorPpFTpVo\"}',1,'2021-08-12 01:14:35',1),(7,'f6qSJ55ChFGI',7,'{\"Pi\":\"rrrrddedewdwe\",\"Vd\":\"eeeddddd\",\"Bb\":\"OIYe0vOsmxRF\"}',1,'2021-08-12 12:50:12',1),(8,'HpLhhcNSlTxK',8,'{\"Pi\":\"hh\",\"Vd\":\"hh\",\"Bb\":\"B9pBCF3GmLBs\"}',1,'2021-08-12 12:59:45',1),(9,'iRsbhn7J045b',9,'{\"vE\":\"テスト最新\",\"9R\":\"0dHqDHln7ycn\",\"en\":null}',3,'2021-08-12 13:18:29',1),(10,'iilra4qv5JtR',10,'{\"Pi\":\"frewfrewfrew\",\"Vd\":null,\"Bb\":\"BWF5S4eEEGHD\"}',1,'2021-08-12 13:31:01',1),(11,'tki7ZNpF9vaF',6,'{\"Pi\":\"第一回文芸界\",\"Vd\":\"ああ\",\"Bb\":\"5paorPpFTpVo\"}',1,'2021-08-17 17:04:29',1),(12,'rIBwrbxiQzWE',6,'{\"Pi\":\"第一回文芸界\",\"Vd\":\"ああ\",\"Bb\":\"5paorPpFTpVo\"}',1,'2021-08-18 15:40:07',1),(13,'XFHUuJ2gBrba',6,'{\"Pi\":\"第一回文芸界\",\"Vd\":\"ああ\",\"Bb\":\"5paorPpFTpVo\"}',1,'2021-08-18 15:40:23',1),(14,'1mziHY8qY8DZ',6,'{\"Pi\":\"第一回文芸界\",\"Vd\":\"ああ\",\"Bb\":\"5paorPpFTpVo\"}',1,'2021-08-18 15:40:31',1),(15,'rapi3GXIWSyM',6,'{\"Pi\":\"第一回文芸界\",\"Vd\":\"ああ\",\"Bb\":\"5paorPpFTpVo\"}',1,'2021-08-18 15:40:35',1),(16,'AsvWj8MPUXWv',6,'{\"Pi\":\"第一回文芸界\",\"Vd\":\"ああ\",\"Bb\":\"5paorPpFTpVo\"}',1,'2021-08-18 15:40:38',1),(17,'d5gvZnIEv0bE',6,'{\"Pi\":\"第一回文芸界\",\"Vd\":\"ああ\",\"Bb\":\"5paorPpFTpVo\"}',1,'2021-08-18 15:40:47',1),(18,'fdh7ana1zhYT',10,'{\"Pi\":\"frewfrewfrew\",\"Vd\":null,\"Bb\":\"BWF5S4eEEGHD\"}',1,'2021-08-19 15:47:35',1),(19,'AVAlx82UXMQK',10,'{\"Pi\":\"frewfrewfrew\",\"Vd\":null,\"Bb\":\"BWF5S4eEEGHD\"}',1,'2021-08-19 15:47:41',1),(20,'Ih0YTPHO6QE7',11,'{\"vE\":\"frf\",\"9R\":null,\"en\":\"vME9fV25gHek\"}',9,'2021-08-29 21:02:02',1),(23,'Deeq1ZcwMi5b',14,'{\"vE\":\"vfds\",\"9R\":\"MP1GsIeei1rn\",\"en\":\"vME9fV25gHek\"}',9,'2021-08-29 21:40:09',1),(24,'yJWu92Pkfdma',15,'{\"yC\":{\"draftId\":\"oaPsHcIqs6my\"},\"A8\":null}',10,'2021-09-05 18:35:26',1),(25,'nAlVygcNdUgG',16,'{\"yC\":{\"draftId\":\"gbPi5DLeLpoD\"},\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 18:35:41',1),(26,'dgcjNvVhbMJ7',17,'{\"yC\":{\"draftId\":\"XfRnmAzyAEFy\"},\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 18:36:15',1),(30,'Uyqz3A5tS14W',21,'{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 18:40:48',1),(33,'iNPby5H6VADz',24,'{\"yC\":\"9frT0J9icZc2\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 18:49:50',1),(34,'fi2V8j8wXOMD',25,'{\"yC\":\"hvrmDr2xMcZB\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 18:50:03',1),(35,'Y82clen99WVB',26,'{\"yC\":\"XMHM126elV51\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 18:50:18',1),(36,'wajereekoofR',27,'{\"yC\":\"3SqdqWkfgTkJ\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 18:50:41',1),(38,'rtSHjMC4OV91',29,'{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 18:55:35',1),(41,'dxkiccpERWyW',32,'{\"vE\":null,\"9R\":\"vWT2EUM53dG1\",\"en\":null}',9,'2021-09-05 19:00:00',1),(44,'ycjvxhzqc8JS',35,'{\"yC\":\"G5Zujb4FWJl7\",\"A8\":null}',10,'2021-09-05 19:11:09',1),(45,'goFXQSVaJusz',36,'{\"yC\":\"FfflgAEArli9\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 19:12:06',1),(46,'DAVPMwpnVyDx',37,'{\"yC\":\"ahfaVm6e3pI7\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 19:13:47',1),(47,'bTmiF5Ii2YTH',38,'{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 19:17:15',1),(48,'HeXsZg3BWh5y',39,'{\"yC\":\"P63P7w28WX4S\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 19:17:27',1),(50,'epcxvPiEbLcC',41,'{\"yC\":\"VLkAXu4cTeCe\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 19:18:40',1),(52,'DTKvHwHBi3nj',43,'{\"yC\":\"49l2rg6IM2pf\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-05 19:25:17',1),(53,'BnNxwMnCOvUS',44,'{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,'2021-09-08 00:23:12',1);
/*!40000 ALTER TABLE `content_commit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_draft`
--

DROP TABLE IF EXISTS `content_draft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_draft` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `data` text NOT NULL,
  `structureId` int NOT NULL,
  `not_null_constrain` int GENERATED ALWAYS AS (coalesce(`contentId`,`intendedSpaceId`)) VIRTUAL NOT NULL,
  `contentId` int DEFAULT NULL,
  `intendedSpaceId` int DEFAULT NULL,
  `userId` int NOT NULL,
  `state` enum('editing','canceled','committed') NOT NULL DEFAULT 'editing',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAtOnlyContent` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_c60fc8b9ca531ce5d909f087bd` (`entityId`),
  UNIQUE KEY `IDX_d034a02a01b6aa5e5c025d5e44` (`contentId`,`userId`),
  KEY `FK_d2f6af93d32c3c0f5eb6a21013b` (`structureId`),
  KEY `FK_f7d16d664e38def87dfad2eb8ee` (`intendedSpaceId`),
  KEY `FK_71e06cf9536d5585616434ded30` (`userId`),
  CONSTRAINT `FK_6e5e73b7dbbf343c9c436088b41` FOREIGN KEY (`contentId`) REFERENCES `content` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_71e06cf9536d5585616434ded30` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_d2f6af93d32c3c0f5eb6a21013b` FOREIGN KEY (`structureId`) REFERENCES `structure` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_f7d16d664e38def87dfad2eb8ee` FOREIGN KEY (`intendedSpaceId`) REFERENCES `space` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_draft`
--

LOCK TABLES `content_draft` WRITE;
/*!40000 ALTER TABLE `content_draft` DISABLE KEYS */;
INSERT INTO `content_draft` (`id`, `entityId`, `data`, `structureId`, `contentId`, `intendedSpaceId`, `userId`, `state`, `createdAt`, `updatedAtOnlyContent`, `updatedAt`) VALUES (9,'D4z46wOsyXA6','{\"Pi\":\"rrrrddedewdwe\",\"Vd\":\"eeeddddd\",\"Bb\":\"UEHh5uUpevv0\"}',1,7,NULL,1,'editing','2021-08-15 23:35:22','2021-08-15 23:35:22','2021-08-15 23:35:22'),(10,'UkPrMAZ48Rnw','{\"vE\":\"テスト最新\",\"9R\":\"VLNwznVsPrNq\",\"en\":null}',3,9,NULL,1,'editing','2021-08-15 23:40:34','2021-08-15 23:40:34','2021-08-15 23:40:34'),(11,'IoBlTbpCbrOB','{\"Pi\":\"hh\",\"Vd\":\"hh\",\"Bb\":\"0EqPuZF0ZwfR\"}',1,8,NULL,1,'editing','2021-08-16 00:00:32','2021-08-16 00:00:33','2021-08-16 00:00:32'),(12,'tL9q1B3UfjMw','{\"Pi\":\"第一回文芸界\",\"Vd\":\"ああ\",\"Bb\":\"f4MPGfQtws4w\"}',1,6,NULL,1,'editing','2021-08-17 13:29:12','2021-08-17 13:29:12','2021-09-05 14:15:53'),(13,'ZUYu77i0wFZY','{\"Pi\":\"frewfrewfrew\",\"Vd\":null,\"Bb\":\"qdXb20H4tGU8\"}',1,10,NULL,1,'committed','2021-08-19 15:47:31','2021-08-19 15:47:32','2021-08-19 15:47:41'),(14,'wJLH8kzykheI','{\"vE\":\"frf\",\"9R\":null,\"en\":\"vME9fV25gHek\"}',9,11,NULL,1,'editing','2021-08-29 21:01:59','2021-08-29 21:01:59','2021-08-29 21:02:09'),(15,'vwRaKdKKGACa','{\"vE\":\"松本\",\"9R\":null,\"en\":\"vME9fV25gHek\"}',9,NULL,1,1,'editing','2021-08-29 21:02:43','2021-08-29 21:02:43','2021-08-29 21:02:47'),(16,'kSMmMHmbAaSK','{\"vE\":\"cds\",\"9R\":\"LxCbpsWQLEnO\",\"en\":\"vME9fV25gHek\"}',9,NULL,1,1,'editing','2021-08-29 21:35:33','2021-08-29 21:35:33','2021-08-29 21:35:35'),(17,'uQ7c5dAUG4xI','{\"vE\":\"vfds\",\"9R\":null,\"en\":\"vME9fV25gHek\"}',9,14,NULL,1,'committed','2021-08-29 21:40:08','2021-08-29 21:40:08','2021-08-29 21:40:09'),(18,'60ajHoO3gggC','{\"vE\":null,\"9R\":{\"draftId\":\"BqRgGAYa1vlt\"},\"en\":null,\"A8\":null}',10,NULL,1,1,'editing','2021-09-05 17:58:41','2021-09-05 17:58:41','2021-09-05 17:58:41'),(19,'TJA89yp3mbOd','{\"yC\":null,\"A8\":\"vxKU89pSjKrk\"}',10,NULL,1,1,'editing','2021-09-05 18:08:34','2021-09-05 18:08:34','2021-09-05 18:08:36'),(20,'eS5zXeyvnRbD','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,NULL,1,1,'editing','2021-09-05 18:18:01','2021-09-05 18:18:01','2021-09-05 18:18:01'),(21,'ShDxgxkrfM7J','{\"yC\":{\"draftId\":\"oaPsHcIqs6my\"},\"A8\":null}',10,15,NULL,1,'committed','2021-09-05 18:35:20','2021-09-05 18:35:20','2021-09-05 18:35:26'),(22,'85ZM119oCMZy','{\"yC\":{\"draftId\":\"gbPi5DLeLpoD\"},\"A8\":\"e2ZNOyiBp4Ky\"}',10,16,NULL,1,'committed','2021-09-05 18:35:36','2021-09-05 18:35:36','2021-09-05 18:35:41'),(23,'UVg467oulsfJ','{\"yC\":{\"draftId\":\"XfRnmAzyAEFy\"},\"A8\":\"e2ZNOyiBp4Ky\"}',10,17,NULL,1,'committed','2021-09-05 18:35:56','2021-09-05 18:35:56','2021-09-05 18:36:15'),(24,'qiEOJ0LV2Krz','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,NULL,1,1,'editing','2021-09-05 18:37:24','2021-09-05 18:37:24','2021-09-05 18:37:24'),(25,'eE3wbpExBbpb','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,NULL,1,1,'editing','2021-09-05 18:37:34','2021-09-05 18:37:34','2021-09-05 18:37:34'),(26,'pYufWedefksa','{\"yC\":{\"draftId\":\"2hRK7t1f62D1\"},\"A8\":\"e2ZNOyiBp4Ky\"}',10,NULL,1,1,'editing','2021-09-05 18:38:13','2021-09-05 18:38:13','2021-09-05 18:38:15'),(27,'k6loTzKxfzZe','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,21,NULL,1,'committed','2021-09-05 18:40:46','2021-09-05 18:40:46','2021-09-05 18:40:48'),(28,'DqjZLClUIdmS','{\"yC\":\"OMTmKdQxb8Rs\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,NULL,1,1,'editing','2021-09-05 18:40:56','2021-09-05 18:40:56','2021-09-05 18:41:00'),(29,'Bagc0znogyZX','{\"yC\":\"WterfIsxtnMc\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,NULL,1,1,'editing','2021-09-05 18:47:47','2021-09-05 18:47:47','2021-09-05 18:47:49'),(30,'dgiMD83rLcJi','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,24,NULL,1,'committed','2021-09-05 18:49:46','2021-09-05 18:49:46','2021-09-05 18:49:50'),(31,'S40sdfLPdBZ5','{\"yC\":\"tr3gm8imNwfD\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,25,NULL,1,'committed','2021-09-05 18:49:56','2021-09-05 18:49:56','2021-09-05 18:50:03'),(32,'9hzSAMCpMr9f','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,26,NULL,1,'committed','2021-09-05 18:50:15','2021-09-05 18:50:15','2021-09-05 18:50:18'),(33,'LSMDr2qkXuBU','{\"yC\":\"3gvoK6F5CsO4\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,27,NULL,1,'committed','2021-09-05 18:50:37','2021-09-05 18:50:37','2021-09-05 18:50:41'),(34,'L1joXwcdF5cz','{\"yC\":\"nl3f4a3ti74a\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,NULL,1,1,'editing','2021-09-05 18:51:02','2021-09-05 18:51:02','2021-09-05 18:51:04'),(35,'xMrlhZWxZcMI','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,29,NULL,1,'committed','2021-09-05 18:55:33','2021-09-05 18:55:33','2021-09-05 18:55:35'),(36,'IFjNGI6mXxMC','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,NULL,1,1,'editing','2021-09-05 18:55:46','2021-09-05 18:55:46','2021-09-05 18:55:48'),(37,'Dh5nKqUnPyEh','{\"yC\":\"X0OpwTpaa6zm\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,NULL,1,1,'editing','2021-09-05 18:59:17','2021-09-05 18:59:17','2021-09-05 18:59:21'),(38,'b1ZM5lQcxL2Y','{\"vE\":null,\"9R\":\"4KuRn6Emsh89\",\"en\":null}',9,32,NULL,1,'committed','2021-09-05 18:59:59','2021-09-05 18:59:59','2021-09-05 19:00:00'),(39,'HCQi8CSlupHl','{\"Pi\":null,\"Bb\":\"8ysSYcdFEcid\",\"fU\":null}',6,NULL,1,1,'editing','2021-09-05 19:00:30','2021-09-05 19:00:30','2021-09-05 19:00:30'),(40,'ezP735n5Ygly','{\"yC\":\"V7nYzgXFBmv0\",\"A8\":null}',10,NULL,1,1,'editing','2021-09-05 19:10:08','2021-09-05 19:10:08','2021-09-05 19:10:08'),(41,'4siX7ycH2YIs','{\"yC\":\"oTIsGZ5cKriU\",\"A8\":null}',10,35,NULL,1,'committed','2021-09-05 19:11:08','2021-09-05 19:11:08','2021-09-05 19:11:09'),(42,'Ef7uHhxiM5Di','{\"yC\":\"v3hQaOy1ygr3\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,36,NULL,1,'committed','2021-09-05 19:11:56','2021-09-05 19:11:56','2021-09-05 19:12:06'),(43,'SCB2eXHoTcvR','{\"yC\":\"wlHdZ8T3ldNB\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,37,NULL,1,'committed','2021-09-05 19:12:29','2021-09-05 19:12:29','2021-09-05 19:13:47'),(44,'aP5TgFdhfFyq','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,38,NULL,1,'committed','2021-09-05 19:17:13','2021-09-05 19:17:13','2021-09-05 19:17:15'),(45,'IdhHhQNK7bRg','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,39,NULL,1,'committed','2021-09-05 19:17:24','2021-09-05 19:17:24','2021-09-05 19:17:27'),(46,'2ZdERJFKx6s2','{\"yC\":\"HLcSQ7o5Jgoh\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,NULL,1,1,'editing','2021-09-05 19:17:37','2021-09-05 19:17:37','2021-09-05 19:17:49'),(47,'fTEaYcuvr861','{\"yC\":\"7L4VwZCeaL6a\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,41,NULL,1,'committed','2021-09-05 19:18:39','2021-09-05 19:18:39','2021-09-05 19:18:40'),(48,'BvmryF5O5Idu','{\"yC\":\"Gwwv76VD67fG\",\"A8\":\"e2ZNOyiBp4Ky\"}',10,NULL,1,1,'editing','2021-09-05 19:18:59','2021-09-05 19:18:59','2021-09-05 19:19:01'),(49,'DcDF56vfAgcg','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,43,NULL,1,'committed','2021-09-05 19:25:14','2021-09-05 19:25:14','2021-09-05 19:25:17'),(50,'LGU17lqLUBiE','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,NULL,1,1,'editing','2021-09-05 20:10:43','2021-09-05 20:10:43','2021-09-05 20:10:43'),(51,'entqXm6vYCwV','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,NULL,1,1,'editing','2021-09-05 20:16:32','2021-09-05 20:16:32','2021-09-05 20:16:32'),(52,'9os2yByI0MhK','{\"yC\":null,\"A8\":\"e2ZNOyiBp4Ky\"}',10,44,NULL,1,'committed','2021-09-08 00:23:11','2021-09-08 00:23:11','2021-09-08 00:23:12');
/*!40000 ALTER TABLE `content_draft` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_editing`
--

DROP TABLE IF EXISTS `content_editing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_editing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `draftId` int NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `basedCommitId` int DEFAULT NULL,
  `state` enum('editing','committed','canceled') NOT NULL DEFAULT 'editing',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_f43269b117f9be01e087811e8a` (`entityId`),
  KEY `FK_613f170fdafe925593141313bc9` (`draftId`),
  KEY `FK_60e593d299811c62ee7c8b78f67` (`userId`),
  KEY `FK_a72026032a0899d6ba23d4ecda0` (`basedCommitId`),
  CONSTRAINT `FK_60e593d299811c62ee7c8b78f67` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_613f170fdafe925593141313bc9` FOREIGN KEY (`draftId`) REFERENCES `content_draft` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_a72026032a0899d6ba23d4ecda0` FOREIGN KEY (`basedCommitId`) REFERENCES `content_commit` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_editing`
--

LOCK TABLES `content_editing` WRITE;
/*!40000 ALTER TABLE `content_editing` DISABLE KEYS */;
/*!40000 ALTER TABLE `content_editing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `format`
--

DROP TABLE IF EXISTS `format`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `format` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `displayId` varchar(15) NOT NULL,
  `displayName` varchar(50) NOT NULL,
  `spaceId` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `currentStructureId` int DEFAULT NULL,
  `usage` enum('internal','external') NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `creatorUserId` int NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updaterUserId` int NOT NULL,
  `semanticId` char(2) DEFAULT NULL,
  `latestVersion` int NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_558a64aa90823a7ef2f0425d72` (`entityId`),
  UNIQUE KEY `IDX_7ed95d9b29a36a4fd8f17525da` (`displayId`),
  UNIQUE KEY `REL_7ac39ed4d8c6536e75e89cf773` (`currentStructureId`),
  KEY `FK_afe4a713ce8228a28596d6ded7d` (`spaceId`),
  KEY `FK_3e72cd44e406e4c9aee7cff881e` (`creatorUserId`),
  KEY `FK_40ac84ef9d436f09d8b791dca31` (`updaterUserId`),
  CONSTRAINT `FK_3e72cd44e406e4c9aee7cff881e` FOREIGN KEY (`creatorUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_40ac84ef9d436f09d8b791dca31` FOREIGN KEY (`updaterUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_7ac39ed4d8c6536e75e89cf7732` FOREIGN KEY (`currentStructureId`) REFERENCES `structure` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_afe4a713ce8228a28596d6ded7d` FOREIGN KEY (`spaceId`) REFERENCES `space` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `format`
--

LOCK TABLES `format` WRITE;
/*!40000 ALTER TABLE `format` DISABLE KEYS */;
INSERT INTO `format` VALUES (1,'a7TsQG2XdwSz','135605421976660','イベント',1,'',6,'internal','2021-07-23 15:49:18',1,'2021-08-15 00:23:20',1,NULL,3,'calendar-check'),(2,'JGH8AscqKUji','674788230499928','作品',1,'',9,'internal','2021-07-23 15:49:38',1,'2021-08-15 00:42:59',1,NULL,4,'pen-nib'),(3,'81XJKVj3AQ5E','827823607070710','作品２]',1,'',10,'internal','2021-09-05 17:54:32',1,'2021-09-05 17:54:32',1,NULL,1,NULL);
/*!40000 ALTER TABLE `format` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material`
--

DROP TABLE IF EXISTS `material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `contentId` int DEFAULT NULL,
  `spaceId` int DEFAULT NULL,
  `not_null_constrain` int GENERATED ALWAYS AS (coalesce(`contentId`,`spaceId`)) VIRTUAL NOT NULL,
  `materialType` enum('plaintext','document') NOT NULL,
  `commitId` int DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `creatorUserId` int NOT NULL,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updaterUserId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_0aa5ae509014ffac460e86cb66` (`entityId`),
  UNIQUE KEY `REL_1181c3327e2961b5736a8c11ab` (`commitId`),
  KEY `FK_0ae6f05ba2d9465efc9145fff00` (`creatorUserId`),
  KEY `FK_614a14113f562c8369c7288893c` (`updaterUserId`),
  KEY `FK_9f8cba549b04be806b4cb8c2db5` (`contentId`),
  KEY `FK_3a0a05be34bbc3573c273d4c409` (`spaceId`),
  CONSTRAINT `FK_0ae6f05ba2d9465efc9145fff00` FOREIGN KEY (`creatorUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_1181c3327e2961b5736a8c11ab3` FOREIGN KEY (`commitId`) REFERENCES `material_commit` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_3a0a05be34bbc3573c273d4c409` FOREIGN KEY (`spaceId`) REFERENCES `space` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_614a14113f562c8369c7288893c` FOREIGN KEY (`updaterUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_9f8cba549b04be806b4cb8c2db5` FOREIGN KEY (`contentId`) REFERENCES `content` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material`
--

LOCK TABLES `material` WRITE;
/*!40000 ALTER TABLE `material` DISABLE KEYS */;
INSERT INTO `material` (`id`, `entityId`, `contentId`, `spaceId`, `materialType`, `commitId`, `createdAt`, `creatorUserId`, `updatedAt`, `updaterUserId`) VALUES (4,'UvasN88atl1p',4,NULL,'document',7,'2021-08-12 01:07:12',1,'2021-08-12 01:07:12',1),(5,'0oiFIuVlgKV6',5,NULL,'document',8,'2021-08-12 01:08:34',1,'2021-08-12 01:08:34',1),(6,'5paorPpFTpVo',6,NULL,'document',20,'2021-08-12 01:14:35',1,'2021-08-18 15:40:47',1),(7,'OIYe0vOsmxRF',7,NULL,'document',10,'2021-08-12 12:50:12',1,'2021-08-12 12:50:12',1),(8,'B9pBCF3GmLBs',8,NULL,'document',11,'2021-08-12 12:59:45',1,'2021-08-12 12:59:45',1),(9,'0dHqDHln7ycn',9,NULL,'document',12,'2021-08-12 13:18:29',1,'2021-08-12 13:18:29',1),(10,'BWF5S4eEEGHD',10,NULL,'document',22,'2021-08-12 13:31:01',1,'2021-08-19 15:47:41',1),(11,'MP1GsIeei1rn',14,NULL,'document',23,'2021-08-29 21:40:09',1,'2021-08-29 21:40:09',1),(14,'9frT0J9icZc2',24,NULL,'plaintext',26,'2021-09-05 18:49:50',1,'2021-09-05 18:49:50',1),(15,'hvrmDr2xMcZB',25,NULL,'plaintext',27,'2021-09-05 18:50:03',1,'2021-09-05 18:50:03',1),(16,'XMHM126elV51',26,NULL,'plaintext',28,'2021-09-05 18:50:18',1,'2021-09-05 18:50:18',1),(17,'3SqdqWkfgTkJ',27,NULL,'plaintext',29,'2021-09-05 18:50:41',1,'2021-09-05 18:50:41',1),(21,'vWT2EUM53dG1',32,NULL,'document',33,'2021-09-05 19:00:00',1,'2021-09-05 19:00:00',1),(24,'G5Zujb4FWJl7',35,NULL,'plaintext',36,'2021-09-05 19:11:09',1,'2021-09-05 19:11:09',1),(25,'FfflgAEArli9',36,NULL,'plaintext',37,'2021-09-05 19:12:06',1,'2021-09-05 19:12:06',1),(26,'ahfaVm6e3pI7',37,NULL,'plaintext',38,'2021-09-05 19:13:47',1,'2021-09-05 19:13:47',1),(27,'P63P7w28WX4S',39,NULL,'plaintext',39,'2021-09-05 19:17:27',1,'2021-09-05 19:17:27',1),(29,'VLkAXu4cTeCe',41,NULL,'plaintext',41,'2021-09-05 19:18:40',1,'2021-09-05 19:18:40',1),(31,'49l2rg6IM2pf',43,NULL,'plaintext',43,'2021-09-05 19:25:17',1,'2021-09-05 19:25:17',1);
/*!40000 ALTER TABLE `material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_commit`
--

DROP TABLE IF EXISTS `material_commit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_commit` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `parentCommitId` int DEFAULT NULL,
  `data` text NOT NULL,
  `textCount` int NOT NULL,
  `beginning` varchar(140) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `basedCommitId` int DEFAULT NULL,
  `committerUserId` int NOT NULL,
  `editingId` int DEFAULT NULL,
  `materialId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_dfaa8c08905670064a73950219` (`entityId`),
  UNIQUE KEY `REL_9ce00459cb203b562c66ddbaf7` (`parentCommitId`),
  UNIQUE KEY `REL_4880fc349d7a29fd0e80cbfedf` (`editingId`),
  KEY `FK_6e7a643fa4f6159d3e78951fd24` (`basedCommitId`),
  KEY `FK_ba0119314c789d4e353285d6be3` (`committerUserId`),
  KEY `FK_5f234546e22a1472260faed045f` (`materialId`),
  CONSTRAINT `FK_4880fc349d7a29fd0e80cbfedff` FOREIGN KEY (`editingId`) REFERENCES `material_editing` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_5f234546e22a1472260faed045f` FOREIGN KEY (`materialId`) REFERENCES `material` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_6e7a643fa4f6159d3e78951fd24` FOREIGN KEY (`basedCommitId`) REFERENCES `material_commit` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_9ce00459cb203b562c66ddbaf70` FOREIGN KEY (`parentCommitId`) REFERENCES `content_commit` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_ba0119314c789d4e353285d6be3` FOREIGN KEY (`committerUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_commit`
--

LOCK TABLES `material_commit` WRITE;
/*!40000 ALTER TABLE `material_commit` DISABLE KEYS */;
INSERT INTO `material_commit` VALUES (7,'7bfeRjoXSsSO',NULL,'{\"blocks\":[{\"id\":\"1\",\"data\":{\"type\":\"paragraph\",\"text\":\"dtejxt4\"}}]}',8,'dtejxt4 ','2021-08-12 01:07:12',NULL,1,NULL,4),(8,'rGd0vl2rPBAu',NULL,'{\"blocks\":[{\"id\":\"1\",\"data\":{\"type\":\"paragraph\",\"text\":\"っwtextwe\"}}]}',9,'っwtextwe ','2021-08-12 01:08:34',NULL,1,NULL,5),(9,'XMhbqk0bluve',NULL,'{\"blocks\":[{\"id\":\"1\",\"data\":{\"type\":\"paragraph\",\"text\":\"れfれw\"}}]}',5,'れfれw ','2021-08-12 01:14:35',NULL,1,NULL,6),(10,'fsUCbx4jJlnJ',NULL,'{\"blocks\":[{\"id\":\"DebUrAzYXkiS\",\"data\":{\"type\":\"paragraph\",\"text\":\"rrrrrfff\"}}]}',9,'rrrrrfff ','2021-08-12 12:50:12',NULL,1,NULL,7),(11,'iPNFbEiNlc53',NULL,'{\"blocks\":[{\"id\":\"1\",\"data\":{\"type\":\"paragraph\",\"text\":\"fwqfクェrfれfれrrfrefrewfれwfwっっっfrrrrrrrrrrrteyxthhhf\"}}]}',50,'fwqfクェrfれfれrrfrefrewfれwfwっっっfrrrrrrrrrrrteyxthhhf ','2021-08-12 12:59:45',NULL,1,NULL,8),(12,'uif8o5rCJfeQ',NULL,'{\"blocks\":[{\"id\":\"sFeCx9SQx1Ku\",\"data\":{\"type\":\"paragraph\",\"text\":\"最新の作品\"}}]}',6,'最新の作品 ','2021-08-12 13:18:29',NULL,1,NULL,9),(13,'rynSeBgn5MmD',NULL,'{\"blocks\":[{\"id\":\"M1Y8zFjaORjo\",\"data\":{\"type\":\"header\",\"level\":1,\"text\":\"frewfrewfrew\"}},{\"id\":\"dfeVe6N436mK\",\"data\":{\"type\":\"paragraph\",\"text\":\"24321432143214321432143214321432143214321\"}},{\"id\":\"YjdRUz2cKh7k\",\"data\":{\"type\":\"paragraph\",\"text\":\"43214321432143214321\"}},{\"id\":\"5KOpYM5XASsq\",\"data\":{\"type\":\"paragraph\",\"text\":\"rr321r\"}}]}',83,'frewfrewfrew 24321432143214321432143214321432143214321 43214321432143214321 rr321r ','2021-08-12 13:31:01',NULL,1,NULL,10),(14,'aB05RECumwV4',NULL,'{\"blocks\":[{\"id\":\"1\",\"data\":{\"type\":\"paragraph\",\"text\":\"れfれw\"}}]}',5,'れfれw ','2021-08-17 17:04:29',NULL,1,NULL,6),(15,'hzedMnibcgaI',NULL,'{\"blocks\":[{\"id\":\"1\",\"data\":{\"type\":\"paragraph\",\"text\":\"れfれw4\"}}]}',6,'れfれw4 ','2021-08-18 15:40:07',NULL,1,NULL,6),(16,'cwHAyGwycPTE',NULL,'{\"blocks\":[{\"id\":\"1\",\"data\":{\"type\":\"paragraph\",\"text\":\"r4r4r4rれfれw4r4\"}}]}',15,'r4r4r4rれfれw4r4 ','2021-08-18 15:40:23',NULL,1,NULL,6),(17,'g6AIAIWxEI6a',NULL,'{\"blocks\":[{\"id\":\"1\",\"data\":{\"type\":\"paragraph\",\"text\":\"rrrrr4r4r4rれfれw4r4rrrrrrr\"}}]}',26,'rrrrr4r4r4rれfれw4r4rrrrrrr ','2021-08-18 15:40:31',NULL,1,NULL,6),(18,'xnBUwhoJDEgw',NULL,'{\"blocks\":[{\"id\":\"1\",\"data\":{\"type\":\"paragraph\",\"text\":\"rrrrr4r4r4rれfれw4r4rrrrrrr\"}}]}',26,'rrrrr4r4r4rれfれw4r4rrrrrrr ','2021-08-18 15:40:35',NULL,1,NULL,6),(19,'JgOTOi1fTSqC',NULL,'{\"blocks\":[{\"id\":\"1\",\"data\":{\"type\":\"paragraph\",\"text\":\"rrrrr4r4r4rれfれw4r4rrrrrrr\"}}]}',26,'rrrrr4r4r4rれfれw4r4rrrrrrr ','2021-08-18 15:40:38',NULL,1,NULL,6),(20,'KMgne5P1ZVep',NULL,'{\"blocks\":[{\"id\":\"1\",\"data\":{\"type\":\"paragraph\",\"text\":\"eeeeeeeeeeeeeerrrrer4r4r4rれfれw4r4rrrrrrreeeee\"}}]}',46,'eeeeeeeeeeeeeerrrrer4r4r4rれfれw4r4rrrrrrreeeee ','2021-08-18 15:40:47',NULL,1,NULL,6),(21,'StZYAVATQoER',NULL,'{\"blocks\":[{\"id\":\"M1Y8zFjaORjo\",\"data\":{\"type\":\"header\",\"level\":1,\"text\":\"frewfrewfrew\"}},{\"id\":\"dfeVe6N436mK\",\"data\":{\"type\":\"paragraph\",\"text\":\"24321432143214321432143214321432143214321\"}},{\"id\":\"YjdRUz2cKh7k\",\"data\":{\"type\":\"paragraph\",\"text\":\"43214321432143214321\"}},{\"id\":\"5KOpYM5XASsq\",\"data\":{\"type\":\"paragraph\",\"text\":\"rr321r、\"}}]}',84,'frewfrewfrew 24321432143214321432143214321432143214321 43214321432143214321 rr321r、 ','2021-08-19 15:47:35',NULL,1,NULL,10),(22,'gn7hqaC6EhLX',NULL,'{\"blocks\":[{\"id\":\"M1Y8zFjaORjo\",\"data\":{\"type\":\"header\",\"level\":1,\"text\":\"frewfrewfrew\"}},{\"id\":\"dfeVe6N436mK\",\"data\":{\"type\":\"paragraph\",\"text\":\"24321432143214321432143214321432143214321\"}},{\"id\":\"YjdRUz2cKh7k\",\"data\":{\"type\":\"paragraph\",\"text\":\"43214321432143214321\"}},{\"id\":\"5KOpYM5XASsq\",\"data\":{\"type\":\"paragraph\",\"text\":\"rr321r、\"}}]}',84,'frewfrewfrew 24321432143214321432143214321432143214321 43214321432143214321 rr321r、 ','2021-08-19 15:47:41',NULL,1,NULL,10),(23,'91iwtqAiIvdc',NULL,'{\"blocks\":[{\"id\":\"EIAWnPIuwnT3\",\"data\":{\"type\":\"paragraph\",\"text\":\"vfdsvfds\"}}]}',9,'vfdsvfds ','2021-08-29 21:40:09',NULL,1,NULL,11),(26,'zTXPueVwmsn7',NULL,'',0,'','2021-09-05 18:49:50',NULL,1,320,14),(27,'2mgxcl4xwei2',NULL,'',0,'','2021-09-05 18:50:03',NULL,1,321,15),(28,'OzHaqUAfepym',NULL,'',0,'','2021-09-05 18:50:18',NULL,1,322,16),(29,'7Rmcqu8eQIT6',NULL,'',0,'','2021-09-05 18:50:41',NULL,1,323,17),(33,'4jBvKWJ2b5Pc',NULL,'{\"blocks\":[{\"id\":\"goKoqTCdS3E2\",\"data\":{\"type\":\"paragraph\",\"text\":\"dewdewdewd\"}}]}',11,'dewdewdewd ','2021-09-05 19:00:00',NULL,1,328,21),(36,'wjptehgSVUDf',NULL,'',0,'','2021-09-05 19:11:09',NULL,1,331,24),(37,'oyW8UxXRAbFz',NULL,'',0,'','2021-09-05 19:12:06',NULL,1,332,25),(38,'1tJgLzkni0WV',NULL,'',0,'','2021-09-05 19:13:47',NULL,1,333,26),(39,'HStwvBuLw54l',NULL,'mmmmmm',6,'mmmmmm','2021-09-05 19:17:27',NULL,1,335,27),(41,'uCwFebICLGJf',NULL,'s',1,'s','2021-09-05 19:18:40',NULL,1,337,29),(43,'2B1kYr7rPf2d',NULL,'mmm',3,'mmm','2021-09-05 19:25:17',NULL,1,339,31);
/*!40000 ALTER TABLE `material_commit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_draft`
--

DROP TABLE IF EXISTS `material_draft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_draft` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `materialId` int DEFAULT NULL,
  `intendedContentDraftId` int DEFAULT NULL,
  `intendedSpaceId` int DEFAULT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `changeType` enum('initial','write','remove') NOT NULL DEFAULT 'initial',
  `currentEditingId` int DEFAULT NULL,
  `intendedMaterialType` enum('plaintext','document') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_bf61a1b682dc6085cd88e57911` (`entityId`),
  UNIQUE KEY `IDX_cf2c08cdbe545ee37af8caaa8e` (`materialId`,`userId`),
  UNIQUE KEY `REL_2cd2dfeff7d6de4af5bfe72b78` (`currentEditingId`),
  KEY `FK_0d682c5cb05c8934e724e418274` (`intendedContentDraftId`),
  KEY `FK_d64b061470ed55af813283e2c03` (`intendedSpaceId`),
  KEY `FK_340715673be31e7d653449f9644` (`userId`),
  CONSTRAINT `FK_0d682c5cb05c8934e724e418274` FOREIGN KEY (`intendedContentDraftId`) REFERENCES `content_draft` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_2cd2dfeff7d6de4af5bfe72b789` FOREIGN KEY (`currentEditingId`) REFERENCES `material_editing` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_340715673be31e7d653449f9644` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_859466b6d09853a5fcdad372e91` FOREIGN KEY (`materialId`) REFERENCES `material` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_d64b061470ed55af813283e2c03` FOREIGN KEY (`intendedSpaceId`) REFERENCES `space` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=327 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_draft`
--

LOCK TABLES `material_draft` WRITE;
/*!40000 ALTER TABLE `material_draft` DISABLE KEYS */;
INSERT INTO `material_draft` VALUES (87,'f4MPGfQtws4w',6,NULL,NULL,1,'2021-09-05 13:50:53','2021-09-05 13:50:53','initial',101,'plaintext'),(88,'BqRgGAYa1vlt',NULL,NULL,NULL,1,'2021-09-05 17:58:40','2021-09-05 17:58:40','initial',102,'document'),(297,'oaPsHcIqs6my',NULL,NULL,NULL,1,'2021-09-05 18:35:18','2021-09-05 18:35:18','initial',311,'plaintext'),(298,'gbPi5DLeLpoD',NULL,NULL,NULL,1,'2021-09-05 18:35:40','2021-09-05 18:35:40','initial',312,'plaintext'),(299,'XfRnmAzyAEFy',NULL,NULL,NULL,1,'2021-09-05 18:36:00','2021-09-05 18:36:00','initial',313,'plaintext'),(300,'7z2p0S6oh30p',NULL,NULL,NULL,1,'2021-09-05 18:37:25','2021-09-05 18:37:25','initial',314,'plaintext'),(301,'bLq5muWELlVG',NULL,NULL,NULL,1,'2021-09-05 18:37:36','2021-09-05 18:37:36','initial',315,'plaintext'),(302,'2hRK7t1f62D1',NULL,NULL,NULL,1,'2021-09-05 18:38:14','2021-09-05 18:38:14','initial',316,'plaintext'),(303,'jOZi6jExCUwv',NULL,NULL,NULL,1,'2021-09-05 18:40:48','2021-09-05 18:40:48','initial',317,'plaintext'),(304,'OMTmKdQxb8Rs',NULL,NULL,NULL,1,'2021-09-05 18:40:58','2021-09-05 18:40:58','initial',318,'plaintext'),(305,'WterfIsxtnMc',NULL,NULL,NULL,1,'2021-09-05 18:47:48','2021-09-05 18:47:48','initial',319,'plaintext'),(306,'mJGgTxrKo5EJ',14,NULL,NULL,1,'2021-09-05 18:49:48','2021-09-05 18:49:50','initial',NULL,'plaintext'),(307,'tr3gm8imNwfD',15,NULL,NULL,1,'2021-09-05 18:49:58','2021-09-05 18:50:03','initial',NULL,'plaintext'),(308,'YvUaxEZzxJVd',16,NULL,NULL,1,'2021-09-05 18:50:17','2021-09-05 18:50:18','initial',NULL,'plaintext'),(309,'3gvoK6F5CsO4',17,NULL,NULL,1,'2021-09-05 18:50:38','2021-09-05 18:50:41','initial',NULL,'plaintext'),(310,'nl3f4a3ti74a',NULL,NULL,NULL,1,'2021-09-05 18:51:03','2021-09-05 18:51:03','initial',324,'plaintext'),(311,'LDPNt89cUg1R',NULL,NULL,NULL,1,'2021-09-05 18:55:35','2021-09-05 18:55:35','initial',325,'plaintext'),(312,'XPwiqerFjYaD',NULL,NULL,NULL,1,'2021-09-05 18:55:50','2021-09-05 18:55:50','initial',326,'plaintext'),(313,'X0OpwTpaa6zm',NULL,NULL,NULL,1,'2021-09-05 18:59:20','2021-09-05 18:59:20','initial',327,'plaintext'),(314,'4KuRn6Emsh89',21,38,NULL,1,'2021-09-05 18:59:57','2021-09-05 19:00:00','initial',NULL,'document'),(315,'8ysSYcdFEcid',NULL,39,NULL,1,'2021-09-05 19:00:29','2021-09-05 19:00:30','initial',329,'document'),(316,'V7nYzgXFBmv0',NULL,NULL,NULL,1,'2021-09-05 19:10:06','2021-09-05 19:10:06','initial',330,'plaintext'),(317,'oTIsGZ5cKriU',24,NULL,NULL,1,'2021-09-05 19:11:07','2021-09-05 19:11:09','initial',NULL,'plaintext'),(318,'v3hQaOy1ygr3',25,NULL,NULL,1,'2021-09-05 19:11:59','2021-09-05 19:12:06','initial',NULL,'plaintext'),(319,'wlHdZ8T3ldNB',26,NULL,NULL,1,'2021-09-05 19:12:30','2021-09-05 19:13:47','initial',NULL,'plaintext'),(320,'2WXcxi5d8PQQ',NULL,NULL,NULL,1,'2021-09-05 19:17:15','2021-09-05 19:17:15','initial',334,'plaintext'),(321,'iedfaroTDmsG',27,NULL,NULL,1,'2021-09-05 19:17:24','2021-09-05 19:17:27','initial',NULL,'plaintext'),(322,'HLcSQ7o5Jgoh',NULL,NULL,NULL,1,'2021-09-05 19:17:48','2021-09-05 19:17:48','initial',336,'plaintext'),(323,'7L4VwZCeaL6a',29,NULL,NULL,1,'2021-09-05 19:18:38','2021-09-05 19:18:40','initial',NULL,'plaintext'),(324,'Gwwv76VD67fG',NULL,NULL,NULL,1,'2021-09-05 19:19:00','2021-09-05 19:19:00','initial',338,'plaintext'),(325,'uYLIBdUfeHg3',31,NULL,NULL,1,'2021-09-05 19:25:16','2021-09-05 19:25:17','initial',NULL,'plaintext'),(326,'KRoQf2La1Wbf',NULL,NULL,NULL,1,'2021-09-08 00:23:12','2021-09-08 00:23:12','initial',340,'plaintext');
/*!40000 ALTER TABLE `material_draft` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_editing`
--

DROP TABLE IF EXISTS `material_editing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_editing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `draftId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `basedCommitId` int DEFAULT NULL,
  `state` enum('editing','committed','canceled') NOT NULL DEFAULT 'editing',
  `snapshotId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_875f5a2ac8deac48248005643e` (`entityId`),
  UNIQUE KEY `REL_138f2228d89c55f6c7ea9da9fa` (`snapshotId`),
  KEY `FK_fccf9ade6901030d7862096a96b` (`draftId`),
  KEY `FK_4fbb8c120ef3e6d8f735622d5cd` (`basedCommitId`),
  CONSTRAINT `FK_138f2228d89c55f6c7ea9da9fa9` FOREIGN KEY (`snapshotId`) REFERENCES `material_snapshot` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_4fbb8c120ef3e6d8f735622d5cd` FOREIGN KEY (`basedCommitId`) REFERENCES `material_commit` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_fccf9ade6901030d7862096a96b` FOREIGN KEY (`draftId`) REFERENCES `material_draft` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=341 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_editing`
--

LOCK TABLES `material_editing` WRITE;
/*!40000 ALTER TABLE `material_editing` DISABLE KEYS */;
INSERT INTO `material_editing` VALUES (101,'kiUTncy0Tlx4',87,'2021-09-05 13:50:53','2021-09-05 14:15:53',NULL,'editing',122),(102,'ckYQIKOq7TIN',88,'2021-09-05 17:58:40','2021-09-05 17:58:40',NULL,'editing',123),(311,'HRTOmUyXSVS3',297,'2021-09-05 18:35:18','2021-09-05 18:35:18',NULL,'editing',124),(312,'FaUq2gy3gehE',298,'2021-09-05 18:35:40','2021-09-05 18:35:40',NULL,'editing',125),(313,'jkpNeBc3Eb7j',299,'2021-09-05 18:36:00','2021-09-05 18:36:00',NULL,'editing',126),(314,'qn5UfVacDSyy',300,'2021-09-05 18:37:25','2021-09-05 18:37:25',NULL,'editing',127),(315,'XnH95mAdsjC3',301,'2021-09-05 18:37:36','2021-09-05 18:37:36',NULL,'editing',128),(316,'fOGYHCbxcM9p',302,'2021-09-05 18:38:14','2021-09-05 18:38:14',NULL,'editing',129),(317,'cNNfrVKOYHz3',303,'2021-09-05 18:40:48','2021-09-05 18:40:48',NULL,'editing',130),(318,'xUFShkr3k8sr',304,'2021-09-05 18:40:58','2021-09-05 18:40:58',NULL,'editing',131),(319,'Ggw3oB5icCwf',305,'2021-09-05 18:47:48','2021-09-05 18:47:48',NULL,'editing',132),(320,'sQGnSXnITM0l',306,'2021-09-05 18:49:48','2021-09-05 18:49:50',NULL,'committed',133),(321,'00QaYexPH0qv',307,'2021-09-05 18:49:58','2021-09-05 18:50:03',NULL,'committed',134),(322,'fcDfiuTJcg6q',308,'2021-09-05 18:50:17','2021-09-05 18:50:18',NULL,'committed',135),(323,'eaQTdqMdi9GU',309,'2021-09-05 18:50:38','2021-09-05 18:50:41',NULL,'committed',136),(324,'Z9AYcyXJFiIW',310,'2021-09-05 18:51:03','2021-09-05 18:51:03',NULL,'editing',137),(325,'ZI59yX0qqeYO',311,'2021-09-05 18:55:35','2021-09-05 18:55:35',NULL,'editing',138),(326,'KVkSWdJk9b8G',312,'2021-09-05 18:55:50','2021-09-05 18:55:50',NULL,'editing',139),(327,'9DAcp4lTg233',313,'2021-09-05 18:59:20','2021-09-05 18:59:20',NULL,'editing',140),(328,'Jo8K54ysfqKe',314,'2021-09-05 18:59:57','2021-09-05 19:00:00',NULL,'committed',141),(329,'PeHO58xAHGCO',315,'2021-09-05 19:00:29','2021-09-05 19:00:29',NULL,'editing',142),(330,'TCZqefmRmdME',316,'2021-09-05 19:10:06','2021-09-05 19:10:06',NULL,'editing',143),(331,'SZeXz3qBrZcN',317,'2021-09-05 19:11:07','2021-09-05 19:11:09',NULL,'committed',144),(332,'RUSDdRZynpay',318,'2021-09-05 19:11:59','2021-09-05 19:12:06',NULL,'committed',145),(333,'Qjv1ZQcrTErp',319,'2021-09-05 19:12:30','2021-09-05 19:13:47',NULL,'committed',146),(334,'4GauuJBcdRPg',320,'2021-09-05 19:17:15','2021-09-05 19:17:15',NULL,'editing',147),(335,'U0KaZ2W99Aqv',321,'2021-09-05 19:17:24','2021-09-05 19:17:27',NULL,'committed',148),(336,'vpzxMP4QchHk',322,'2021-09-05 19:17:48','2021-09-05 19:17:48',NULL,'editing',149),(337,'pLCjA17fOfZj',323,'2021-09-05 19:18:38','2021-09-05 19:18:40',NULL,'committed',150),(338,'v5yORihudROk',324,'2021-09-05 19:19:00','2021-09-05 19:19:00',NULL,'editing',151),(339,'pMAz6m9D7gxz',325,'2021-09-05 19:25:16','2021-09-05 19:25:17',NULL,'committed',152),(340,'3Ab2rBDWjEKP',326,'2021-09-08 00:23:12','2021-09-08 00:23:12',NULL,'editing',153);
/*!40000 ALTER TABLE `material_editing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_snapshot`
--

DROP TABLE IF EXISTS `material_snapshot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_snapshot` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `editingId` int NOT NULL,
  `data` text NOT NULL,
  `textCount` int NOT NULL,
  `beginning` varchar(140) NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_43671d8fde79ed6eed0d4d41db` (`entityId`),
  KEY `FK_9a780355d86b129ddbed81e7919` (`editingId`),
  CONSTRAINT `FK_9a780355d86b129ddbed81e7919` FOREIGN KEY (`editingId`) REFERENCES `material_editing` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=154 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_snapshot`
--

LOCK TABLES `material_snapshot` WRITE;
/*!40000 ALTER TABLE `material_snapshot` DISABLE KEYS */;
INSERT INTO `material_snapshot` VALUES (121,'Mlcqg3roXILu',101,'{\"blocks\":[{\"id\":\"1\",\"data\":{\"type\":\"paragraph\",\"text\":\"eeeeeeeeeeeeeerrrrer4r4r4rれfれw4r4rrrrrrreeeee\"}}]}',46,'eeeeeeeeeeeeeerrrrer4r4r4rれfれw4r4rrrrrrreeeee ','2021-09-05 13:50:53'),(122,'btBF1fO7zdyg',101,'{\"blocks\":[{\"id\":\"1\",\"data\":{\"type\":\"paragraph\",\"text\":\"eeeeeeeeeeeeeerrrrer4r4r4rれfれw4r4rrrrrrreeeee\"}}]}',46,'eeeeeeeeeeeeeerrrrer4r4r4rれfれw4r4rrrrrrreeeee ','2021-09-05 14:15:53'),(123,'DoBx1QZaVYkk',102,'{\"blocks\":[{\"id\":\"CQPTf6aluVnf\",\"data\":{\"type\":\"header\",\"level\":1,\"text\":\"frew\"}}]}',2,'# ','2021-09-05 17:58:43'),(124,'HeYsRswEZGkU',311,'cdsacdsacdascsdrewfrewfrew',26,'cdsacdsacdascsdrewfrewfrew','2021-09-05 18:35:24'),(125,'zY7YacUjiJqM',312,'うんこ',3,'うんこ','2021-09-05 18:35:40'),(126,'WgFdb1wFDkOv',313,'ddd',3,'ddd','2021-09-05 18:36:00'),(127,'LG019c3zH95g',314,'frefrefe',8,'frefrefe','2021-09-05 18:37:25'),(128,'KRf8mkhFJ5RT',315,'frewfrew',8,'frewfrew','2021-09-05 18:37:36'),(129,'D8CpDxbalEkX',316,'ddddd',5,'ddddd','2021-09-05 18:38:14'),(130,'5sDSzFx127YI',317,'cdacw',5,'cdacw','2021-09-05 18:40:48'),(131,'0BkW3T3HAwbK',318,'ffvvfffff',9,'ffvvfffff','2021-09-05 18:41:00'),(132,'AUJVQXjZEazW',319,'kkkkkooooo',10,'kkkkkooooo','2021-09-05 18:48:10'),(133,'th6bfdJYoNX1',320,'dewqdewq',8,'dewqdewq','2021-09-05 18:49:50'),(134,'klhpG9Fwp3v0',321,'dewqdewq',8,'dewqdewq','2021-09-05 18:49:58'),(135,'uAoqj5HeQUAW',322,'eeeeee',6,'eeeeee','2021-09-05 18:50:17'),(136,'l4AaFTstWpcI',323,'dddd',4,'dddd','2021-09-05 18:50:38'),(137,'Jw1Sv1xgsxAh',324,'ddddd',5,'ddddd','2021-09-05 18:51:03'),(138,'MhcelIWh88xq',325,'dewqdewq',8,'dewqdewq','2021-09-05 18:55:35'),(139,'hdaVHcIEmaVB',326,'dewqdewq',8,'dewqdewq','2021-09-05 18:55:50'),(140,'3eeOwyeLMMLl',327,'dddd',4,'dddd','2021-09-05 18:59:20'),(141,'TSsIPwItf3nL',328,'{\"blocks\":[{\"id\":\"goKoqTCdS3E2\",\"data\":{\"type\":\"paragraph\",\"text\":\"dewdewdewd\"}}]}',11,'dewdewdewd ','2021-09-05 18:59:57'),(142,'TQ2ahPB9ikzm',329,'{\"blocks\":[{\"id\":\"o3IuvA4lQuaS\",\"data\":{\"type\":\"paragraph\",\"text\":\"jjj\"}}]}',4,'jjj ','2021-09-05 19:00:29'),(143,'eAFiveROLAMf',330,'nnnn',4,'nnnn','2021-09-05 19:10:06'),(144,'2VbA4qjHX4r2',331,'nnn',3,'nnn','2021-09-05 19:11:09'),(145,'I75dnxbTh5rK',332,'mmmm',4,'mmmm','2021-09-05 19:12:01'),(146,'I1Eq8tiv0BbO',333,'aaaaammmm',9,'aaaaammmm','2021-09-05 19:13:22'),(147,'CEqrCnB9H6hR',334,'mmmm',4,'mmmm','2021-09-05 19:17:15'),(148,'t2gi68Y5Hf92',335,'mmmmmm',6,'mmmmmm','2021-09-05 19:17:26'),(149,'QVh9DauiaGUo',336,'ggg',3,'ggg','2021-09-05 19:17:48'),(150,'h1Qghaa98apz',337,'s',1,'s','2021-09-05 19:18:38'),(151,'zE4PqNilrxRh',338,'ccccvv',6,'ccccvv','2021-09-05 19:19:00'),(152,'hlzLDPRa4Yml',339,'mmm',3,'mmm','2021-09-05 19:25:16'),(153,'07RnpnsXPrDC',340,'ewdewdewd',9,'ewdewdewd','2021-09-08 00:23:12');
/*!40000 ALTER TABLE `material_snapshot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meta_property`
--

DROP TABLE IF EXISTS `meta_property`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meta_property` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `propertyId` int NOT NULL,
  `type` enum('value_relatively','mutual_exclutively','series_dependency') NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_530f5065e165d64bc493a674a7` (`entityId`),
  KEY `FK_1d40325c902df5be037cac44840` (`propertyId`),
  CONSTRAINT `FK_1d40325c902df5be037cac44840` FOREIGN KEY (`propertyId`) REFERENCES `property` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meta_property`
--

LOCK TABLES `meta_property` WRITE;
/*!40000 ALTER TABLE `meta_property` DISABLE KEYS */;
/*!40000 ALTER TABLE `meta_property` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `property`
--

DROP TABLE IF EXISTS `property`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `property` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(2) NOT NULL,
  `formatId` int NOT NULL,
  `parentPropertyId` int DEFAULT NULL,
  `displayName` varchar(50) NOT NULL,
  `fieldName` varchar(100) DEFAULT NULL,
  `semantic` varchar(100) DEFAULT NULL,
  `optional` tinyint NOT NULL DEFAULT '0',
  `order` int NOT NULL,
  `typeName` enum('integer','boolean','string','content','url','object','text','array','enumerator','document','image','entity') NOT NULL,
  `argType` enum('integer','boolean','string','content','url','object','text','array','enumerator','document','image','entity') DEFAULT NULL,
  `argLanguage` enum('python','javascript') DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `argFormatId` int DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_c52c5de8e62a9ad19993a77a97` (`formatId`,`entityId`),
  UNIQUE KEY `IDX_5b4969ecc3900132a9d9966961` (`formatId`,`parentPropertyId`,`order`),
  KEY `FK_f32ef1c406e104a7c2b58b59676` (`parentPropertyId`),
  KEY `FK_b184eb170b10f8157ced4f0e0d0` (`argFormatId`),
  CONSTRAINT `FK_b184eb170b10f8157ced4f0e0d0` FOREIGN KEY (`argFormatId`) REFERENCES `format` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_f223bcde9850aeb80125e8dcee9` FOREIGN KEY (`formatId`) REFERENCES `format` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_f32ef1c406e104a7c2b58b59676` FOREIGN KEY (`parentPropertyId`) REFERENCES `property` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `property`
--

LOCK TABLES `property` WRITE;
/*!40000 ALTER TABLE `property` DISABLE KEYS */;
INSERT INTO `property` VALUES (1,'Pi',1,NULL,'タイトル',NULL,NULL,0,0,'string',NULL,NULL,'2021-07-23 15:49:18','2021-08-14 23:13:36',NULL,NULL),(2,'Vd',1,NULL,'テーマ',NULL,NULL,0,1,'string',NULL,NULL,'2021-07-23 15:49:18','2021-08-14 23:13:36',NULL,NULL),(3,'Bb',1,NULL,'議事録',NULL,NULL,0,2,'document',NULL,NULL,'2021-07-23 15:49:18','2021-08-14 23:13:36',NULL,NULL),(4,'vE',2,NULL,'作者',NULL,NULL,0,0,'string',NULL,NULL,'2021-07-23 15:49:38','2021-08-15 00:48:12',NULL,'user'),(5,'9R',2,NULL,'作品',NULL,NULL,0,1,'document',NULL,NULL,'2021-07-23 15:49:38','2021-08-15 00:48:12',NULL,NULL),(6,'en',2,NULL,'会',NULL,NULL,0,0,'content',NULL,NULL,'2021-07-23 16:39:46','2021-08-15 00:48:12',1,NULL),(7,'Q9',1,NULL,'テーマ',NULL,NULL,0,0,'integer',NULL,NULL,'2021-08-15 00:20:52','2021-08-15 00:20:52',NULL,NULL),(8,'fU',1,NULL,'テーマ',NULL,NULL,0,0,'string',NULL,NULL,'2021-08-15 00:23:20','2021-08-15 00:23:20',NULL,NULL),(11,'yC',3,NULL,'作品',NULL,NULL,0,0,'text',NULL,NULL,'2021-09-05 17:54:32','2021-09-05 17:54:32',NULL,NULL),(12,'A8',3,NULL,'aa',NULL,NULL,0,1,'content',NULL,NULL,'2021-09-05 17:54:32','2021-09-05 17:54:32',2,NULL);
/*!40000 ALTER TABLE `property` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `space`
--

DROP TABLE IF EXISTS `space`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `space` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `displayId` varchar(15) NOT NULL,
  `displayName` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `creatorUserId` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `homeUrl` varchar(100) DEFAULT NULL,
  `membershipMethod` enum('none','app') NOT NULL DEFAULT 'none',
  `published` tinyint NOT NULL DEFAULT '0',
  `defaultAuthority` enum('none','visible','readable','writable') NOT NULL DEFAULT 'none',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_7ffd651cecde18a0a6ef6d4679` (`entityId`),
  UNIQUE KEY `IDX_dd9caf37d9d21dc17414a18a7f` (`displayId`),
  KEY `FK_64227b9f3afc1da8472261e81d8` (`creatorUserId`),
  CONSTRAINT `FK_64227b9f3afc1da8472261e81d8` FOREIGN KEY (`creatorUserId`) REFERENCES `user` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `space`
--

LOCK TABLES `space` WRITE;
/*!40000 ALTER TABLE `space` DISABLE KEYS */;
INSERT INTO `space` VALUES (1,'4KPmsEcdyeb1','930774711778059','文芸会','2021-07-23 13:36:39',1,'',NULL,'none',1,'visible'),(2,'QMhjdhIUKHxm','069413310918290','テスト','2021-07-23 13:46:04',1,'',NULL,'none',0,'none');
/*!40000 ALTER TABLE `space` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `space_follow`
--

DROP TABLE IF EXISTS `space_follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `space_follow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `spaceId` int NOT NULL,
  `userId` int NOT NULL,
  `followedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_40a0f41f6f918e8ac5175976417` (`spaceId`),
  KEY `FK_ca5bf6314cee7a32505cf71d48f` (`userId`),
  CONSTRAINT `FK_40a0f41f6f918e8ac5175976417` FOREIGN KEY (`spaceId`) REFERENCES `space` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_ca5bf6314cee7a32505cf71d48f` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `space_follow`
--

LOCK TABLES `space_follow` WRITE;
/*!40000 ALTER TABLE `space_follow` DISABLE KEYS */;
/*!40000 ALTER TABLE `space_follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `space_member`
--

DROP TABLE IF EXISTS `space_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `space_member` (
  `id` int NOT NULL AUTO_INCREMENT,
  `spaceId` int NOT NULL,
  `userId` int NOT NULL,
  `joinedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` enum('normal','owner') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_c8165cc80d63cbd4b3e06d114c` (`spaceId`,`userId`),
  KEY `FK_6bab1d3085d5e3b69456c81f66c` (`userId`),
  CONSTRAINT `FK_6bab1d3085d5e3b69456c81f66c` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_c6700f460e6c6197d6b520394a7` FOREIGN KEY (`spaceId`) REFERENCES `space` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `space_member`
--

LOCK TABLES `space_member` WRITE;
/*!40000 ALTER TABLE `space_member` DISABLE KEYS */;
INSERT INTO `space_member` VALUES (1,1,1,'2021-07-23 13:36:39','owner'),(2,2,1,'2021-07-23 13:46:04','owner');
/*!40000 ALTER TABLE `space_member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `space_membership_application`
--

DROP TABLE IF EXISTS `space_membership_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `space_membership_application` (
  `id` int NOT NULL AUTO_INCREMENT,
  `spaceId` int NOT NULL,
  `userId` int NOT NULL,
  `appliedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_0af9621f001b2374c7b2c2e881` (`spaceId`,`userId`),
  KEY `FK_8729d5a55d77a430614c8787218` (`userId`),
  CONSTRAINT `FK_06d8b4c40a3cdefbd9ba1966b6d` FOREIGN KEY (`spaceId`) REFERENCES `space` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_8729d5a55d77a430614c8787218` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `space_membership_application`
--

LOCK TABLES `space_membership_application` WRITE;
/*!40000 ALTER TABLE `space_membership_application` DISABLE KEYS */;
/*!40000 ALTER TABLE `space_membership_application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `structure`
--

DROP TABLE IF EXISTS `structure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `structure` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `version` int NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `formatId` int NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_cfa49cf49bbc0e6554d39e48e7` (`entityId`),
  UNIQUE KEY `IDX_0a6f44b8f033c1468871eb00a2` (`formatId`,`version`),
  CONSTRAINT `FK_af93d9590b7c64202e2a0e62b8a` FOREIGN KEY (`formatId`) REFERENCES `format` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `structure`
--

LOCK TABLES `structure` WRITE;
/*!40000 ALTER TABLE `structure` DISABLE KEYS */;
INSERT INTO `structure` VALUES (1,'8oyM98424O29',1,NULL,1,'2021-07-23 15:49:18'),(2,'CZSm0WnetJqW',1,NULL,2,'2021-07-23 15:49:38'),(3,'ijTbj9VowFwh',2,NULL,2,'2021-07-23 16:39:46'),(4,'8hfsuf9gi4h0',2,NULL,1,'2021-08-15 00:20:52'),(6,'CPHOWqgkLAxh',3,NULL,1,'2021-08-15 00:23:20'),(8,'sg1KP8eMtkGh',3,NULL,2,'2021-08-15 00:42:20'),(9,'OCvBa5NbXcwg',4,NULL,2,'2021-08-15 00:42:59'),(10,'ZBezY4IXjta8',1,NULL,3,'2021-09-05 17:54:32');
/*!40000 ALTER TABLE `structure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `structure_properties_property`
--

DROP TABLE IF EXISTS `structure_properties_property`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `structure_properties_property` (
  `structureId` int NOT NULL,
  `propertyId` int NOT NULL,
  PRIMARY KEY (`structureId`,`propertyId`),
  KEY `IDX_0c16771968bb16bae06b166681` (`structureId`),
  KEY `IDX_0ac501c4235a562c528c78f0f1` (`propertyId`),
  CONSTRAINT `FK_0ac501c4235a562c528c78f0f17` FOREIGN KEY (`propertyId`) REFERENCES `property` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_0c16771968bb16bae06b166681d` FOREIGN KEY (`structureId`) REFERENCES `structure` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `structure_properties_property`
--

LOCK TABLES `structure_properties_property` WRITE;
/*!40000 ALTER TABLE `structure_properties_property` DISABLE KEYS */;
INSERT INTO `structure_properties_property` VALUES (1,1),(1,2),(1,3),(2,4),(2,5),(3,4),(3,5),(3,6),(4,1),(4,3),(4,7),(6,1),(6,3),(6,8),(8,4),(8,5),(9,4),(9,5),(9,6),(10,11),(10,12);
/*!40000 ALTER TABLE `structure_properties_property` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `entityId` char(12) NOT NULL,
  `displayId` varchar(15) NOT NULL,
  `displayName` varchar(50) NOT NULL,
  `passwordHash` char(60) NOT NULL,
  `email` varchar(255) NOT NULL,
  `iconUrl` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_f3e653bbbd4b91cc7912569ead` (`entityId`),
  UNIQUE KEY `IDX_ebf7802a6463fb4d7f4f4cbd3f` (`displayId`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'rMyZuYzJhYxL','194980328687008','Ryoi','$2b$10$jRcT5lRR3oaZlskfyQhy0u.dYHAMZ0hTwIEVaegrkO8lqqZL8ALt2','dragon77shopping@gmail.com',NULL,'2021-07-23 13:35:19');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-09-09 20:52:23
