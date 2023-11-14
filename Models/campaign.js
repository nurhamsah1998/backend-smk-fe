import { Sequelize } from "sequelize";
import database from "../Configuration/database.js";
import { stafAuth } from "./staf.js";
import { jurusan } from "./jurusan.js";

const { DataTypes } = Sequelize;

export const campaign = database.define(
  "campaign",
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
      type: DataTypes.STRING,
      defaultValue: "",
    },
    text: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    status: {
      type: DataTypes.ENUM("umum", "penting"),
    },
    jurusan_id: {
      type: DataTypes.UUID,
      defaultValue: "",
    },
    is_response: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    kelas: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    sub_kelas: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    angkatan: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  { freezeTableName: true }
);
stafAuth.hasOne(campaign, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "staff_id",
});
campaign.belongsTo(stafAuth, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "staff_id",
});
jurusan.hasOne(campaign, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "jurusan_id",
});
campaign.belongsTo(jurusan, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
  foreignKey: "jurusan_id",
});
