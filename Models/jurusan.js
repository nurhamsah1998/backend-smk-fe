import {Sequelize} from "sequelize";
import database from "../Configuration/database.js";

const {DataTypes} = Sequelize;

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
      unique: true,
    },
    kode_jurusan: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    freezeTableName: true,
  }
);
