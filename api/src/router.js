const express = require("express");

const usersController = require("./controllers/usersController");
const spacesController = require("./controllers/spacesController");
const rentalController = require("./controllers/rentalsController");
const contractController = require("./controllers/contractsController");
const paymentController = require("./controllers/paymentsController");
const invoiceController = require("./controllers/invoicesController");

const router = express.Router();

// Users, Usuario
router.get("/users", usersController.getAll);
router.get("/users/:id", usersController.getById);
router.post("/users", usersController.create);
router.put("/users/:id", usersController.update);
router.delete("/users/:id", usersController.remove);

// Spaces, espaço
router.get("/spaces", spacesController.getAll);
router.get("/spaces/:id", spacesController.getById);
router.post("/spaces", spacesController.create);
router.put("/spaces/:id", spacesController.update);
router.delete("/spaces/:id", spacesController.remove);

// Rentals, aluguel
router.get("/rentals", rentalController.getAll);
router.get("/rentals/:id", rentalController.getById);
router.post("/rentals", rentalController.create);
router.put("/rentals/:id", rentalController.update);
router.delete("/rentals/:id", rentalController.remove);

// Contracts, Contrato
router.get("/contracts", contractController.getAll);
router.get("/contracts/:id", contractController.getById);
router.post("/contracts", contractController.create);
router.put("/contracts/:id", contractController.update);
router.delete("/contracts/:id", contractController.remove);

// Payments, Pagamento
router.get("/payments", paymentController.getAll);
router.get("/payments/:id", paymentController.getById);
router.post("/payments", paymentController.create);
router.put("/payments/:id", paymentController.update);
router.delete("/payments/:id", paymentController.remove);

// Invoices, fatura
router.get("/invoices", invoiceController.getAll);
router.get("/invoices/:id", invoiceController.getById);
router.post("/invoices", invoiceController.create);
router.put("/invoices/:id", invoiceController.update);
router.delete("/invoices/:id", invoiceController.remove);

module.exports = router;
