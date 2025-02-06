const mysql = require("mysql2/promise");
require("dotenv").config();

console.log(process.env.MYQSL_DB);

require("dotenv").config();

const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aluga_banco',
});

module.exports = connection;
