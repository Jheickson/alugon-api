const { parseISO, isFuture, isValid } = require("date-fns"); // Biblioteca útil para manipulação de datas
const usersModel = require("../models/usersModel");

// Listar todos os usuários
const getAll = async (req, res) => {
  try {
    const usuarios = await usersModel.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
};

// Criar um novo usuário
const create = async (req, res) => {
  try {
    const { CPF, nome, data_nascimento, telefone, email, senha } = req.body;

    // Validações
    if (!CPF || !nome || !data_nascimento || !telefone || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    // Validar formato da data
    const parsedDate = parseISO(data_nascimento);
    if (!isValid(parsedDate) || isFuture(parsedDate)) {
      return res.status(400).json({ error: "Data de nascimento inválida." });
    }

    // Criar o usuário
    const novoUsuario = await usersModel.create(req.body);
    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

// Buscar usuário por ID
const getById = async (req, res) => {
  try {
    const usuario = await usersModel.getById(req.params.id);
    if (!usuario) {
      console.error("Usuário não encontrado."); // Adicione logs aqui
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json(usuario);
  } catch (error) {
    console.error("Erro no getById:", error); // Adicione logs para capturar o erro
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
};

// Atualizar um usuário existente
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { CPF, nome, data_nascimento, telefone, email, senha } = req.body;

    // Validações
    if (!CPF || !nome || !data_nascimento || !telefone || !email || !senha) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios." });
    }

    // Validar formato da data
    const parsedDate = parseISO(data_nascimento);
    if (!isValid(parsedDate) || isFuture(parsedDate)) {
      return res.status(400).json({ error: "Data de nascimento inválida." });
    }

    // Atualizar o usuário
    const atualizado = await usersModel.update(id, req.body);
    if (!atualizado) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json({ message: "Usuário atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

// Deletar um usuário
const remove = async (req, res) => {
  try {
    const deletado = await usersModel.remove(req.params.id);
    if (!deletado) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json({ message: "Usuário removido com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover usuário." });
  }
};

module.exports = { getAll, getById, create, update, remove };
