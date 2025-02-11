const express = require("express");
const router = require("./router");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json"); // Caminho para o arquivo gerado pelo swagger-autogen
const cors = require("cors");


const app = express();
app.use(cors());

app.use(express.json());
app.use(router);

app.use(cors({
    origin: "http://localhost:3000", // Permitir apenas este domínio
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
  }));
// Rota para a documentação do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
