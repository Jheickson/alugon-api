const express = require("express");
const usersController = require("./controllers/usersController");
const userController = require("./controllers/userController");

const router = express.Router();

router.get("/users", usersController.getAll);
router.get("/user", userController.getAll);

module.exports = router;
