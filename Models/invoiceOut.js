import {Sequelize} from "sequelize";
import database from "../Configuration/database.js";

const {DataTypes} = Sequelize;

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
      type: DataTypes.STRING(200),
    },
    petugas: {
      type: DataTypes.STRING(200),
    },
    uang_keluar: {
      type: DataTypes.INTEGER,
      validate: {
        max: 100000000,
      },
    },
    note: {
      type: DataTypes.STRING(200),
      defaultValue: "",
    },
  },
  {
    freezeTableName: true,
  }
);
