const connection = require("./connection");

const getById = async (id) => {
  const [[user]] = await connection.query("SELECT * FROM usuario WHERE id = ?", [id]);
  return user || null;
};

module.exports = {
  getById,
};
