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
INSERT INTO `jurusan` VALUES ('8635ef17-a7b3-4ce8-81c0-eab6ef209137','asd','SS','2025-06-19 07:12:01','2025-06-19 07:12:01');
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
  `authorId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `authorId` (`authorId`),
  CONSTRAINT `log-activity_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `staf` (`id`)
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
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `news` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `staff_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '',
  `title` varchar(200) DEFAULT '',
  `html` text DEFAULT NULL,
  `isPublish` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `isPrivate` tinyint(1) DEFAULT 1,
  `up_vote` int(11) DEFAULT 0,
  `down_vote` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `staff_id` (`staff_id`),
  CONSTRAINT `news_ibfk_2` FOREIGN KEY (`staff_id`) REFERENCES `staf` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `news_ibfk_3` FOREIGN KEY (`staff_id`) REFERENCES `staf` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `news_ibfk_4` FOREIGN KEY (`staff_id`) REFERENCES `staf` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES ('0d3fe7cf-68f0-4f17-9034-4df213393e10','1bf44b6f-e72c-4825-ae97-dd5f85370c08','Kemacetan Terparah','<p><span style=\"color: rgb(34, 7, 94);\">Berita Rekomendasi Berita Rekomendasi &nbsp;sdasdadd</span></p><p><span style=\"color: rgb(34, 7, 94);\">asdasdad</span></p>',0,'2025-06-20 08:57:50','2025-06-20 09:22:43',NULL,0,0,0),('0d42795a-8d3c-4a8c-9e69-18779384010e','1bf44b6f-e72c-4825-ae97-dd5f85370c08','Perkelahian Antar Warga','<p><br></p>',1,'2025-06-20 08:57:13','2025-06-20 08:57:13',NULL,0,0,0),('1c0caf67-09ed-44e7-a062-99cfccb1e1a0','1bf44b6f-e72c-4825-ae97-dd5f85370c08','Efek Pergantian Kepala Sekolah Yang Menimbulkan Transisi Buruk','<p>Perlu diketahui bahwasannya nurhamsah membuat text ini hanya untuk text dummy saja, jangan diambil hati okey mas bre mas bre</p>',1,'2025-06-19 16:51:46','2025-06-20 08:49:44',NULL,0,0,0),('7e8338f1-6b66-4c47-b5c3-f5625f7d02cb','1bf44b6f-e72c-4825-ae97-dd5f85370c08','Sosialisasi Penerimaan Peserta Didik Baru (PPDB)','<p style=\"text-align: left;\">Sekolah akan mengadakan kegiatan sosialisasi PPDB tahun 2025 secara <strong>daring dan luring</strong>. Orang tua dan calon siswa dapat mengikuti sesi informasi yang akan dilaksanakan pada hari Senin, 24 Juni 2025. Detail waktu dan tautan Zoom akan diumumkan melalui grup WhatsApp resmi sekolah. Kegagalan adalah bagian dari proses belajar. Jangan takut mencoba hal baru, meski belum tentu berhasil di awal. Yang terpenting adalah terus belajar, berusaha, dan bangkit kembali. Tetap semangat menempuh perjalanan menuju impianmu! Prestasi membanggakan diraih oleh Tim Basket SMAN 1 yang berhasil membawa pulang <strong>piala juara 1</strong> dalam Kejuaraan Antar Sekolah Kabupaten Bulukumba, Sabtu (14/06). Pertandingan berlangsung sengit, namun semangat tim dan dukungan pelatih membawa hasil luar biasa. Terima kasih atas kerja kerasnya! Sekolah akan mengadakan kegiatan sosialisasi PPDB tahun 2025 secara <strong>daring dan luring</strong>. Orang tua dan calon siswa dapat mengikuti sesi informasi yang akan dilaksanakan pada hari Senin, 24 Juni 2025. Detail waktu dan tautan Zoom akan diumumkan melalui grup WhatsApp resmi sekolah. Kegagalan adalah bagian dari proses belajar. Jangan takut mencoba hal baru, meski belum tentu berhasil di awal. Yang terpenting adalah terus belajar, berusaha, dan bangkit kembali. Tetap semangat menempuh perjalanan menuju impianmu! Prestasi membanggakan diraih oleh Tim Basket SMAN 1 yang berhasil membawa pulang <strong>piala juara 1</strong> dalam Kejuaraan Antar Sekolah Kabupaten Bulukumba, Sabtu (14/06). Pertandingan berlangsung sengit, namun semangat tim dan dukungan pelatih membawa hasil luar biasa. Terima kasih atas kerja kerasnya!Sekolah akan mengadakan kegiatan sosialisasi PPDB tahun 2025 secara <strong>daring dan luring</strong>. Orang tua dan calon siswa dapat mengikuti sesi informasi yang akan dilaksanakan pada hari Senin, 24 Juni 2025. Detail waktu dan tautan Zoom akan diumumkan melalui grup WhatsApp resmi sekolah. Kegagalan adalah bagian dari proses belajar. Jangan takut mencoba hal baru, meski belum tentu berhasil di awal. Yang terpenting adalah terus belajar, berusaha, dan bangkit kembali. Tetap semangat menempuh perjalanan menuju impianmu! Prestasi membanggakan diraih oleh Tim Basket SMAN 1 yang berhasil membawa pulang <strong>piala juara 1</strong> dalam Kejuaraan Antar Sekolah Kabupaten Bulukumba, Sabtu (14/06). Pertandingan berlangsung sengit, namun semangat tim dan dukungan pelatih membawa hasil luar biasa. Terima kasih atas kerja kerasnya!</p><p style=\"text-align: center;\"><img src=\"http://localhost:8000/news-image/PRE_1750324745593_profile-nurhamsah.jpg\" alt=\"PRE_PRE_1750324745593_profile-nurhamsah.jpg\" data-href=\"http://localhost:8000/news-image/PRE_1750324745593_profile-nurhamsah.jpg\" style=\"width: 431.00px;height: 473.02px;\"></p><p>Sekolah akan mengadakan kegiatan sosialisasi PPDB tahun 2025 secara <strong>daring dan luring</strong>. Orang tua dan calon siswa dapat mengikuti sesi informasi yang akan dilaksanakan pada hari Senin, 24 Juni 2025. Detail waktu dan tautan Zoom akan diumumkan melalui grup WhatsApp resmi sekolah. Kegagalan adalah bagian dari proses belajar. Jangan takut mencoba hal baru, meski belum tentu berhasil di awal. Yang terpenting adalah terus belajar, berusaha, dan bangkit kembali. Tetap semangat menempuh perjalanan menuju impianmu! Prestasi membanggakan diraih oleh Tim Basket SMAN 1 yang berhasil membawa pulang <strong>piala juara 1</strong> dalam Kejuaraan Antar Sekolah Kabupaten Bulukumba, Sabtu (14/06). Pertandingan berlangsung sengit, namun semangat tim dan dukungan pelatih membawa hasil luar biasa. Terima kasih atas kerja kerasnya!Sekolah akan mengadakan kegiatan sosialisasi PPDB tahun 2025 secara <strong>daring dan luring</strong>. Orang tua dan calon siswa dapat mengikuti sesi informasi yang akan dilaksanakan pada hari Senin, 24 Juni 2025. Detail waktu dan tautan Zoom akan diumumkan melalui grup WhatsApp resmi sekolah. Kegagalan adalah bagian dari proses belajar. Jangan takut mencoba hal baru, meski belum tentu berhasil di awal. Yang terpenting adalah terus belajar, berusaha, dan bangkit kembali. Tetap semangat menempuh perjalanan menuju impianmu! Prestasi membanggakan diraih oleh Tim Basket SMAN 1 yang berhasil membawa pulang <strong>piala juara 1</strong> dalam Kejuaraan Antar Sekolah Kabupaten Bulukumba, Sabtu (14/06). Pertandingan berlangsung sengit, namun semangat tim dan dukungan pelatih membawa hasil luar biasa. Terima kasih atas kerja kerasnya!</p><table style=\"width: auto;\"><tbody><tr><th colSpan=\"1\" rowSpan=\"1\" width=\"auto\">No</th><th colSpan=\"1\" rowSpan=\"1\" width=\"auto\">Nama</th><th colSpan=\"1\" rowSpan=\"1\" width=\"auto\">Jurusan</th><th colSpan=\"1\" rowSpan=\"1\" width=\"auto\">Kelas</th></tr><tr><td colSpan=\"1\" rowSpan=\"1\" width=\"auto\">1.</td><td colSpan=\"1\" rowSpan=\"1\" width=\"auto\">Nurhamsah</td><td colSpan=\"1\" rowSpan=\"1\" width=\"auto\">TKJ</td><td colSpan=\"1\" rowSpan=\"1\" width=\"auto\">10</td></tr><tr><td colSpan=\"1\" rowSpan=\"1\" width=\"auto\">2.</td><td colSpan=\"1\" rowSpan=\"1\" width=\"auto\">Uswatun hasanah VII</td><td colSpan=\"1\" rowSpan=\"1\" width=\"auto\">TKO</td><td colSpan=\"1\" rowSpan=\"1\" width=\"auto\">11</td></tr><tr><td colSpan=\"1\" rowSpan=\"1\" width=\"auto\">3.</td><td colSpan=\"1\" rowSpan=\"1\" width=\"auto\">Kartika Sari Mutiara Hikmah Maju Selalu</td><td colSpan=\"1\" rowSpan=\"1\" width=\"auto\">AKT</td><td colSpan=\"1\" rowSpan=\"1\" width=\"auto\">12</td></tr></tbody></table><p>Sekolah akan mengadakan kegiatan sosialisasi PPDB tahun 2025 secara <strong>daring dan luring</strong>. Orang tua dan calon siswa dapat mengikuti sesi informasi yang akan dilaksanakan pada hari Senin, 24 Juni 2025. Detail waktu dan tautan Zoom akan diumumkan melalui grup WhatsApp resmi sekolah. Kegagalan adalah bagian dari proses belajar. Jangan takut mencoba hal baru, meski belum tentu berhasil di awal. Yang terpenting adalah terus belajar, berusaha, dan bangkit kembali. Tetap semangat menempuh perjalanan menuju impianmu! Prestasi membanggakan diraih oleh Tim Basket SMAN 1 yang berhasil membawa pulang <strong>piala juara 1</strong> dalam Kejuaraan Antar Sekolah Kabupaten Bulukumba, Sabtu (14/06). Pertandingan berlangsung sengit, namun semangat tim dan dukungan pelatih membawa hasil luar biasa. Terima kasih atas kerja kerasnya! </p><blockquote>Sekolah akan mengadakan kegiatan sosialisasi PPDB tahun 2025 secara <strong>daring dan luring</strong>. Orang tua dan calon siswa dapat mengikuti sesi informasi yang akan dilaksanakan pada hari Senin, 24 Juni 2025. Detail waktu dan tautan Zoom akan diumumkan melalui grup WhatsApp resmi sekolah. Kegagalan adalah bagian dari proses belajar. Jangan takut mencoba hal baru, meski belum tentu berhasil di awal. Yang terpenting adalah terus belajar, berusaha, dan bangkit kembali. Tetap semangat menempuh perjalanan menuju impianmu! Prestasi membanggakan diraih oleh Tim Basket SMAN 1 yang berhasil membawa pulang <strong>piala juara 1</strong> dalam Kejuaraan Antar Sekolah Kabupaten Bulukumba, Sabtu (14/06). Pertandingan berlangsung sengit, namun semangat tim dan dukungan pelatih membawa hasil luar biasa. Terima kasih atas kerja kerasnya!</blockquote><h2>WHY NURHAMSAH ?</h2><p>Sekolah akan mengadakan kegiatan sosialisasi PPDB tahun 2025 secara <strong>daring dan luring</strong>. Orang tua dan calon siswa dapat mengikuti sesi informasi yang akan dilaksanakan pada hari Senin, 24 Juni 2025. Detail waktu dan tautan Zoom akan diumumkan melalui grup WhatsApp resmi sekolah. Kegagalan adalah bagian dari proses belajar. Jangan takut mencoba hal baru, meski belum tentu berhasil di awal. Yang terpenting adalah terus belajar, berusaha, dan bangkit kembali. Tetap semangat menempuh perjalanan menuju impianmu! Prestasi membanggakan diraih oleh Tim Basket SMAN 1 yang berhasil membawa pulang <strong>piala juara 1</strong> dalam Kejuaraan Antar Sekolah Kabupaten Bulukumba, Sabtu (14/06). Pertandingan berlangsung sengit, namun semangat tim dan dukungan pelatih membawa hasil luar biasa. Terima kasih atas kerja kerasnya! </p><p style=\"text-indent: 2em;\">Sekolah akan mengadakan kegiatan sosialisasi PPDB tahun 2025 secara <strong>daring dan luring</strong>. Orang tua dan calon siswa dapat mengikuti sesi informasi yang akan dilaksanakan pada hari Senin, 24 Juni 2025. Detail waktu dan tautan Zoom akan diumumkan melalui grup WhatsApp resmi sekolah. Kegagalan adalah bagian dari proses belajar. Jangan takut mencoba hal baru, meski belum tentu berhasil di awal. Yang terpenting adalah terus belajar, berusaha, dan bangkit kembali. Tetap semangat menempuh perjalanan menuju impianmu! Prestasi membanggakan diraih oleh Tim Basket SMAN 1 yang berhasil membawa pulang <strong>piala juara 1</strong> dalam Kejuaraan Antar Sekolah Kabupaten Bulukumba, Sabtu (14/06). Pertandingan berlangsung sengit, namun semangat tim dan dukungan pelatih membawa hasil luar biasa. Terima kasih atas kerja kerasnya!</p><p style=\"text-indent: 2em;\"><br></p><p>Sekolah akan mengadakan kegiatan sosialisasi PPDB tahun 2025 secara <strong>daring dan luring</strong>. Orang tua dan calon siswa dapat mengikuti sesi informasi yang akan dilaksanakan pada hari Senin, 24 Juni 2025. Detail waktu dan tautan Zoom akan diumumkan melalui grup WhatsApp resmi sekolah. Kegagalan adalah bagian dari proses belajar. Jangan takut mencoba hal baru, meski belum tentu berhasil di awal. Yang terpenting adalah terus belajar, berusaha, dan bangkit kembali. Tetap semangat menempuh perjalanan menuju impianmu! Prestasi membanggakan diraih oleh Tim Basket SMAN 1 yang berhasil membawa pulang <strong>piala juara 1</strong> dalam Kejuaraan Antar Sekolah Kabupaten Bulukumba, Sabtu (14/06). Pertandingan berlangsung sengit, namun semangat tim dan dukungan pelatih membawa hasil luar biasa. Terima kasih atas kerja kerasnya!</p><p><img src=\"http://localhost:8000/news-image/PRE_1750325012703_wtwetwetwetwet.PNG\" alt=\"PRE_PRE_1750325012703_wtwetwetwetwet.PNG\" data-href=\"http://localhost:8000/news-image/PRE_1750325012703_wtwetwetwetwet.PNG\" style=\"\"/></p><p>Sekolah akan mengadakan kegiatan sosialisasi PPDB tahun 2025 secara <strong>daring dan luring</strong>. Orang tua dan calon siswa dapat mengikuti sesi informasi yang akan dilaksanakan pada hari Senin, 24 Juni 2025. Detail waktu dan tautan Zoom akan diumumkan melalui grup WhatsApp resmi sekolah. Kegagalan adalah bagian dari proses belajar. Jangan takut mencoba hal baru, meski belum tentu berhasil di awal. Yang terpenting adalah terus belajar, berusaha, dan bangkit kembali. Tetap semangat menempuh perjalanan menuju impianmu! Prestasi membanggakan diraih oleh Tim Basket SMAN 1 yang berhasil membawa pulang <strong>piala juara 1</strong> dalam Kejuaraan Antar Sekolah Kabupaten Bulukumba, Sabtu (14/06). Pertandingan berlangsung sengit, namun semangat tim dan dukungan pelatih membawa hasil luar biasa. Terima kasih atas kerja kerasnya!</p><p>Terima kasih.</p>',1,'2025-06-19 16:23:51','2025-06-20 09:20:58','1750325031637_pexels-rebecca-zaal-252062-764681.jpg',0,3,0);
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newscomment`
--

DROP TABLE IF EXISTS `newscomment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `newscomment` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `staff_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `siswa_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `news_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `text` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `up_vote` int(11) DEFAULT 0,
  `down_vote` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `staff_id` (`staff_id`),
  KEY `siswa_id` (`siswa_id`),
  KEY `news_id` (`news_id`),
  CONSTRAINT `newscomment_ibfk_11` FOREIGN KEY (`staff_id`) REFERENCES `staf` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `newscomment_ibfk_12` FOREIGN KEY (`siswa_id`) REFERENCES `siswa` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `newscomment_ibfk_13` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newscomment`
--

LOCK TABLES `newscomment` WRITE;
/*!40000 ALTER TABLE `newscomment` DISABLE KEYS */;
INSERT INTO `newscomment` VALUES ('567736cc-c569-44cf-a274-d073b5cd4232','9aa1d2d4-4e86-489c-b6fa-a10c25fdbecf',NULL,'7e8338f1-6b66-4c47-b5c3-f5625f7d02cb','Sekolah akan mengadakan kegiatan sosialisasi PPDB tahun 2025 secara daring dan luring. Orang tua dan calon siswa dapat mengikuti sesi informasi yang akan dilaksanakan pada hari Senin, 24 Juni 2025. Detail waktu dan tautan Zoom akan diumumkan melalui grup WhatsApp resmi sekolah. Kegagalan adalah bagian dari proses belajar. 🎉🎉','2025-06-19 16:25:20','2025-06-19 16:26:57',2,0),('5fb6e255-fe17-414a-a0f8-c73727915a9d',NULL,'06bba161-d092-42ac-a76f-f139bcc8f96e','7e8338f1-6b66-4c47-b5c3-f5625f7d02cb','Tapi menurutku akan lebih baik kalau kita semua bergabung dan bersatu untuk melawan penjajah zionis israel, ayolah, mari kita saling jujur saja 😂','2025-06-19 16:26:28','2025-06-20 09:27:57',0,1);
/*!40000 ALTER TABLE `newscomment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newscommentreaction`
--

DROP TABLE IF EXISTS `newscommentreaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `newscommentreaction` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `staff_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '',
  `siswa_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `news_comment_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '',
  `type_vote` varchar(10) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newscommentreaction`
--

LOCK TABLES `newscommentreaction` WRITE;
/*!40000 ALTER TABLE `newscommentreaction` DISABLE KEYS */;
INSERT INTO `newscommentreaction` VALUES ('07ee110d-b25a-450d-be7c-54c22a8a7b7d','1bf44b6f-e72c-4825-ae97-dd5f85370c08','','2025-06-20 09:27:57','2025-06-20 09:27:57','5fb6e255-fe17-414a-a0f8-c73727915a9d','down_vote'),('a320a914-4ac7-4144-8128-ec5f7a896df9','1bf44b6f-e72c-4825-ae97-dd5f85370c08','','2025-06-19 16:26:57','2025-06-19 16:26:57','567736cc-c569-44cf-a274-d073b5cd4232','up_vote'),('a91d7654-6286-4ecc-9308-bdd0fa39fd62','','06bba161-d092-42ac-a76f-f139bcc8f96e','2025-06-19 16:25:41','2025-06-19 16:25:41','567736cc-c569-44cf-a274-d073b5cd4232','up_vote');
/*!40000 ALTER TABLE `newscommentreaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsreaction`
--

DROP TABLE IF EXISTS `newsreaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `newsreaction` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `staff_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '',
  `siswa_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '',
  `news_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `type_vote` varchar(10) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsreaction`
--

LOCK TABLES `newsreaction` WRITE;
/*!40000 ALTER TABLE `newsreaction` DISABLE KEYS */;
INSERT INTO `newsreaction` VALUES ('64106166-4fa6-4f77-b9ec-26965f8eec48','1bf44b6f-e72c-4825-ae97-dd5f85370c08','','2db81d0c-bd4f-4c53-8d12-ec68f156c5f9','2025-06-18 21:44:45','2025-06-18 21:44:45','up_vote'),('72c3af94-f5da-4f21-b7a6-5804ed6b2f35','9aa1d2d4-4e86-489c-b6fa-a10c25fdbecf','','7e8338f1-6b66-4c47-b5c3-f5625f7d02cb','2025-06-19 16:27:08','2025-06-19 16:27:08','up_vote'),('a9b814e8-c178-42bd-8bfb-4bcd4c4f6dd3','1bf44b6f-e72c-4825-ae97-dd5f85370c08','','7e8338f1-6b66-4c47-b5c3-f5625f7d02cb','2025-06-19 16:27:02','2025-06-19 16:27:02','up_vote'),('e88bb772-6feb-4fb4-b985-4a6fe09b15a0','','06bba161-d092-42ac-a76f-f139bcc8f96e','7e8338f1-6b66-4c47-b5c3-f5625f7d02cb','2025-06-19 16:27:12','2025-06-19 16:27:12','up_vote');
/*!40000 ALTER TABLE `newsreaction` ENABLE KEYS */;
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
INSERT INTO `siswa` VALUES ('06bba161-d092-42ac-a76f-f139bcc8f96e','Nurhamsah Cah PKB','L','2023001','1','1','accepted','2023','231','','','10','1','8635ef17-a7b3-4ce8-81c0-eab6ef209137',0,'not_paid_yet','','2025-06-19 07:12:09','2025-06-19 07:24:34');
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
INSERT INTO `staf` VALUES ('1bf44b6f-e72c-4825-ae97-dd5f85370c08','Rasta Benington','1','$2b$10$T626z5jfdouAqdQ/ey3nzeLZVKb4e4MmyVCtAUnPloCpl9VuAwXFO','[\"dashboard\", \"log_activity\", \"account_staff\", \"major\", \"files\", \"server\", \"news\"]','DEV','','2025-06-17 20:30:20','2025-06-19 13:39:30'),('29469841-1091-4037-97a2-09bd2869f6cf','Kumala','22','$2b$10$U6.wpdozamRi1Blw5.dyrOZjeJ0AQG.bxphgN/RUrca/RFtGrdXdC','[\"tagihan\",\"daftar_siswa\",\"laporan_transaksi\",\"student_bill_letter\",\"pembayaran\",\"transaksi\",\"pengumuman\"]','ADMINISTRASI','','2025-06-19 07:20:46','2025-06-19 07:20:49'),('9aa1d2d4-4e86-489c-b6fa-a10c25fdbecf','Kabib Nurham','11','$2b$10$YqdeAVhc9rNMNciwe4O.8.yHlWGgZIpRo3MdD1wC90fml2BWPXzO2','[\"tagihan\",\"daftar_siswa\",\"laporan_transaksi\",\"student_bill_letter\",\"pembayaran\",\"transaksi\",\"pengumuman\"]','ADMINISTRASI','','2025-06-17 20:54:44','2025-06-18 21:26:51');
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
INSERT INTO `tagihan-fix` VALUES ('daff206c-a44b-4d66-b529-651eafbd1a7f',2025,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'2025-06-19 11:32:16','2025-06-19 11:32:16');
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

-- Dump completed on 2025-06-20  9:33:19
