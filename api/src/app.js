const express = require("express");
const router = require("./router");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("../swagger-output.json"); // Caminho para o arquivo gerado pelo swagger-autogen

const app = express();

app.use(express.json());
app.use(router);

// Rota para a documentação do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
