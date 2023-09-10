import { Sequelize } from "sequelize";
import database from "../Configuration/database.js";

const { DataTypes } = Sequelize;

export const jurusan = database.define(
  "jurusan",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    nama: {
      type: DataTypes.STRING,
    },
    kode_jurusan: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);
