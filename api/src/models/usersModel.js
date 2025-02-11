const pool = require("./connection");
const bcrypt = require("bcryptjs")

const getByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM usuario WHERE email = ?", [email]);
  return rows[0] || null;
};

// Buscar todos os usuários
const getAll = async () => {
  const [rows] = await pool.query("SELECT * FROM usuario");
  return rows;
};

// Criar novo usuário
const create = async (usuario) => {
  const { CPF, nome, data_nascimento, telefone, email, senha } = usuario;
  usuario.senha =  await bcrypt.hash(usuario.senha, 10);
  const [result] = await pool.query(
    "INSERT INTO usuario (CPF, nome, data_nascimento, telefone, email, senha) VALUES (?, ?, ?, ?, ?, ?)",
    [CPF, nome, data_nascimento, telefone, email, senha]
  );
  return { id: result.insertId, ...usuario };
};

// Atualizar usuário por ID
const update = async (id, usuario) => {
  const { CPF, nome, data_nascimento, telefone, email, senha } = usuario;
  usuario.senha = await bcrypt.hash(usuario.senha, 10);
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

// Buscar usuário por ID
const getById = async (id) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuario WHERE id = ?", [id]);
    return rows[0] || null;
  } catch (error) {
    console.error("Erro na query getById:", error); // Log para identificar erros
    throw error;
  }
};

module.exports = { getAll, create, update, remove, getById, getByEmail };
