-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: junction.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE SCHEMA railway;
USE railway;
--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) NOT NULL,
  `description` text,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES ('c774dca9-6bc4-11ef-84b2-a2aa5538db1f','Ventas','Departamento de ventas.','2024-09-05 15:23:57');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dependents`
--

DROP TABLE IF EXISTS `dependents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dependents` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(50) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `relation` varchar(45) NOT NULL,
  `disability` tinyint(1) NOT NULL DEFAULT '0',
  `birthday` date NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `id_user` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_iduser_dependents` (`id_user`),
  CONSTRAINT `fk_iduser_dependents` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dependents`
--

LOCK TABLES `dependents` WRITE;
/*!40000 ALTER TABLE `dependents` DISABLE KEYS */;
INSERT INTO `dependents` VALUES ('120a63b0-624c-11ef-84b2-a2aa5538db1f','Dependiente','Dependiente','Hijo',0,'2016-08-08',1,'63dbbd1f-61d3-11ef-84b2-a2aa5538db1f'),('33d44192-624a-11ef-84b2-a2aa5538db1f','Jorge','Perez','Hijo',1,'2015-07-01',1,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f');
/*!40000 ALTER TABLE `dependents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detail_nomina`
--

DROP TABLE IF EXISTS `detail_nomina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detail_nomina` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) NOT NULL,
  `detail` text,
  `type` tinyint(1) NOT NULL COMMENT '0 = Egreso, 1 = Ingreso',
  `monto` double NOT NULL,
  `nomina_id` char(36) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `isBonus` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `nomina_id` (`nomina_id`),
  CONSTRAINT `detail_nomina_ibfk_1` FOREIGN KEY (`nomina_id`) REFERENCES `nomina` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detail_nomina`
--

LOCK TABLES `detail_nomina` WRITE;
/*!40000 ALTER TABLE `detail_nomina` DISABLE KEYS */;
INSERT INTO `detail_nomina` VALUES ('2e965666-6490-11ef-84b2-a2aa5538db1f','Bonificación 2','Buen trabajo',1,10.5,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-08-27 11:24:44',0),('3b7cf489-6490-11ef-84b2-a2aa5538db1f','Bonificación 2','Buen trabajo',1,10,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-08-27 11:24:44',0),('43d79586-648f-11ef-84b2-a2aa5538db1f','Bonificación ','Buen trabajo',1,20,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-08-27 11:24:44',0),('86336bbb-6490-11ef-84b2-a2aa5538db1f','Bonificación 2','Buen trabajo',1,10.5,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-08-27 11:24:44',0),('d5bbb03f-657b-11ef-84b2-a2aa5538db1f','Bonificación bonus','Buen trabajo',1,20,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-08-28 15:26:41',1),('e8bc32f1-657b-11ef-84b2-a2aa5538db1f','Bonificación bonus','Buen trabajo',1,10.5,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-08-28 15:27:13',1),('e9a434e9-6490-11ef-84b2-a2aa5538db1f','Bonificación 4','Buen trabajo',1,10.5,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-08-27 11:25:02',0);
/*!40000 ALTER TABLE `detail_nomina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formula`
--

DROP TABLE IF EXISTS `formula`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formula` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `app` double DEFAULT NULL,
  `dts` double DEFAULT NULL,
  `dcs` double DEFAULT NULL,
  `frp` double DEFAULT NULL,
  `apep` double DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formula`
--

LOCK TABLES `formula` WRITE;
/*!40000 ALTER TABLE `formula` DISABLE KEYS */;
INSERT INTO `formula` VALUES ('11310007-649c-11ef-84b2-a2aa5538db1f',12.5,12,460,8.33,9.45,'2024-08-27 12:44:53'),('2ea7fdd0-649c-11ef-84b2-a2aa5538db1f',12.5,12,460,8.33,9.45,'2024-08-27 12:45:43');
/*!40000 ALTER TABLE `formula` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nomina`
--

DROP TABLE IF EXISTS `nomina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nomina` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `periodName` varchar(100) NOT NULL,
  `start` date NOT NULL,
  `finish` date NOT NULL,
  `detail` text,
  `totalGross` double DEFAULT NULL,
  `totalIncome` double DEFAULT NULL,
  `totalEgress` double DEFAULT NULL,
  `totalLiquid` double DEFAULT NULL,
  `user_id` char(36) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `nomina_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nomina`
--

LOCK TABLES `nomina` WRITE;
/*!40000 ALTER TABLE `nomina` DISABLE KEYS */;
INSERT INTO `nomina` VALUES ('41b266b1-6427-11ef-84b2-a2aa5538db1f','Enerosss','2024-01-01','2024-01-31','Nómina para el mes de enero de 2024',NULL,NULL,NULL,NULL,NULL,'2024-08-26 22:48:44');
/*!40000 ALTER TABLE `nomina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `positions` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `name` varchar(255) NOT NULL,
  `description` text,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `positions`
--

LOCK TABLES `positions` WRITE;
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` VALUES ('75078bae-69bb-11ef-84b2-a2aa5538db1f','Bodeguero','Encargado de bodeguear','2024-09-03 01:12:11'),('e0c65c7d-6581-11ef-84b2-a2aa5538db1f','Vendedor','El que vende','2024-08-28 16:09:56');
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registers`
--

DROP TABLE IF EXISTS `registers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registers` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `start` datetime NOT NULL,
  `finish` datetime DEFAULT NULL,
  `ordinary_time` double DEFAULT NULL,
  `overtime` double DEFAULT NULL COMMENT '50% add for hour',
  `night_overtime` double DEFAULT NULL COMMENT '100% add for hour',
  `user_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `registers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registers`
--

LOCK TABLES `registers` WRITE;
/*!40000 ALTER TABLE `registers` DISABLE KEYS */;
INSERT INTO `registers` VALUES ('2a58820c-65c7-11ef-84b2-a2aa5538db1f','2024-08-29 00:00:00','2024-08-29 22:20:00',9,10,3,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f'),('59ae05bc-61c3-11ef-84b2-a2aa5538db1f','2024-08-23 21:48:32',NULL,NULL,NULL,NULL,'1f00f5bb-61c3-11ef-84b2-a2aa5538db1f');
/*!40000 ALTER TABLE `registers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salary_plans`
--

DROP TABLE IF EXISTS `salary_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salary_plans` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `position_id` char(36) DEFAULT NULL,
  `baseSalary` double NOT NULL,
  `description` text,
  `checkin` time DEFAULT NULL,
  `checkout` time DEFAULT NULL,
  `esc` double DEFAULT NULL,
  `esc_included` tinyint(1) NOT NULL DEFAULT '0',
  `cp_included` tinyint(1) NOT NULL DEFAULT '0',
  `app_included` tinyint(1) NOT NULL DEFAULT '0',
  `dts_included` tinyint(1) NOT NULL DEFAULT '0',
  `dcs_included` tinyint(1) NOT NULL DEFAULT '0',
  `frp_included` tinyint(1) NOT NULL DEFAULT '0',
  `apep_included` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` char(36) DEFAULT NULL,
  `cp` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `position_id` (`position_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `salary_plans_ibfk_1` FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `salary_plans_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salary_plans`
--

LOCK TABLES `salary_plans` WRITE;
/*!40000 ALTER TABLE `salary_plans` DISABLE KEYS */;
INSERT INTO `salary_plans` VALUES ('869ecb31-6583-11ef-84b2-a2aa5538db1f','75078bae-69bb-11ef-84b2-a2aa5538db1f',500,'hola','08:00:00','17:00:00',100,1,1,1,1,1,1,1,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f',NULL),('aa706719-6ad8-11ef-84b2-a2aa5538db1f','e0c65c7d-6581-11ef-84b2-a2aa5538db1f',400,'hola','08:00:00','17:00:00',20,1,1,1,1,1,1,1,'eab99429-698c-11ef-84b2-a2aa5538db1f',NULL);
/*!40000 ALTER TABLE `salary_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_departments`
--

DROP TABLE IF EXISTS `user_departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_departments` (
  `user_id` char(36) NOT NULL,
  `department_id` char(36) NOT NULL,
  PRIMARY KEY (`user_id`,`department_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `user_departments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_departments_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_departments`
--

LOCK TABLES `user_departments` WRITE;
/*!40000 ALTER TABLE `user_departments` DISABLE KEYS */;
INSERT INTO `user_departments` VALUES ('63dbbd1f-61d3-11ef-84b2-a2aa5538db1f','c774dca9-6bc4-11ef-84b2-a2aa5538db1f');
/*!40000 ALTER TABLE `user_departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(250) NOT NULL,
  `role` enum('ADMINISTRADOR','SUPERADMINISTRADOR','EMPLEADO','CONTADOR') NOT NULL,
  `identification` varchar(20) DEFAULT NULL,
  `sex` tinyint(1) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `codeEmployee` varchar(10) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `identification` (`identification`),
  UNIQUE KEY `codeEmployee` (`codeEmployee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('1f00f5bb-61c3-11ef-84b2-a2aa5538db1f','Admin','Admin','admin@gmail.com','$2y$10$SqGNNwmP317XV7HRJ59siuScr53/W9BlUUI7qFAD3rYo/lrOMo/py','SUPERADMINISTRADOR',NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-23 21:46:53','2024-08-23 21:46:53',1),('41cfb73e-61d2-11ef-84b2-a2aa5538db1f','Juan','Pérez','juan.perez@example.com','$2y$10$wCz/F3FEXX0MIG2tTSn4qOeHtHy7kXzQU3YG8dm4ANF7F7RnCO7G2','EMPLEADO','1234567890',1,'123 Calle Principal, Ciudad, País','1990-01-01','097483728374','001','2024-08-23 23:35:14','2024-09-02 23:55:48',1),('63dbbd1f-61d3-11ef-84b2-a2aa5538db1f','Empleado','Empleado','empleado@gmail.com','$2y$10$oHYrGX2xtpvYn2uy5r7b6e1ujD7.gJHd.pGqnhTZShBfdb1CaikJa','EMPLEADO','1850034892',1,'Por ahi','1990-01-01','09834829384','002','2024-08-23 23:43:21','2024-09-02 13:05:19',0),('eab99429-698c-11ef-84b2-a2aa5538db1f','Juan','Cacerez','juan@gmail.com','$2y$10$8EsJ9Ws2AsHgBwoLW50dvOxw.EjHS8qwWl7Gew./NW8FhXraJGch.','EMPLEADO','1234233',1,'Juan','2024-09-12','1234233','003','2024-09-02 19:39:02','2024-09-02 19:39:02',1),('f44008b8-61c2-11ef-84b2-a2aa5538db1f','John','Doe','john.doe@example.com','$2y$10$ROCatwKPvtDB8Z94Hqrqt.XtoGYc05BhoYCKzounEFniCV4QwWacK','ADMINISTRADOR',NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-23 21:45:42','2024-08-23 21:45:42',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `id` char(36) NOT NULL DEFAULT (uuid()),
  `totalDays` int NOT NULL,
  `periodo` varchar(255) DEFAULT NULL,
  `daysTaken` int DEFAULT NULL,
  `start` date DEFAULT NULL,
  `finish` date DEFAULT NULL,
  `detail` text,
  `user_id` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `vacations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-06  0:02:25
