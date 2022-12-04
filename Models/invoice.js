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
    invoice: {
      type: DataTypes.STRING,
    },
    nama: {
      type: DataTypes.STRING,
    },
    total: {
      type: DataTypes.INTEGER,
    },
    note: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);
