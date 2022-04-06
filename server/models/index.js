import { Sequelize, QueryTypes } from "sequelize";

import config from "../config/config.js";
const { NODE_ENV, dbConfig } = config;
// import { NODE_ENV, dbConfig } from "../config/config.js";
import Items from "./Items.js";

// const { env } = require('../../config/config');
// const DBconfig = require('../../config/config').sequelize[env];

const db = {};
const sequelize = new Sequelize(dbConfig[NODE_ENV]);
/* 
Synchronizing all models at once
You can use sequelize.sync() to automatically synchronize all models. Example:
*/
sequelize.sync().then(() => console.log("DB"));

db.Op = Sequelize.Op;
db.QueryTypes = QueryTypes;
db.sequelize = sequelize;
db.Items = Items(sequelize, Sequelize);
// db.entrylists = _entrylists(sequelize, Sequelize);

export default db;
