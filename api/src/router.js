const express = require("express");
const userController = require("./controllers/usersController");

const router = express.Router();

router.get("/users", userController.getAll);
router.get("/users/:id", userController.getById); 
module.exports = router;
