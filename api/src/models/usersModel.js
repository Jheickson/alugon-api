const connection = require("./connection");

const getAll = async () => {
  const [users] = await connection.query("SELECT * FROM usuario"); 
  return users;
};

module.exports = {
  getAll,
};
