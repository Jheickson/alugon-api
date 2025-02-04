const express = require("express");
const db = require('./config/dbConnection')
const app = express();

app.use(express.json());

app.get("/usuario", (req, res) => {
    db.query("SELECT * FROM usuario", (err, results) => {
      if (err) {
        return res.status(500).json({ erro: "Erro no servidor" });
      }
      res.json(results);
    });
  });
  

  process.on('SIGINT', () => {
    db.end(() => {
      console.log('Conexão com o banco de dados encerrada.');
      process.exit();
    });
  });
  

app.listen(3333);