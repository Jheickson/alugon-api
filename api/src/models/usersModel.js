const pool = require("./connection");
const bcrypt = require("bcryptjs");

const getByEmail = async(email) => {
    const [rows] = await pool.query("SELECT * FROM usuario WHERE email = ?", [
        email,
    ]);
    return rows[0] || null;
};

// Buscar todos os usuários
const getAll = async() => {
    const [rows] = await pool.query("SELECT * FROM usuario");
    return rows;
};

// Criar novo usuário
const create = async(usuario) => {
    const { CPF, nome, data_nascimento, telefone, email, senha, foto, conta, agencia } = usuario;

    // Verificar se já existe um usuário com o mesmo email ou CPF
    const [existingUsers] = await pool.query(
        "SELECT id FROM usuario WHERE email = ? OR CPF = ?", [email, CPF]
    );

    if (existingUsers.length > 0) {
        throw new Error("Usuário já cadastrado com este email ou CPF.");
    }

    // Hash da senha antes de salvar
    const senhaHash = await bcrypt.hash(senha, 10);

    // Inserir novo usuário
    const [result] = await pool.query(
        "INSERT INTO usuario (CPF, nome, data_nascimento, telefone, email, senha, foto, conta, agencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [CPF, nome, data_nascimento, telefone, email, senhaHash, foto, conta, agencia]
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
const update = async(id, usuario) => {
    const { CPF, nome, data_nascimento, telefone, email, senha, foto, conta, agencia } = usuario;
    usuario.senha = await bcrypt.hash(usuario.senha, 10);
    const [result] = await pool.query(
        "UPDATE usuario SET CPF = ?, nome = ?, data_nascimento = ?, telefone = ?, email = ?, senha = ?, foto = ?, conta = ?, agencia = ? WHERE id = ?", [CPF, nome, data_nascimento, telefone, email, senha, foto, conta, agencia, id]
    );
    return result.affectedRows > 0;
};

// Deletar usuário por ID
const remove = async(id) => {
    const [result] = await pool.query("DELETE FROM usuario WHERE id = ?", [id]);
    return result.affectedRows > 0;
};

// Buscar usuário por ID
const getById = async(id) => {
    try {
        const [rows] = await pool.query("SELECT * FROM usuario WHERE id = ?", [id]);
        return rows[0] || null;
    } catch (error) {
        console.error("Erro na query getById:", error);
        throw error;
    }
};

module.exports = { getAll, create, update, remove, getById, getByEmail };