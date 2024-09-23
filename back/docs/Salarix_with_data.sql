-- MySQL dump 10.13  Distrib 9.0.1, for Win64 (x86_64)
--
-- Host: junction.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.0.1

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
INSERT INTO `departments` VALUES ('5483f16a-7952-11ef-84b2-a2aa5538db1f','Bodega','Bodega','2024-09-22 21:19:58'),('8125ce62-7952-11ef-84b2-a2aa5538db1f','Transporte','Departamento de transporte','2024-09-22 21:21:13'),('c774dca9-6bc4-11ef-84b2-a2aa5538db1f','Ventas','Departamento de ventas.','2024-09-05 15:23:57');
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
INSERT INTO `detail_nomina` VALUES ('1996ef25-7956-11ef-84b2-a2aa5538db1f','Horas extras','Tiempo adicional de trabajo que un empleado realiza fuera de su jornada laboral ordinaria establecida por la ley o por contrato.',1,60.9375,'1094ec53-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:46:57',1),('1fd95368-7956-11ef-84b2-a2aa5538db1f','Aporte patronal','Aporte que la empresa realiza al IESS por cada empleado',1,70.1175,'1094ec53-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:47:08',0),('20812b3c-7956-11ef-84b2-a2aa5538db1f','Décimo tercer sueldo','Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año',1,70.1175,'1094ec53-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:47:09',0),('211c62a5-7956-11ef-84b2-a2aa5538db1f','Décimo cuarto sueldo','Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año',1,38.333333333333,'1094ec53-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:47:10',0),('21bac0aa-7956-11ef-84b2-a2aa5538db1f','Fondo de reserva','Beneficio de los empleados afiliados al IESS, que cumplen con un año de trabajo consecutivo, el cual corresponde a un aporte por parte del patrono.',1,46.726302,'1094ec53-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:47:11',0),('22593c7f-7956-11ef-84b2-a2aa5538db1f','Aporte personal','Aporte del empleado que destina a financiar los beneficios de la seguridad social, como atención médica, pensiones, seguro de invalidez, entre otros.',0,53.00883,'1094ec53-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:47:12',0),('22f54c04-7956-11ef-84b2-a2aa5538db1f','Extensión de salud por Cónyugue','Prestación ofrecida por la empresa, permitiendo que el conyúgue de un empleado también acceda a servicios de atención médica a través del sistema de salud del empleado.',0,19.128054,'1094ec53-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:47:13',0),('3c201bb2-7956-11ef-84b2-a2aa5538db1f','Horas extras','Tiempo adicional de trabajo que un empleado realiza fuera de su jornada laboral ordinaria establecida por la ley o por contrato.',1,37.5,'364056ce-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:47:55',1),('437d5486-7956-11ef-84b2-a2aa5538db1f','Aporte patronal','Aporte que la empresa realiza al IESS por cada empleado',1,54.6875,'364056ce-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:48:07',0),('44270d0f-7956-11ef-84b2-a2aa5538db1f','Décimo tercer sueldo','Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año',1,54.6875,'364056ce-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:48:08',0),('44d87452-7956-11ef-84b2-a2aa5538db1f','Décimo cuarto sueldo','Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año',1,38.333333333333,'364056ce-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:48:10',0),('457bc7df-7956-11ef-84b2-a2aa5538db1f','Fondo de reserva','Beneficio de los empleados afiliados al IESS, que cumplen con un año de trabajo consecutivo, el cual corresponde a un aporte por parte del patrono.',1,36.44375,'364056ce-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:48:11',0),('4622d4e1-7956-11ef-84b2-a2aa5538db1f','Aporte personal','Aporte del empleado que destina a financiar los beneficios de la seguridad social, como atención médica, pensiones, seguro de invalidez, entre otros.',0,41.34375,'364056ce-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:48:12',0),('46c6c99c-7956-11ef-84b2-a2aa5538db1f','Extensión de salud por Cónyugue','Prestación ofrecida por la empresa, permitiendo que el conyúgue de un empleado también acceda a servicios de atención médica a través del sistema de salud del empleado.',0,14.91875,'364056ce-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:48:13',0),('497ff9ad-7773-11ef-84b2-a2aa5538db1f','Bonificación','Buen trabajo',1,15,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-09-20 12:10:50',1),('5ece39e3-7773-11ef-84b2-a2aa5538db1f','Aporte patronal','Aporte que la empresa realiza al IESS por cada empleado',1,64.375,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-09-20 12:11:26',0),('5f6e5515-7773-11ef-84b2-a2aa5538db1f','Décimo tercer sueldo','Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año',1,64.375,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-09-20 12:11:27',0),('600cd77f-7773-11ef-84b2-a2aa5538db1f','Décimo cuarto sueldo','Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año',1,38.333333333333,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-09-20 12:11:28',0),('60ac3004-7773-11ef-84b2-a2aa5538db1f','Fondo de reserva','Beneficio de los empleados afiliados al IESS, que cumplen con un año de trabajo consecutivo, el cual corresponde a un aporte por parte del patrono.',1,42.8995,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-09-20 12:11:29',0),('614acaf9-7773-11ef-84b2-a2aa5538db1f','Aporte personal','Aporte del empleado que destina a financiar los beneficios de la seguridad social, como atención médica, pensiones, seguro de invalidez, entre otros.',0,48.6675,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-09-20 12:11:30',0),('61e87176-7773-11ef-84b2-a2aa5538db1f','Extensión de salud por Cónyugue','Prestación ofrecida por la empresa, permitiendo que el conyúgue de un empleado también acceda a servicios de atención médica a través del sistema de salud del empleado.',0,17.5615,'41b266b1-6427-11ef-84b2-a2aa5538db1f','2024-09-20 12:11:31',0),('7857ccae-7956-11ef-84b2-a2aa5538db1f','Horas extras','Tiempo adicional de trabajo que un empleado realiza fuera de su jornada laboral ordinaria establecida por la ley o por contrato.',1,67.5,'71e83199-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:49:36',1),('7dd040a1-7956-11ef-84b2-a2aa5538db1f','Aporte patronal','Aporte que la empresa realiza al IESS por cada empleado',1,83.4375,'71e83199-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:49:45',0),('7e6d67de-7956-11ef-84b2-a2aa5538db1f','Décimo tercer sueldo','Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año',1,83.4375,'71e83199-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:49:46',0),('7f0ba552-7956-11ef-84b2-a2aa5538db1f','Décimo cuarto sueldo','Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año',1,38.333333333333,'71e83199-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:49:47',0),('7fa9bb8b-7956-11ef-84b2-a2aa5538db1f','Fondo de reserva','Beneficio de los empleados afiliados al IESS, que cumplen con un año de trabajo consecutivo, el cual corresponde a un aporte por parte del patrono.',1,55.60275,'71e83199-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:49:48',0),('8045112d-7956-11ef-84b2-a2aa5538db1f','Aporte personal','Aporte del empleado que destina a financiar los beneficios de la seguridad social, como atención médica, pensiones, seguro de invalidez, entre otros.',0,63.07875,'71e83199-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:49:49',0),('80e1d817-7956-11ef-84b2-a2aa5538db1f','Extensión de salud por Cónyugue','Prestación ofrecida por la empresa, permitiendo que el conyúgue de un empleado también acceda a servicios de atención médica a través del sistema de salud del empleado.',0,22.76175,'71e83199-7956-11ef-84b2-a2aa5538db1f','2024-09-22 21:49:50',0),('a0de39e1-7773-11ef-84b2-a2aa5538db1f','Aporte patronal','Aporte que la empresa realiza al IESS por cada empleado',1,50,'93caa5d8-7773-11ef-84b2-a2aa5538db1f','2024-09-20 12:13:17',0),('a18226ba-7773-11ef-84b2-a2aa5538db1f','Décimo tercer sueldo','Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año',1,50,'93caa5d8-7773-11ef-84b2-a2aa5538db1f','2024-09-20 12:13:18',0),('a2481383-7773-11ef-84b2-a2aa5538db1f','Décimo cuarto sueldo','Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año',1,38.333333333333,'93caa5d8-7773-11ef-84b2-a2aa5538db1f','2024-09-20 12:13:19',0),('a2fa0e88-7773-11ef-84b2-a2aa5538db1f','Fondo de reserva','Beneficio de los empleados afiliados al IESS, que cumplen con un año de trabajo consecutivo, el cual corresponde a un aporte por parte del patrono.',1,33.32,'93caa5d8-7773-11ef-84b2-a2aa5538db1f','2024-09-20 12:13:21',0),('a3a67f4f-7773-11ef-84b2-a2aa5538db1f','Aporte personal','Aporte del empleado que destina a financiar los beneficios de la seguridad social, como atención médica, pensiones, seguro de invalidez, entre otros.',0,37.8,'93caa5d8-7773-11ef-84b2-a2aa5538db1f','2024-09-20 12:13:22',0),('a443f5f9-7773-11ef-84b2-a2aa5538db1f','Extensión de salud por Cónyugue','Prestación ofrecida por la empresa, permitiendo que el conyúgue de un empleado también acceda a servicios de atención médica a través del sistema de salud del empleado.',0,13.64,'93caa5d8-7773-11ef-84b2-a2aa5538db1f','2024-09-20 12:13:23',0),('efbbc3b8-7955-11ef-84b2-a2aa5538db1f','Horas extras','Tiempo adicional de trabajo que un empleado realiza fuera de su jornada laboral ordinaria establecida por la ley o por contrato.',1,50.625,'e974a0e6-7955-11ef-84b2-a2aa5538db1f','2024-09-22 21:45:47',1),('f5f74d63-7955-11ef-84b2-a2aa5538db1f','Aporte patronal','Aporte que la empresa realiza al IESS por cada empleado',1,81.32875,'e974a0e6-7955-11ef-84b2-a2aa5538db1f','2024-09-22 21:45:57',0),('f699c1ae-7955-11ef-84b2-a2aa5538db1f','Décimo tercer sueldo','Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año',1,81.32875,'e974a0e6-7955-11ef-84b2-a2aa5538db1f','2024-09-22 21:45:58',0),('f7359d5f-7955-11ef-84b2-a2aa5538db1f','Décimo cuarto sueldo','Salario adicional anual, equivalente a la docena parte de los ingresos totales percibidos por el empleado por uno año',1,38.333333333333,'e974a0e6-7955-11ef-84b2-a2aa5538db1f','2024-09-22 21:45:59',0),('f7d029b7-7955-11ef-84b2-a2aa5538db1f','Fondo de reserva','Beneficio de los empleados afiliados al IESS, que cumplen con un año de trabajo consecutivo, el cual corresponde a un aporte por parte del patrono.',1,54.197479,'e974a0e6-7955-11ef-84b2-a2aa5538db1f','2024-09-22 21:46:00',0),('f86bea8f-7955-11ef-84b2-a2aa5538db1f','Aporte personal','Aporte del empleado que destina a financiar los beneficios de la seguridad social, como atención médica, pensiones, seguro de invalidez, entre otros.',0,61.484535,'e974a0e6-7955-11ef-84b2-a2aa5538db1f','2024-09-22 21:46:01',0),('f90907d8-7955-11ef-84b2-a2aa5538db1f','Extensión de salud por Cónyugue','Prestación ofrecida por la empresa, permitiendo que el conyúgue de un empleado también acceda a servicios de atención médica a través del sistema de salud del empleado.',0,22.186483,'e974a0e6-7955-11ef-84b2-a2aa5538db1f','2024-09-22 21:46:02',0);
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
  `frp` double DEFAULT NULL,
  `apep` double DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `dcs` double DEFAULT NULL,
  `escp` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formula`
--

LOCK TABLES `formula` WRITE;
/*!40000 ALTER TABLE `formula` DISABLE KEYS */;
INSERT INTO `formula` VALUES ('11310007-649c-11ef-84b2-a2aa5538db1f',12.5,12,8.33,9.45,'2024-08-27 12:44:53',NULL,NULL),('2ea7fdd0-649c-11ef-84b2-a2aa5538db1f',12.5,12,8.33,9.45,'2024-08-27 12:45:43',460,3.41);
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
  `totalProvision` double DEFAULT NULL,
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
INSERT INTO `nomina` VALUES ('1094ec53-7956-11ef-84b2-a2aa5538db1f','Agosto','2024-09-01','2024-09-30','Periodo de agosto',225.29,560.94,72.14,488.8,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f','2024-09-22 21:46:42'),('364056ce-7956-11ef-84b2-a2aa5538db1f','Agosto','2024-08-01','2024-09-30','Periodo de agosto',184.15,437.5,56.26,381.24,'eab99429-698c-11ef-84b2-a2aa5538db1f','2024-09-22 21:47:45'),('41b266b1-6427-11ef-84b2-a2aa5538db1f','Enerosss','2024-01-01','2024-01-31','Nómina para el mes de enero de 2024',209.98,515,66.23,448.77,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f','2024-08-26 22:48:44'),('71e83199-7956-11ef-84b2-a2aa5538db1f','Agosto','2024-08-01','2024-09-30','Periodo de agosto',260.81,667.5,85.84,581.66,'63dbbd1f-61d3-11ef-84b2-a2aa5538db1f','2024-09-22 21:49:25'),('93caa5d8-7773-11ef-84b2-a2aa5538db1f','Septiembre','2024-09-01','2024-09-30','Periodo de septiembre',171.65,400,51.44,348.56,'eab99429-698c-11ef-84b2-a2aa5538db1f','2024-09-20 12:12:55'),('e974a0e6-7955-11ef-84b2-a2aa5538db1f','Septiembre','2024-09-01','2024-09-30','Periodo de septiembre',255.19,650.63,83.67,566.96,'63dbbd1f-61d3-11ef-84b2-a2aa5538db1f','2024-09-22 21:45:36');
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
INSERT INTO `positions` VALUES ('0cbb2140-7952-11ef-84b2-a2aa5538db1f','Jefe de personal','Encargado de dirigir al personal','2024-09-22 21:17:57'),('6582f056-7952-11ef-84b2-a2aa5538db1f','Transportista','Transporte','2024-09-22 21:20:26'),('75078bae-69bb-11ef-84b2-a2aa5538db1f','Bodeguero','Encargado de bodeguear','2024-09-03 01:12:11'),('e0c65c7d-6581-11ef-84b2-a2aa5538db1f','Vendedor','El que vende','2024-08-28 16:09:56');
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
INSERT INTO `registers` VALUES ('ec7f05ca-7954-11ef-84b2-a2aa5538db1f','2024-08-01 08:00:00','2024-08-01 18:00:00',9,1,0,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f'),('ec7f0b3f-7954-11ef-84b2-a2aa5538db1f','2024-08-02 08:00:00','2024-08-02 19:00:00',9,2,0,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f'),('ec7f0c2c-7954-11ef-84b2-a2aa5538db1f','2024-08-03 08:00:00','2024-08-03 22:00:00',9,5,0,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f'),('ec7f0cad-7954-11ef-84b2-a2aa5538db1f','2024-09-01 08:00:00','2024-09-01 20:00:00',9,3,0,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f'),('ec7f0d4b-7954-11ef-84b2-a2aa5538db1f','2024-09-02 08:00:00','2024-09-02 21:00:00',9,4,0,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f'),('ec7f0dcf-7954-11ef-84b2-a2aa5538db1f','2024-09-05 08:00:00','2024-09-05 23:00:00',9,6,0,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f'),('ec7f0e40-7954-11ef-84b2-a2aa5538db1f','2024-10-01 08:00:00','2024-10-01 18:00:00',9,1,0,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f'),('ec7f0f55-7954-11ef-84b2-a2aa5538db1f','2024-10-02 08:00:00','2024-10-02 20:00:00',9,3,0,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f'),('ec7f106d-7954-11ef-84b2-a2aa5538db1f','2024-10-03 08:00:00','2024-10-03 22:00:00',9,5,0,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f'),('ec7f10e1-7954-11ef-84b2-a2aa5538db1f','2024-08-01 08:00:00','2024-08-01 17:00:00',9,0,0,'63dbbd1f-61d3-11ef-84b2-a2aa5538db1f'),('ec7f1145-7954-11ef-84b2-a2aa5538db1f','2024-08-02 08:00:00','2024-08-02 18:00:00',9,1,0,'63dbbd1f-61d3-11ef-84b2-a2aa5538db1f'),('ec7f11b7-7954-11ef-84b2-a2aa5538db1f','2024-08-03 08:00:00','2024-08-03 19:00:00',9,2,0,'63dbbd1f-61d3-11ef-84b2-a2aa5538db1f'),('ec7f1286-7954-11ef-84b2-a2aa5538db1f','2024-09-01 08:00:00','2024-09-01 19:00:00',9,2,0,'63dbbd1f-61d3-11ef-84b2-a2aa5538db1f'),('ec7f12cd-7954-11ef-84b2-a2aa5538db1f','2024-09-02 08:00:00','2024-09-02 20:00:00',9,3,0,'63dbbd1f-61d3-11ef-84b2-a2aa5538db1f'),('ec7f1343-7954-11ef-84b2-a2aa5538db1f','2024-09-05 08:00:00','2024-09-05 21:00:00',9,4,0,'63dbbd1f-61d3-11ef-84b2-a2aa5538db1f'),('ec7f1388-7954-11ef-84b2-a2aa5538db1f','2024-10-01 08:00:00','2024-10-01 17:00:00',9,0,0,'63dbbd1f-61d3-11ef-84b2-a2aa5538db1f'),('ec7f13ce-7954-11ef-84b2-a2aa5538db1f','2024-10-02 08:00:00','2024-10-02 19:00:00',9,2,0,'63dbbd1f-61d3-11ef-84b2-a2aa5538db1f'),('ec7f1424-7954-11ef-84b2-a2aa5538db1f','2024-10-03 08:00:00','2024-10-03 21:00:00',9,4,0,'63dbbd1f-61d3-11ef-84b2-a2aa5538db1f'),('ec7f146b-7954-11ef-84b2-a2aa5538db1f','2024-08-01 08:00:00','2024-08-01 17:00:00',9,0,0,'eab99429-698c-11ef-84b2-a2aa5538db1f'),('ec7f14b6-7954-11ef-84b2-a2aa5538db1f','2024-08-02 08:00:00','2024-08-02 18:00:00',9,1,0,'eab99429-698c-11ef-84b2-a2aa5538db1f'),('ec7f14f9-7954-11ef-84b2-a2aa5538db1f','2024-08-03 08:00:00','2024-08-03 20:00:00',9,3,0,'eab99429-698c-11ef-84b2-a2aa5538db1f'),('ec7f153a-7954-11ef-84b2-a2aa5538db1f','2024-09-01 08:00:00','2024-09-01 18:00:00',9,1,0,'eab99429-698c-11ef-84b2-a2aa5538db1f'),('ec7f157d-7954-11ef-84b2-a2aa5538db1f','2024-09-02 08:00:00','2024-09-02 19:00:00',9,2,0,'eab99429-698c-11ef-84b2-a2aa5538db1f'),('ec7f15bf-7954-11ef-84b2-a2aa5538db1f','2024-09-05 08:00:00','2024-09-05 20:00:00',9,3,0,'eab99429-698c-11ef-84b2-a2aa5538db1f'),('ec7f1601-7954-11ef-84b2-a2aa5538db1f','2024-10-01 08:00:00','2024-10-01 17:00:00',9,0,0,'eab99429-698c-11ef-84b2-a2aa5538db1f'),('ec7f1647-7954-11ef-84b2-a2aa5538db1f','2024-10-02 08:00:00','2024-10-02 18:00:00',9,1,0,'eab99429-698c-11ef-84b2-a2aa5538db1f'),('ec7f168b-7954-11ef-84b2-a2aa5538db1f','2024-10-03 08:00:00','2024-10-03 20:00:00',9,3,0,'eab99429-698c-11ef-84b2-a2aa5538db1f'),('ec7f16cb-7954-11ef-84b2-a2aa5538db1f','2024-08-01 08:00:00','2024-08-01 17:00:00',9,0,0,'fe04edd8-7951-11ef-84b2-a2aa5538db1f'),('ec7f171d-7954-11ef-84b2-a2aa5538db1f','2024-08-02 08:00:00','2024-08-02 20:00:00',9,3,0,'fe04edd8-7951-11ef-84b2-a2aa5538db1f'),('ec7f1760-7954-11ef-84b2-a2aa5538db1f','2024-08-03 08:00:00','2024-08-03 21:00:00',9,4,0,'fe04edd8-7951-11ef-84b2-a2aa5538db1f'),('ec7f17a4-7954-11ef-84b2-a2aa5538db1f','2024-09-01 08:00:00','2024-09-01 19:00:00',9,2,0,'fe04edd8-7951-11ef-84b2-a2aa5538db1f'),('ec7f17ea-7954-11ef-84b2-a2aa5538db1f','2024-09-02 08:00:00','2024-09-02 21:00:00',9,4,0,'fe04edd8-7951-11ef-84b2-a2aa5538db1f'),('ec7f1839-7954-11ef-84b2-a2aa5538db1f','2024-09-05 08:00:00','2024-09-05 22:00:00',9,5,0,'fe04edd8-7951-11ef-84b2-a2aa5538db1f'),('ec7f187e-7954-11ef-84b2-a2aa5538db1f','2024-10-01 08:00:00','2024-10-01 18:00:00',9,1,0,'fe04edd8-7951-11ef-84b2-a2aa5538db1f'),('ec7f18c7-7954-11ef-84b2-a2aa5538db1f','2024-10-02 08:00:00','2024-10-02 19:00:00',9,2,0,'fe04edd8-7951-11ef-84b2-a2aa5538db1f'),('ec7f190b-7954-11ef-84b2-a2aa5538db1f','2024-10-03 08:00:00','2024-10-03 21:00:00',9,4,0,'fe04edd8-7951-11ef-84b2-a2aa5538db1f');
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
INSERT INTO `salary_plans` VALUES ('26cb2c03-7952-11ef-84b2-a2aa5538db1f','0cbb2140-7952-11ef-84b2-a2aa5538db1f',600,'Plan salarial','08:00:00','17:00:00',NULL,1,0,1,1,1,1,1,'63dbbd1f-61d3-11ef-84b2-a2aa5538db1f',NULL),('3ae97943-7952-11ef-84b2-a2aa5538db1f','e0c65c7d-6581-11ef-84b2-a2aa5538db1f',500,'Plan salarial','08:00:00','17:00:00',NULL,1,0,1,1,1,1,1,'fe04edd8-7951-11ef-84b2-a2aa5538db1f',NULL),('869ecb31-6583-11ef-84b2-a2aa5538db1f','75078bae-69bb-11ef-84b2-a2aa5538db1f',500,'Plan salarial','08:00:00','17:00:00',100,1,1,1,1,1,1,1,'41cfb73e-61d2-11ef-84b2-a2aa5538db1f',NULL),('aa706719-6ad8-11ef-84b2-a2aa5538db1f','6582f056-7952-11ef-84b2-a2aa5538db1f',400,'Plan salarial','08:00:00','17:00:00',20,1,1,1,1,1,1,1,'eab99429-698c-11ef-84b2-a2aa5538db1f',NULL);
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
INSERT INTO `users` VALUES ('1f00f5bb-61c3-11ef-84b2-a2aa5538db1f','Admin','Admin','admin@gmail.com','$2y$10$SqGNNwmP317XV7HRJ59siuScr53/W9BlUUI7qFAD3rYo/lrOMo/py','SUPERADMINISTRADOR',NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-23 21:46:53','2024-08-23 21:46:53',1),('41cfb73e-61d2-11ef-84b2-a2aa5538db1f','Pedro','Pérez','pedro@example.com','$2y$10$wCz/F3FEXX0MIG2tTSn4qOeHtHy7kXzQU3YG8dm4ANF7F7RnCO7G2','EMPLEADO','1234567890',1,'123 Calle Principal, Ciudad, País','1990-01-01','0974837283','001','2024-08-23 23:35:14','2024-09-22 21:16:24',1),('44825e91-793d-11ef-84b2-a2aa5538db1f','Luisas','Gonzales','luisa@gmail.com','$2y$10$oWYVEntGBud7BEypipUukeHQ5EKFToFrXqqtnc0UwRd0b.h0lh/8W','CONTADOR',NULL,NULL,NULL,NULL,NULL,NULL,'2024-09-22 18:49:12','2024-09-22 20:23:19',1),('63dbbd1f-61d3-11ef-84b2-a2aa5538db1f','Maria','Nuñez','maria@gmail.com','$2y$10$oHYrGX2xtpvYn2uy5r7b6e1ujD7.gJHd.pGqnhTZShBfdb1CaikJa','EMPLEADO','1850034892',1,'Casa','1990-01-01','09834829384','002','2024-08-23 23:43:21','2024-09-22 21:16:07',0),('d72c46a6-7842-11ef-84b2-a2aa5538db1f','Juan','López','juanlopez@gmail.com','$2y$10$CPxwtYs4oa.0PIBm/LtLi.Z5.kwBKAjlSKlGcfDK1Bya7dt5BdM7e','ADMINISTRADOR',NULL,NULL,NULL,NULL,NULL,NULL,'2024-09-21 12:56:34','2024-09-21 12:56:34',1),('eab99429-698c-11ef-84b2-a2aa5538db1f','Juan','Cacerez','juan@gmail.com','$2y$10$8EsJ9Ws2AsHgBwoLW50dvOxw.EjHS8qwWl7Gew./NW8FhXraJGch.','EMPLEADO','1234233',1,'Juan','2024-09-12','1234233','003','2024-09-02 19:39:02','2024-09-02 19:39:02',1),('f44008b8-61c2-11ef-84b2-a2aa5538db1f','John','Doe','john.doe@example.com','$2y$10$ROCatwKPvtDB8Z94Hqrqt.XtoGYc05BhoYCKzounEFniCV4QwWacK','ADMINISTRADOR',NULL,NULL,NULL,NULL,NULL,NULL,'2024-08-23 21:45:42','2024-08-23 21:45:42',1),('fe04edd8-7951-11ef-84b2-a2aa5538db1f','Jose','Pilco','jose@gmail.com','$2y$10$53aBCgnJ.YnDoczG/5AUHuyDtvBR5JyyCvwF4P/i9ojDLNpg/4wV.','EMPLEADO','186545879563',1,'Casa','1998-02-12','094457478','004','2024-09-22 21:17:33','2024-09-22 21:17:33',1);
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

-- Dump completed on 2024-09-22 21:53:31
