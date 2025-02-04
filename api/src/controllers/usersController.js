const usuarioModel = require("../models/usuarioModel");

// Listar todos os usuários
const getAll = async(req, res) => {
    try {
        const usuarios = await usuarioModel.getAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
};

// Buscar usuário por ID
const getById = async(req, res) => {
    try {
        const usuario = await usuarioModel.getById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuário." });
    }
};

// Criar um novo usuário
const create = async(req, res) => {
    try {
        const novoUsuario = await usuarioModel.create(req.body);
        res.status(201).json(novoUsuario);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário." });
    }
};

// Atualizar um usuário
const update = async(req, res) => {
    try {
        const atualizado = await usuarioModel.update(req.params.id, req.body);
        if (!atualizado) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        res.json({ message: "Usuário atualizado com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar usuário." });
    }
};

// Deletar um usuário
const remove = async(req, res) => {
    try {
        const deletado = await usuarioModel.remove(req.params.id);
        if (!deletado) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        res.json({ message: "Usuário removido com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao remover usuário." });
    }
};

module.exports = { getAll, getById, create, update, remove };