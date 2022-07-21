require('dotenv').config();
const mysql = require('mysql');

const dbOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};
const db = mysql.createConnection(dbOptions);

module.exports.db = db;
module.exports.dbOptions = dbOptions;
