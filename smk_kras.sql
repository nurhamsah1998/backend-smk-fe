-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 20, 2023 at 01:38 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smk_kras`
--

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

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
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jurusan`
--

CREATE TABLE `jurusan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `kode_jurusan` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jurusan`
--

INSERT INTO `jurusan` (`id`, `nama`, `kode_jurusan`, `createdAt`, `updatedAt`) VALUES
('94cb522f-6a3f-11ee-871e-a41f72604672', 'Teknik Komputer dan Jaringan', 'TKJ', '2023-10-14 05:12:45', '2023-10-14 05:12:45'),
('a8d3f4fa-6a3f-11ee-871e-a41f72604672', 'Teknik Kendaraan Ringan', 'TKR', '2023-10-14 05:13:03', '2023-10-14 05:13:03'),
('bebbf4a8-6a3f-11ee-871e-a41f72604672', 'Akutansi', 'AKT', '2023-10-14 05:13:49', '2023-10-14 05:13:49');

-- --------------------------------------------------------

--
-- Table structure for table `log-activity`
--

CREATE TABLE `log-activity` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `action` varchar(255) DEFAULT '',
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `author` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`author`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `siswa`
--

CREATE TABLE `siswa` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT '',
  `kode_siswa` varchar(255) DEFAULT '',
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT '',
  `status` varchar(255) DEFAULT 'checking',
  `angkatan` varchar(255) DEFAULT '',
  `nama_ayah` varchar(255) DEFAULT '',
  `nama_ibu` varchar(255) DEFAULT '',
  `alamat` varchar(255) DEFAULT '',
  `kelas` varchar(255) DEFAULT '10',
  `sub_kelas` varchar(255) DEFAULT '1',
  `jurusanId` varchar(255) DEFAULT '',
  `current_bill` bigint(20) DEFAULT 0,
  `total_bill` bigint(20) DEFAULT 0,
  `total_payment` bigint(20) DEFAULT 0,
  `status_bill` varchar(255) DEFAULT 'not_paid_yet',
  `noHP` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staf`
--

CREATE TABLE `staf` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nama` varchar(255) DEFAULT '',
  `username` varchar(255) DEFAULT '',
  `password` varchar(255) DEFAULT '',
  `role` varchar(255) DEFAULT 'ANONIM',
  `noHP` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staf`
--

INSERT INTO `staf` (`id`, `nama`, `username`, `password`, `role`, `noHP`, `createdAt`, `updatedAt`) VALUES
('87cf5373-db5a-4b17-ae72-565dc4f5a3a6', 'Nur Hamsah', 'nur.hamsah.cash@gmial.com', '$2b$10$of6J6BRNp6xM1XnoD2730.QhfUtPiWhrWQGYJANFAC0A8SZpyBdoS', 'DEV', 81213221334, '2023-10-17 13:37:57', '2023-10-17 13:37:57'),
('96cab88a-7fc0-412b-aae2-9f4cad5a2c4d', 'Susianti', 'Susianti009', '$2b$10$tKbjgAyGNDtWTvRVUrbiJOR4QRKxI6V/93JH8nMR9h4mHcGzV/X42', 'ADMINISTRASI', 3342343234234, '2023-10-17 13:40:35', '2023-10-17 13:40:35');

-- --------------------------------------------------------

--
-- Table structure for table `tagihan-fix`
--

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
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tagihan-fix`
--

INSERT INTO `tagihan-fix` (`id`, `tahun_angkatan`, `seragam`, `pengembangan_kelas_1`, `jobsheet_kelas_1`, `spp_juli_kelas_1`, `spp_agustus_kelas_1`, `spp_september_kelas_1`, `pts_smt_1`, `spp_oktober_kelas_1`, `spp_november_kelas_1`, `spp_desember_kelas_1`, `pas_smt_1`, `spp_januari_kelas_1`, `spp_februari_kelas_1`, `spp_maret_kelas_1`, `pts_smt_2`, `spp_april_kelas_1`, `spp_mei_kelas_1`, `spp_juni_kelas_1`, `pas_smt_2`, `dll_kelas_1`, `prakerin`, `pengembangan_kelas_2`, `jobsheet_kelas_2`, `spp_juli_kelas_2`, `spp_agustus_kelas_2`, `spp_september_kelas_2`, `pts_smt_3`, `spp_oktober_kelas_2`, `spp_november_kelas_2`, `spp_desember_kelas_2`, `pas_smt_3`, `spp_januari_kelas_2`, `spp_februari_kelas_2`, `spp_maret_kelas_2`, `pts_smt_4`, `spp_april_kelas_2`, `spp_mei_kelas_2`, `spp_juni_kelas_2`, `pas_smt_4`, `dll_kelas_2`, `kunjungan_industri`, `pengembangan_kelas_3`, `jobsheet_kelas_3`, `ujian_akhir_kelas_3`, `spp_juli_kelas_3`, `spp_agustus_kelas_3`, `spp_september_kelas_3`, `pts_smt_5`, `spp_oktober_kelas_3`, `spp_november_kelas_3`, `spp_desember_kelas_3`, `pas_smt_5`, `spp_januari_kelas_3`, `spp_februari_kelas_3`, `spp_maret_kelas_3`, `pts_smt_6`, `spp_april_kelas_3`, `spp_mei_kelas_3`, `spp_juni_kelas_3`, `pas_smt_6`, `dll_kelas_3`, `createdAt`, `updatedAt`) VALUES
('1934ad94-6f3d-11ee-9395-a41f72604672', 2023, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '2023-10-20 13:37:42', '2023-10-20 13:37:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jurusan`
--
ALTER TABLE `jurusan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `log-activity`
--
ALTER TABLE `log-activity`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `siswa`
--
ALTER TABLE `siswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `staf`
--
ALTER TABLE `staf`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `tagihan-fix`
--
ALTER TABLE `tagihan-fix`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
