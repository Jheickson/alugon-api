const mysql = require("mysql2/promise");

const connection = mysql.createPool({
  host: process.env.MYQSL_HOST,
  user: process.env.MYQSL_USER,
  password: process.env.MYQSL_PASSWORD,
  database: process.env.MYQSL_DB,
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados!");
});

connection.query("SELECT 1 + 1 AS solution", (err, rows, fields) => {
  if (err) {
    console.error("Erro na consulta:", err);
    return;
  }
  console.log("A solução é:", rows[0].solution);
});

module.exports = connection;
