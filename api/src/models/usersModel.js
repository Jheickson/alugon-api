const connection = require("./connection");

const getAll = async () => {
  const [users] = await connection.query("SELECT * FROM usuario");
  return users;
};

const getById = async (id) => {
  const [[user]] = await connection.query("SELECT * FROM usuario WHERE id = ?", [id]);
  return user || null; 
};

module.exports = {
  getAll,
  getById,
};