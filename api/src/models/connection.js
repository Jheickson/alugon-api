const mysql = require("mysql2/promise");
require("dotenv").config();

const connection = mysql.createPool({
  host: process.env.MYQSL_HOST,
  user: process.env.MYQSL_USER,
  password: process.env.MYQSL_PASSWORD,
  database: process.env.MYQSL_DB,
});

module.exports = connection;
