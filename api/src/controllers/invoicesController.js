const invoicesModel = require("../models/invoicesModel");

// Listar todas as faturas
const getAll = async (req, res) => {
  try {
    const invoices = await invoicesModel.getAll();
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Erro ao buscar faturas:", error);
    res.status(500).json({ error: "Erro ao buscar faturas." });
  }
};

// Buscar fatura por ID
const getById = async (req, res) => {
  try {
    const invoice = await invoicesModel.getById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: "Fatura não encontrada." });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error("Erro ao buscar fatura:", error);
    res.status(500).json({ error: "Erro ao buscar fatura." });
  }
};

// Criar uma nova fatura
const create = async (req, res) => {
  try {
    const newInvoice = await invoicesModel.create(req.body);
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error("Erro ao criar fatura:", error);
    res.status(500).json({ error: "Erro ao criar fatura." });
  }
};

// Atualizar uma fatura
const update = async (req, res) => {
  try {
    const updated = await invoicesModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Fatura não encontrada." });
    }
    res.status(200).json({ message: "Fatura atualizada com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar fatura:", error);
    res.status(500).json({ error: "Erro ao atualizar fatura." });
  }
};

// Deletar uma fatura
const remove = async (req, res) => {
  try {
    const deleted = await invoicesModel.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Fatura não encontrada." });
    }
    res.status(200).json({ message: "Fatura removida com sucesso." });
  } catch (error) {
    console.error("Erro ao remover fatura:", error);
    res.status(500).json({ error: "Erro ao remover fatura." });
  }
};

module.exports = { getAll, getById, create, update, remove };
