import {Sequelize} from "sequelize";
import database from "../Configuration/database.js";
import {stafAuth} from "./staf.js";

const {DataTypes} = Sequelize;

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
    authorId: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
  },
  {
    freezeTableName: true,
  }
);

logActivity.belongsTo(stafAuth, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  foreignKey: "authorId",
});
