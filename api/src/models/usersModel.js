const pool = require("./connection");

// Buscar todos os usuários
const getAll = async () => {
  const [rows] = await pool.query("SELECT * FROM usuario");
  return rows;
};

// Buscar usuário por ID
const getById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM usuario WHERE id = ?", [id]);
  return rows[0] || null;
};

// Criar novo usuário
const create = async (usuario) => {
  const { CPF, nome, data_nascimento, telefone, email, senha } = usuario;
  const [result] = await pool.query(
    "INSERT INTO usuario (CPF, nome, data_nascimento, telefone, email, senha) VALUES (?, ?, ?, ?, ?, ?)",
    [CPF, nome, data_nascimento, telefone, email, senha]
  );
  return { id: result.insertId, ...usuario };
};

// Atualizar usuário por ID
const update = async (id, usuario) => {
  const { CPF, nome, data_nascimento, telefone, email, senha } = usuario;
  const [result] = await pool.query(
    "UPDATE usuario SET CPF = ?, nome = ?, data_nascimento = ?, telefone = ?, email = ?, senha = ? WHERE id = ?",
    [CPF, nome, data_nascimento, telefone, email, senha, id]
  );
  return result.affectedRows > 0;
};

// Deletar usuário por ID
const remove = async (id) => {
  const [result] = await pool.query("DELETE FROM usuario WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, update, remove };
