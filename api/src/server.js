const https = require("https");
const fs = require("fs");
const path = require("path"); // Adicione esta linha
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 3333;

// Caminho corrigido usando path.join()
const options = {
  key: fs.readFileSync(path.join(__dirname, "../ssl/server.key")), // ../ sobe da pasta "src" para "api"
  cert: fs.readFileSync(path.join(__dirname, "../ssl/server.crt")),
};

// Cria servidor HTTPS
https.createServer(options, app).listen(PORT, () => {
  console.log(`Servidor HTTPS rodando na porta ${PORT}`);
});
