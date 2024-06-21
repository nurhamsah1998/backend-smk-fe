import { Sequelize } from "sequelize";

const database = new Sequelize("smk_kras", "root", "", {
  host: "localhost",
  dialect: "mysql",
  timezone: "+07:00",
});

export default database;
