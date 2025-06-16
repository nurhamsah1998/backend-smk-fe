import {Sequelize} from "sequelize";
import database from "../Configuration/database.js";
import {jurusan} from "./jurusan.js";

const {DataTypes} = Sequelize;

export const siswaAuth = database.define(
  "siswa",
  {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    nama: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    kode_siswa: {
      type: DataTypes.STRING,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "checking",
    },
    angkatan: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    nama_ayah: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    nama_ibu: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    alamat: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    kelas: {
      type: DataTypes.STRING,
      defaultValue: "10",
    },
    sub_kelas: {
      type: DataTypes.STRING,
      defaultValue: "1",
    },
    jurusanId: {
      type: DataTypes.UUID,
      defaultValue: "",
    },
    current_bill: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      validate: {
        max: 100000000,
      },
      total_bill: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        validate: {
          max: 100000000,
        },
      },
      total_payment: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        validate: {
          max: 100000000,
        },
      },
    },
    status_bill: {
      type: DataTypes.STRING,
      defaultValue: "not_paid_yet",
    },
    noHP: {
      type: DataTypes.STRING(12),
    },
  },
  {
    freezeTableName: true,
  }
);

jurusan.hasMany(siswaAuth, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  foreignKey: "jurusanId",
});
siswaAuth.belongsTo(jurusan, {
  onDelete: "RESTRICT",
  onUpdate: "RESTRICT",
  foreignKey: "jurusanId",
});
