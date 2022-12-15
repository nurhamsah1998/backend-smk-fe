import { Sequelize } from "sequelize";
import database from "../Configuration/database.js";

const { DataTypes } = Sequelize;

export const tagihanFix = database.define(
  "tagihan-fix",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    tahun_angkatan: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    seragam: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pengembangan_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    jobsheet_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_juli_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_agustus_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_september_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pts_smt_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_oktober_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_november_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_desember_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pas_smt_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_januari_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_februari_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_maret_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pts_smt_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_april_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_mei_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_juni_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pas_smt_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    dll_kelas_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    /// NAIK KELAS 2
    prakerin: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pengembangan_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    jobsheet_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_juli_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_agustus_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_september_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pts_smt_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_oktober_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_november_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_desember_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pas_smt_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_januari_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_februari_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_maret_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pts_smt_4: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_april_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_mei_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_juni_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pas_smt_4: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    dll_kelas_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    /// NAIK KELAS 3
    k_industri: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pengembangan_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    jobsheet_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    ujian_akhir_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_juli_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_agustus_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_september_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pts_smt_5: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_oktober_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_november_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_desember_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pas_smt_5: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_januari_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_februari_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_maret_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pts_smt_6: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_april_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_mei_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_juni_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pas_smt_6: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    dll_kelas_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    /// LULUS
  },
  {
    freezeTableName: true,
  }
);
