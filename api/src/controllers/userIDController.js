const userModel = require("../models/userIDModels");

const getById = async (request, response) => {
  console.log("ID recebido:", request.params.id);

  const id = Number(request.params.id); 
  if (isNaN(id)) {
    return response.status(400).json({ message: "ID inválido" });
  }
  
  const user = await userModel.getById(id);

  if (!user) {
    return response.status(404).json({ message: "Usuário não encontrado" });
  }

  return response.status(200).json(user);
};

module.exports = {
  getById,
};
