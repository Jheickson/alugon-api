const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'aluga_banco'
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados!');  
});

connection.query('SELECT 1 + 1 AS solution', (err, rows, fields) => {
  if (err) {
    console.error('Erro na consulta:', err);
    return;
  }
  console.log('A solução é:', rows[0].solution);
});

module.exports = connection;
