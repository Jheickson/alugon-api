const usersModel = require("../models/userModel");

const getAll = async (request, response) => {
  const user = await userModel.getAll();
  return response.status(200).json(user);
};

module.exports = {
  getAll,
};
