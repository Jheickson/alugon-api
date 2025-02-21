const spacesModel = require("../models/spacesModel");

// Listar todos os espaços
const getAll = async(req, res) => {
    try {
        const spaces = await spacesModel.getAll();
        res.json(spaces);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar espaços." });
    }
};

// Buscar espaço por ID
const getById = async(req, res) => {
    try {
        const space = await spacesModel.getById(req.params.id);
        if (!space) {
            return res.status(404).json({ error: "Espaço não encontrado." });
        }
        res.json(space);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar espaço." });
    }
};

// Criar um novo espaço
const create = async(req, res) => {
    try {
        const newSpace = await spacesModel.create(req.body);
        res.status(201).json(newSpace);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar espaço." });
    }
};

// Atualizar um espaço
const update = async(req, res) => {
    try {
        const updated = await spacesModel.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ error: "Espaço não encontrado." });
        }
        res.json({ message: "Espaço atualizado com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar espaço." });
    }
};

// Deletar um espaço
const remove = async(req, res) => {
    try {
        const deleted = await spacesModel.remove(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Espaço não encontrado." });
        }
        res.json({ message: "Espaço removido com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao remover espaço." });
    }
};

module.exports = { getAll, getById, create, update, remove };