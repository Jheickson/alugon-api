const connection = require("./connection");

const getAll = async () => {
  const user = await connection.query("SELECT * FROM usuario");
  return user;
};

module.exports = {
  getAll,
};
