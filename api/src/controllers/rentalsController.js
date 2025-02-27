const rentalsModel = require("../models/rentalsModel");
const contractsModel = require("../models/contractsModel");

// Listar todos os aluguéis
const getAll = async (req, res) => {
  try {
    const rentals = await rentalsModel.getAll();
    
    res.json(rentals);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar aluguéis." });
  }
};

// Buscar aluguel por ID
const getById = async (req, res) => {
  try {
    const rental = await rentalsModel.getById(req.params.id);
    if (!rental) {
      return res.status(404).json({ error: "Aluguel não encontrado." });
    }
    res.json(rental);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar aluguel." });
  }
};


// Buscar aluguel por ID
const getByTenantId = async (req, res) => {
  console.log("Entrou aqui");
  try {
    const rentals = await rentalsModel.getByTenantId(req.params.id);
    
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar aluguéis." });
  }
};

const getByOwnerId = async (req, res) => {
  try {
    const rentals = await rentalsModel.getByOwnerId(req.params.id);
    res.json(rentals);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao buscar aluguéis." });
  }
};

// Criar um novo aluguel
const create = async (req, res) => {
  try {
    // Extrair dados do corpo da requisição
    const rentalData = {
      ...req.body,
      encerrado: 0,  // Valor fixo para a coluna 'encerrado' como 0
    };

    // Verificar se o contrato existe
    const contractId = rentalData.contrato_id;  // O contrato selecionado no formulário
    
    const contract = await contractsModel.getById(contractId);
    
    if (!contract) {
      return res.status(400).json({ error: "Contrato selecionado não encontrado." });
   }

    // Criar o aluguel com o contrato selecionado
    const newRental = await rentalsModel.create(rentalData); // Criação do aluguel
    
    // Resposta de sucesso
    res.status(201).json({
      aluguel: newRental,
    });
  } catch (error) {
    console.error("Erro ao criar aluguel:", error);
    res.status(500).json({ error: "Erro ao criar aluguel." });
  }
};



// Atualizar um aluguel
const update = async (req, res) => {
  try {
    const updated = await rentalsModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Aluguel não encontrado." });
    }
    res.json({ message: "Aluguel atualizado com sucesso." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao atualizar aluguel." });
  }
};

// Deletar um aluguel
const remove = async (req, res) => {
  try {
    
    const deleted = await rentalsModel.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Aluguel não encontrado." });
    }
    res.json({ message: "Aluguel removido com sucesso." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao remover aluguel." });
  }
};

module.exports = { getAll, getById, getByTenantId, getByOwnerId, create, update, remove };
