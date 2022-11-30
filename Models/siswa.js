import { Sequelize } from "sequelize";
import database from "../Configuration/database.js";
import { jurusan } from "./jurusan.js";

const { DataTypes } = Sequelize;

export const siswaAuth = database.define(
  "siswa",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    nama: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    kode_siswa: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "checking",
    },
    angkatan: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    kelas: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    jurusanId: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    noHP: {
      type: DataTypes.BIGINT,
    },
  },
  {
    freezeTableName: true,
  }
);

jurusan.hasOne(siswaAuth);
siswaAuth.belongsTo(jurusan);
