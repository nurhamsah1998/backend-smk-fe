import { Sequelize } from "sequelize";

const database = new Sequelize("smk_kras", "root", "", {
  host: "localhost",
  dialect: "mysql",
  dialectOptions: {
    useUtc: false,
  },
  timezone: "+07:00",
});

export default database;
