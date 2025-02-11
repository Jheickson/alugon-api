const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "API de Gerenciamento de Usuários e Espaços",
    description:
      "API para gerenciar usuários, espaços, aluguéis, contratos, pagamentos e faturas.",
  },
  host: "localhost:3333", // Altere para o host e porta corretos
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/app.js"]; // Caminho corrigido para o app.js

// Gera o arquivo de documentação do Swagger
swaggerAutogen(outputFile, endpointsFiles, doc);
