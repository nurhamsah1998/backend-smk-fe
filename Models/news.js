import {Sequelize} from "sequelize";
import database from "../Configuration/database.js";
import {stafAuth} from "./staf.js";

const {DataTypes} = Sequelize;

export const news = database.define(
  "news",
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
    title: {
      type: DataTypes.STRING(200),
      defaultValue: "",
    },
    html: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    isPublish: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    like: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        max: 100000000,
      },
    },
    down_like: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        max: 100000000,
      },
    },
  },
  {freezeTableName: true}
);
stafAuth.hasOne(news, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "staff_id",
});

news.belongsTo(stafAuth, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "staff_id",
});
