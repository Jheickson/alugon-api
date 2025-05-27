const pool = require("./connection");
const bcrypt = require("bcryptjs");

// Buscar usuário por email
const getByEmail = async (email) => {
  const [rows] = await pool.query(
    "SELECT id, CPF, nome, data_nascimento, telefone, email, foto, conta, agencia FROM usuario WHERE email = ? AND ativo = 1",
    [email]
  );
  return rows[0] || null;
};

// Buscar todos os usuários
const getAll = async () => {
  const [rows] = await pool.query(
    "SELECT id, CPF, nome, data_nascimento, telefone, email, foto, conta, agencia FROM usuario WHERE ativo = 1"
  );
  return rows;
};

// Criar novo usuário
const create = async (usuario) => {
  const { CPF, nome, data_nascimento, telefone, email, senha, foto, conta, agencia } = usuario;

  // Verificar se já existe um usuário com o mesmo email ou CPF
  const [existingUsers] = await pool.query(
    "SELECT email, CPF FROM usuario WHERE (email = ? OR CPF = ?) AND ativo = 1",
    [email, CPF]
  );

  if (existingUsers.length > 0) {
    const existingUser = existingUsers[0];
    if (existingUser.email === email) {
      throw new Error("Usuário já cadastrado com este email.");
    } else if (existingUser.CPF === CPF) {
      throw new Error("Usuário já cadastrado com este CPF.");
    }
  }

  // Hash da senha antes de salvar
  const senhaHash = await bcrypt.hash(senha, 10);

  // Inserir novo usuário
  const [result] = await pool.query(
    "INSERT INTO usuario (CPF, nome, data_nascimento, telefone, email, senha, foto, conta, agencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [CPF, nome, data_nascimento, telefone, email, senhaHash, foto, conta, agencia]
  );

  return {
    id: result.insertId,
    CPF,
    nome,
    data_nascimento,
    telefone,
    email,
    foto,
    conta,
    agencia
  };
};

// Atualizar usuário por ID
const update = async (id, usuario) => {
  const { CPF, nome, data_nascimento, telefone, email, senha, foto, conta, agencia } = usuario;

  let query =
    "UPDATE usuario SET CPF = ?, nome = ?, data_nascimento = ?, telefone = ?, email = ?, ";
  const params = [CPF, nome, data_nascimento, telefone, email];

  // Atualiza a senha somente se ela foi fornecida
  if (senha) {
    const senhaHash = await bcrypt.hash(senha, 10);
    query += "senha = ?, ";
    params.push(senhaHash);
  }

  query += "foto = ?, conta = ?, agencia = ? WHERE id = ?";
  params.push(foto, conta, agencia, id);

  const [result] = await pool.query(query, params);
  return result.affectedRows > 0;
};

// Deletar usuário por ID (soft delete)
const remove = async (id) => {
  const [result] = await pool.query(
    "UPDATE usuario SET ativo = 0 WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

// Buscar usuário por ID
const getById = async (id) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, CPF, nome, data_nascimento, telefone, email, foto, conta, agencia FROM usuario WHERE id = ? AND ativo = 1",
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Erro na query getById:", error);
    throw error;
  }
};

module.exports = { getAll, create, update, remove, getById, getByEmail };
