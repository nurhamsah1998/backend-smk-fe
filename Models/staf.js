import { Sequelize } from "sequelize";
import database from "../Configuration/database.js";

const { DataTypes } = Sequelize;

export const stafAuth = database.define(
  "staf",
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
    username: {
      type: DataTypes.STRING,
      defaultValue: "",
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "PPDB",
    },
    noHP: {
      type: DataTypes.BIGINT,
    },
  },
  {
    freezeTableName: true,
  }
);
