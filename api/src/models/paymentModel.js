const pool = require("./connection");

// Buscar todos os pagamentos
const getAll = async () => {
  const [rows] = await pool.query("SELECT * FROM pagamento");
  return rows;
};

// Buscar pagamento por ID
const getById = async (id) => {
  try {
    const [rows] = await pool.query("SELECT * FROM pagamento WHERE id = ?", [
      id,
    ]);
    return rows[0] || null;
  } catch (error) {
    console.error("Erro na query getById:", error); // Log para identificar erros
    throw error;
  }
};

// Criar novo pagamento
const create = async (payment) => {
  const {
    conta,
    agencia,
    forma_pagamento,
    tipo_conta,
    num_transacao,
    data_pagamento,
  } = payment;
  const [result] = await pool.query(
    "INSERT INTO pagamento (conta, agencia, forma_pagamento, tipo_conta, num_transacao, data_pagamento) VALUES (?, ?, ?, ?, ?, ?)",
    [conta, agencia, forma_pagamento, tipo_conta, num_transacao, data_pagamento]
  );
  return { id: result.insertId, ...payment };
};

// Atualizar pagamento por ID
const update = async (id, payment) => {
  const {
    conta,
    agencia,
    forma_pagamento,
    tipo_conta,
    num_transacao,
    data_pagamento,
  } = payment;
  const [result] = await pool.query(
    "UPDATE pagamento SET conta = ?, agencia = ?, forma_pagamento = ?, tipo_conta = ?, num_transacao = ?, data_pagamento = ? WHERE id = ?",
    [
      conta,
      agencia,
      forma_pagamento,
      tipo_conta,
      num_transacao,
      data_pagamento,
      id,
    ]
  );
  return result.affectedRows > 0;
};

// Deletar pagamento por ID
const remove = async (id) => {
  const [result] = await pool.query("DELETE FROM pagamento WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, update, remove };
