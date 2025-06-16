import {Sequelize} from "sequelize";
import database from "../Configuration/database.js";

const {DataTypes} = Sequelize;

export const stafAuth = database.define(
  "staf",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    nama: {
      type: DataTypes.STRING(200),
      defaultValue: "",
    },
    username: {
      type: DataTypes.STRING(200),
      defaultValue: "",
      unique: true,
    },
    password: {
      type: DataTypes.STRING(200),
      defaultValue: "",
    },
    permissions: {
      type: DataTypes.JSON,
      defaultValue: [
        "tagihan",
        "daftar_siswa",
        "laporan_transaksi",
        "student_bill_letter",
        "pembayaran",
        "transaksi",
        "pengumuman",
      ],
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "ANONIM",
    },
    noHP: {
      type: DataTypes.STRING(12),
    },
  },
  {
    freezeTableName: true,
  }
);
