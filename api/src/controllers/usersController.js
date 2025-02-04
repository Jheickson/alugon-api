const usersModel = require("../models/usersModel");

const getAll = async (request, response) => {
  const users = await usersModel.getAll();
  return response.status(500).json(users);
};

module.exports = {
  getAll,
};
