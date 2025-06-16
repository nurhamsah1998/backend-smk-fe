-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: smk_kras
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `campaign`
--

DROP TABLE IF EXISTS `campaign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campaign` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `staff_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '',
  `title` varchar(70) DEFAULT '',
  `text` varchar(800) DEFAULT '',
  `status` enum('umum','penting') DEFAULT NULL,
  `jurusan_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '',
  `is_response` tinyint(1) DEFAULT 0,
  `kelas` varchar(255) DEFAULT '',
  `sub_kelas` varchar(255) DEFAULT '',
  `angkatan` varchar(255) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `staff_id` (`staff_id`),
  KEY `jurusan_id` (`jurusan_id`),
  CONSTRAINT `campaign_ibfk_1` FOREIGN KEY (`staff_id`) REFERENCES `staf` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `campaign_ibfk_2` FOREIGN KEY (`jurusan_id`) REFERENCES `jurusan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign`
--

LOCK TABLES `campaign` WRITE;
/*!40000 ALTER TABLE `campaign` DISABLE KEYS */;
/*!40000 ALTER TABLE `campaign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoice` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `kode_tagihan` varchar(255) DEFAULT '',
  `kode_pembayaran` varchar(255) DEFAULT '',
  `invoice` varchar(255) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `petugas` varchar(255) DEFAULT NULL,
  `tahun_angkatan` varchar(255) DEFAULT NULL,
  `uang_diterima` int(11) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `kelas` varchar(255) DEFAULT NULL,
  `sub_kelas` varchar(255) DEFAULT NULL,
  `jurusan` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoiceout`
--

DROP TABLE IF EXISTS `invoiceout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoiceout` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `invoice_pengeluaran` varchar(255) DEFAULT NULL,
  `nama` varchar(200) DEFAULT NULL,
  `petugas` varchar(200) DEFAULT NULL,
  `uang_keluar` int(11) DEFAULT NULL,
  `note` varchar(200) DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoiceout`
--

LOCK TABLES `invoiceout` WRITE;
/*!40000 ALTER TABLE `invoiceout` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoiceout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jurusan`
--

DROP TABLE IF EXISTS `jurusan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jurusan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nama` varchar(200) DEFAULT NULL,
  `kode_jurusan` varchar(10) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nama` (`nama`),
  UNIQUE KEY `kode_jurusan` (`kode_jurusan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jurusan`
--

LOCK TABLES `jurusan` WRITE;
/*!40000 ALTER TABLE `jurusan` DISABLE KEYS */;
/*!40000 ALTER TABLE `jurusan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log-activity`
--

DROP TABLE IF EXISTS `log-activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log-activity` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `action` varchar(255) DEFAULT '',
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `author` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`author`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log-activity`
--

LOCK TABLES `log-activity` WRITE;
/*!40000 ALTER TABLE `log-activity` DISABLE KEYS */;
/*!40000 ALTER TABLE `log-activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `response_campaign`
--

DROP TABLE IF EXISTS `response_campaign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `response_campaign` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `text` varchar(255) DEFAULT '',
  `siswa_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '',
  `campaign_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `siswa_id` (`siswa_id`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `response_campaign_ibfk_1` FOREIGN KEY (`siswa_id`) REFERENCES `siswa` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `response_campaign_ibfk_2` FOREIGN KEY (`campaign_id`) REFERENCES `campaign` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `response_campaign`
--

LOCK TABLES `response_campaign` WRITE;
/*!40000 ALTER TABLE `response_campaign` DISABLE KEYS */;
/*!40000 ALTER TABLE `response_campaign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `siswa`
--

DROP TABLE IF EXISTS `siswa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `siswa` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT '',
  `kode_siswa` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT '',
  `status` varchar(255) DEFAULT 'checking',
  `angkatan` varchar(255) DEFAULT '',
  `nama_ayah` varchar(255) DEFAULT '',
  `nama_ibu` varchar(255) DEFAULT '',
  `alamat` varchar(255) DEFAULT '',
  `kelas` varchar(255) DEFAULT '10',
  `sub_kelas` varchar(255) DEFAULT '1',
  `jurusanId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '',
  `current_bill` bigint(20) DEFAULT 0,
  `status_bill` varchar(255) DEFAULT 'not_paid_yet',
  `noHP` varchar(12) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kode_siswa` (`kode_siswa`),
  UNIQUE KEY `username` (`username`),
  KEY `jurusanId` (`jurusanId`),
  CONSTRAINT `siswa_ibfk_1` FOREIGN KEY (`jurusanId`) REFERENCES `jurusan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `siswa`
--

LOCK TABLES `siswa` WRITE;
/*!40000 ALTER TABLE `siswa` DISABLE KEYS */;
/*!40000 ALTER TABLE `siswa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staf`
--

DROP TABLE IF EXISTS `staf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staf` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nama` varchar(200) DEFAULT '',
  `username` varchar(200) DEFAULT '',
  `password` varchar(200) DEFAULT '',
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `role` varchar(255) DEFAULT 'ANONIM',
  `noHP` varchar(12) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staf`
--

LOCK TABLES `staf` WRITE;
/*!40000 ALTER TABLE `staf` DISABLE KEYS */;
INSERT INTO `staf` VALUES ('b7e4f465-24a3-449f-98dc-ef83c61d430d','Developer','dev@dev.dev','$2b$10$KNq6b.OwKxMXFfKWng/ZteDcQYtdS7OEHKbTIDc8xmipAQAWxuTeG','[\"dashboard\", \"log_activity\", \"account_staff\", \"major\", \"files\", \"server\"]','DEV','81213221343','2025-06-16 17:16:32','2025-06-16 17:16:32');
/*!40000 ALTER TABLE `staf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tagihan-fix`
--

DROP TABLE IF EXISTS `tagihan-fix`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tagihan-fix` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `tahun_angkatan` bigint(20) DEFAULT 0,
  `seragam` bigint(20) DEFAULT 0,
  `pengembangan_kelas_1` bigint(20) DEFAULT 0,
  `jobsheet_kelas_1` bigint(20) DEFAULT 0,
  `spp_juli_kelas_1` bigint(20) DEFAULT 0,
  `spp_agustus_kelas_1` bigint(20) DEFAULT 0,
  `spp_september_kelas_1` bigint(20) DEFAULT 0,
  `pts_smt_1` bigint(20) DEFAULT 0,
  `spp_oktober_kelas_1` bigint(20) DEFAULT 0,
  `spp_november_kelas_1` bigint(20) DEFAULT 0,
  `spp_desember_kelas_1` bigint(20) DEFAULT 0,
  `pas_smt_1` bigint(20) DEFAULT 0,
  `spp_januari_kelas_1` bigint(20) DEFAULT 0,
  `spp_februari_kelas_1` bigint(20) DEFAULT 0,
  `spp_maret_kelas_1` bigint(20) DEFAULT 0,
  `pts_smt_2` bigint(20) DEFAULT 0,
  `spp_april_kelas_1` bigint(20) DEFAULT 0,
  `spp_mei_kelas_1` bigint(20) DEFAULT 0,
  `spp_juni_kelas_1` bigint(20) DEFAULT 0,
  `pas_smt_2` bigint(20) DEFAULT 0,
  `dll_kelas_1` bigint(20) DEFAULT 0,
  `prakerin` bigint(20) DEFAULT 0,
  `pengembangan_kelas_2` bigint(20) DEFAULT 0,
  `jobsheet_kelas_2` bigint(20) DEFAULT 0,
  `spp_juli_kelas_2` bigint(20) DEFAULT 0,
  `spp_agustus_kelas_2` bigint(20) DEFAULT 0,
  `spp_september_kelas_2` bigint(20) DEFAULT 0,
  `pts_smt_3` bigint(20) DEFAULT 0,
  `spp_oktober_kelas_2` bigint(20) DEFAULT 0,
  `spp_november_kelas_2` bigint(20) DEFAULT 0,
  `spp_desember_kelas_2` bigint(20) DEFAULT 0,
  `pas_smt_3` bigint(20) DEFAULT 0,
  `spp_januari_kelas_2` bigint(20) DEFAULT 0,
  `spp_februari_kelas_2` bigint(20) DEFAULT 0,
  `spp_maret_kelas_2` bigint(20) DEFAULT 0,
  `pts_smt_4` bigint(20) DEFAULT 0,
  `spp_april_kelas_2` bigint(20) DEFAULT 0,
  `spp_mei_kelas_2` bigint(20) DEFAULT 0,
  `spp_juni_kelas_2` bigint(20) DEFAULT 0,
  `pas_smt_4` bigint(20) DEFAULT 0,
  `dll_kelas_2` bigint(20) DEFAULT 0,
  `kunjungan_industri` bigint(20) DEFAULT 0,
  `pengembangan_kelas_3` bigint(20) DEFAULT 0,
  `jobsheet_kelas_3` bigint(20) DEFAULT 0,
  `ujian_akhir_kelas_3` bigint(20) DEFAULT 0,
  `spp_juli_kelas_3` bigint(20) DEFAULT 0,
  `spp_agustus_kelas_3` bigint(20) DEFAULT 0,
  `spp_september_kelas_3` bigint(20) DEFAULT 0,
  `pts_smt_5` bigint(20) DEFAULT 0,
  `spp_oktober_kelas_3` bigint(20) DEFAULT 0,
  `spp_november_kelas_3` bigint(20) DEFAULT 0,
  `spp_desember_kelas_3` bigint(20) DEFAULT 0,
  `pas_smt_5` bigint(20) DEFAULT 0,
  `spp_januari_kelas_3` bigint(20) DEFAULT 0,
  `spp_februari_kelas_3` bigint(20) DEFAULT 0,
  `spp_maret_kelas_3` bigint(20) DEFAULT 0,
  `pts_smt_6` bigint(20) DEFAULT 0,
  `spp_april_kelas_3` bigint(20) DEFAULT 0,
  `spp_mei_kelas_3` bigint(20) DEFAULT 0,
  `spp_juni_kelas_3` bigint(20) DEFAULT 0,
  `pas_smt_6` bigint(20) DEFAULT 0,
  `dll_kelas_3` bigint(20) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tagihan-fix`
--

LOCK TABLES `tagihan-fix` WRITE;
/*!40000 ALTER TABLE `tagihan-fix` DISABLE KEYS */;
INSERT INTO `tagihan-fix` VALUES ('254f8da7-4a9b-11f0-9431-a41f72604672',2021,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-06-16 12:17:25','2025-06-16 12:17:25');
/*!40000 ALTER TABLE `tagihan-fix` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-16 17:17:55
