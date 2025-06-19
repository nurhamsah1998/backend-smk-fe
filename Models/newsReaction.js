import {Sequelize} from "sequelize";
import database from "../Configuration/database.js";

const {DataTypes} = Sequelize;

export const newsReaction = database.define(
  "newsReaction",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    staff_id: {
      type: DataTypes.UUID,
      defaultValue: "",
    },
    siswa_id: {
      type: DataTypes.UUID,
      defaultValue: "",
    },
    news_id: {
      type: DataTypes.UUID,
      defaultValue: "",
    },
    type_vote: {
      type: DataTypes.STRING(10),
      defaultValue: "",
    },
  },
  {freezeTableName: true}
);
