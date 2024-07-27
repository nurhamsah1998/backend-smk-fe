import { Sequelize } from "sequelize";
import database from "../Configuration/database.js";

const { DataTypes } = Sequelize;

export const invoiceOut = database.define(
  "invoiceOut",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    invoice_pengeluaran: {
      type: DataTypes.STRING,
    },
    nama: {
      type: DataTypes.STRING,
    },
    petugas: {
      type: DataTypes.STRING,
    },
    uang_keluar: {
      type: DataTypes.INTEGER,
    },
    note: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    freezeTableName: true,
  }
);
