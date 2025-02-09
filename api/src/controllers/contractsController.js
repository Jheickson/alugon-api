const ContractsModel = require("../models/contractsModel");

// Listar todos os contratos
const getAll = async (req, res) => {
  try {
    const contracts = await ContractsModel.getAll();
    res.status(200).json(contracts);
  } catch (error) {
    console.error("Erro ao buscar contratos:", error);
    res.status(500).json({ error: "Erro ao buscar contratos." });
  }
};

// Buscar contrato por ID
const getById = async (req, res) => {
  try {
    const contract = await ContractsModel.getById(req.params.id);
    if (!contract) {
      return res.status(404).json({ error: "Contrato não encontrado." });
    }
    res.status(200).json(contract);
  } catch (error) {
    console.error("Erro ao buscar contrato:", error);
    res.status(500).json({ error: "Erro ao buscar contrato." });
  }
};

// Criar um novo contrato
const create = async (req, res) => {
  try {
    const newContract = await ContractsModel.create(req.body);
    res.status(201).json(newContract);
  } catch (error) {
    console.error("Erro ao criar contrato:", error);
    res.status(500).json({ error: "Erro ao criar contrato." });
  }
};

// Atualizar um contrato
const update = async (req, res) => {
  try {
    const updated = await ContractsModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Contrato não encontrado." });
    }
    res.status(200).json({ message: "Contrato atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar contrato:", error);
    res.status(500).json({ error: "Erro ao atualizar contrato." });
  }
};

// Deletar um contrato
const remove = async (req, res) => {
  try {
    const deleted = await ContractsModel.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Contrato não encontrado." });
    }
    res.status(200).json({ message: "Contrato removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover contrato:", error);
    res.status(500).json({ error: "Erro ao remover contrato." });
  }
};

module.exports = { getAll, getById, create, update, remove };
