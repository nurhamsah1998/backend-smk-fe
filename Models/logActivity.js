import { Sequelize } from "sequelize";
import database from "../Configuration/database.js";

const { DataTypes } = Sequelize;

export const logActivity = database.define(
  "log-activity",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    action: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    data: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    author: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    freezeTableName: true,
  }
);
