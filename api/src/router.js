const express = require("express");
const usersController = require("./controllers/usersController");
const userIDController = require("./controllers/userIDController")

const router = express.Router();

router.get("/users", usersController.getAll);
router.get("/users/:id", userIDController.getById); 

module.exports = router;
