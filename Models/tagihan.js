import { Sequelize } from "sequelize";
import database from "../Configuration/database.js";
import { jurusan } from "./jurusan.js";

const { DataTypes } = Sequelize;

export const tagihan = database.define(
  "tagihan",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    nama: {
      type: DataTypes.STRING,
    },
    deskripsi: {
      type: DataTypes.STRING,
    },
    angkatan: {
      type: DataTypes.INTEGER,
    },
    total: {
      type: DataTypes.BIGINT,
    },
    jurusanId: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

// tagihan.hasOne(jurusan, { foreignKey: "id" });
// tagihan.belongsTo(jurusan, { foreignKey: "major_id" });
// jurusan.hasOne(tagihan);
// tagihan.belongsTo(jurusan);
