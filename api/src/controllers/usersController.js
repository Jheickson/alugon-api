const userModel = require("../models/usersModel"); // CORRETO ✅

const getAll = async (request, response) => {
  const users = await userModel.getAll();
  return response.status(200).json(users);
};

module.exports = {
  getAll,
};
