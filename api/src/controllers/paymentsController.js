const paymentsModel = require("../models/paymentsModel");



// Listar todos os pagamentos
const getAll = async (req, res) => {
  try {
    const payments = await paymentsModel.getAll();
    res.status(200).json(payments);
  } catch (error) {
    console.error("Erro ao buscar pagamentos:", error);
    res.status(500).json({ error: "Erro ao buscar pagamentos." });
  }
};

// Buscar pagamento por ID
const getById = async (req, res) => {
  try {
    const payment = await paymentsModel.getById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: "Pagamento não encontrado." });
    }

    // Retorna o pagamento, incluindo o boleto como base64 para exibição ou download
    const boletoPdfBase64 = payment.boleto_pdf ? payment.boleto_pdf.toString('base64') : null;
    res.status(200).json({
      ...payment,
      boleto_pdf: boletoPdfBase64
    });
  } catch (error) {
    console.error("Erro ao buscar pagamento:", error);
    res.status(500).json({ error: "Erro ao buscar pagamento." });
  }
};


// Criar um novo pagamento
const create = async (req, res) => {
  try {
    const { num_transacao, fatura_id } = req.body;
    const payment = { num_transacao, fatura_id };

    const createdPayment = await paymentsModel.create(payment);
    console.log(createdPayment);
    res.status(200).json({ id: createdPayment.id });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    res.status(500).json({ error: "Erro ao processar pagamento." });
  }
};



// Atualizar um pagamento
const update = async (req, res) => {
  console.log("Update");
  try {
    const updated = await paymentsModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Pagamento não encontrado." });
    }
    res.status(200).json({ message: "Pagamento atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar pagamento:", error);
    res.status(500).json({ error: "Erro ao atualizar pagamento." });
  }
};

// Deletar um pagamento
const remove = async (req, res) => {
  try {
    const deleted = await paymentsModel.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Pagamento não encontrado." });
    }
    res.status(200).json({ message: "Pagamento removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover pagamento:", error);
    res.status(500).json({ error: "Erro ao remover pagamento." });
  }
};

module.exports = { getAll, getById, create, update, remove };
