import { Sequelize } from "sequelize";
import database from "../Configuration/database.js";

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
    nisn: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    angkatan: {
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
