import { Sequelize } from "sequelize";
import database from "../Configuration/database.js";

const { DataTypes } = Sequelize;

export const invoice = database.define(
  "invoice",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    kode_tagihan: {
      type: DataTypes.STRING,
    },
    nama: {
      type: DataTypes.STRING,
    },
    deskripsi: {
      type: DataTypes.STRING,
    },
    kelas: {
      type: DataTypes.STRING,
    },
    jurusanId: {
      type: DataTypes.STRING,
    },
    angkatan: {
      type: DataTypes.INTEGER,
    },
    total: {
      type: DataTypes.BIGINT,
    },
    periode: {
      type: DataTypes.JSON,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
  }
);
