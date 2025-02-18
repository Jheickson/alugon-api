const pool = require("./connection");

// Buscar todos os espaços
const getAll = async () => {
  const [rows] = await pool.query(
    "SELECT espaco.*, usuario.nome AS responsavel_nome FROM espaco INNER JOIN usuario ON espaco.responsavel = usuario.id"
  );
  return rows;
};

// Buscar espaço por ID
const getById = async (id) => {
  const [rows] = await pool.query(
    "SELECT espaco.*, usuario.nome AS responsavel_nome FROM espaco INNER JOIN usuario ON espaco.responsavel = usuario.id WHERE espaco.id = ?",
    [id]
  );
  return rows[0] || null;  
};

// Criar novo espaço
const create = async (space) => {
  const { numero, disponivel, descricao, valor, responsavel } = space;
  const [result] = await pool.query(
    "INSERT INTO espaco (numero, disponivel, descricao, valor, responsavel) VALUES (?, ?, ?, ?, ?)",
    [numero, disponivel, descricao, valor, responsavel]
  );
  return { id: result.insertId, ...space };
};

// Atualizar espaço por ID
const update = async (id, space) => {
  const { numero, disponivel, descricao, valor, responsavel } = space;
  const [result] = await pool.query(
    "UPDATE espaco SET numero = ?, disponivel = ?, descricao = ?, valor = ?, responsavel = ? WHERE id = ?",
    [numero, disponivel, descricao, valor, responsavel, id]
  );
  return result.affectedRows > 0;
};

// Deletar espaço por ID
const remove = async (id) => {
  const [result] = await pool.query("DELETE FROM espaco WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, update, remove };
