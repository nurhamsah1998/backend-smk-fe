import {Sequelize} from "sequelize";
import dotEnv from "dotenv";

dotEnv.config();

const database = new Sequelize(
  process.env.DB_NAME,
  "root",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    timezone: "+07:00",
  }
);

export default database;
