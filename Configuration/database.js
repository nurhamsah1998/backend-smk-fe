import { Sequelize } from "sequelize";

const database = new Sequelize('smk_kras', 'root', '',{
    host:'localhost',
    dialect:'mysql'
})

export default database
