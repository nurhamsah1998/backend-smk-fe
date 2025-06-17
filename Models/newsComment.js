import {Sequelize} from "sequelize";
import database from "../Configuration/database.js";
import {stafAuth} from "./staf.js";
import {news} from "./news.js";
import {siswaAuth} from "./siswa.js";

const {DataTypes} = Sequelize;

export const newsComment = database.define(
  "newsComment",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    staff_id: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
    siswa_id: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
    news_id: {
      type: DataTypes.UUID,
      defaultValue: null,
    },
    text: {
      type: DataTypes.STRING(5000),
      defaultValue: "",
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
news.hasMany(newsComment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "news_id",
});

newsComment.belongsTo(news, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "news_id",
});
/// STAFF
stafAuth.hasMany(newsComment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "staff_id",
});

newsComment.belongsTo(stafAuth, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "staff_id",
});
/// SISWA
siswaAuth.hasMany(newsComment, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "siswa_id",
});

newsComment.belongsTo(siswaAuth, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "siswa_id",
});
