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
    pengembangan_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    jobsheet_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_jul_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_agust_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_sept_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pts_smt_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_okt_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_nov_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_des_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pas_smt_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_jan_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_feb_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_mar_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pts_smt_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_apr_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_mei_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_jun_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pas_smt_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    dll_kls_1: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    /// NAIK KELAS 2
    prakerin: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pengembangan_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    jobsheet_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_jul_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_agust_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_sept_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pts_smt_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_okt_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_nov_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_des_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pas_smt_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_jan_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_feb_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_mar_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pts_smt_4: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_apr_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_mei_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_jun_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pas_smt_4: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    dll_kls_2: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    /// NAIK KELAS 3
    k_industri: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pengembangan_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    jobsheet_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    ujian_akhir_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_jul_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_agust_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_sept_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pts_smt_5: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_okt_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_nov_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_des_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pas_smt_5: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_jan_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_feb_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_mar_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pts_smt_6: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_apr_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_mei_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    spp_jun_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    pas_smt_6: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    dll_kls_3: {
      type: DataTypes.BIGINT,
      defaultValue: false,
    },
    /// LULUS
  },
  {
    freezeTableName: true,
  }
);
