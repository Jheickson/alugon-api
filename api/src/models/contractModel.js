const pool = require("./connection");

// Buscar todos os contratos
const getAll = async () => {
  const [rows] = await pool.query("SELECT * FROM contrato");
  return rows;
};

// Buscar contrato por ID
const getById = async (id) => {
  try {
    const [rows] = await pool.query("SELECT * FROM contrato WHERE id = ?", [
      id,
    ]);
    return rows[0] || null;
  } catch (error) {
    console.error("Erro na query getById:", error); // Log para identificar erros
    throw error;
  }
};

// Criar novo contrato
const create = async (contract) => {
  const {
    data_assinatura,
    data_venc,
    status,
    observacao,
    condicoes_pagamento,
    multa,
    aluguel_id,
  } = contract;
  const [result] = await pool.query(
    "INSERT INTO contrato (data_assinatura, data_venc, status, observacao, condicoes_pagamento, multa, aluguel_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      data_assinatura,
      data_venc,
      status,
      observacao,
      condicoes_pagamento,
      multa,
      aluguel_id,
    ]
  );
  return { id: result.insertId, ...contract };
};

// Atualizar contrato por ID
const update = async (id, contract) => {
  const {
    data_assinatura,
    data_venc,
    status,
    observacao,
    condicoes_pagamento,
    multa,
    aluguel_id,
  } = contract;
  const [result] = await pool.query(
    "UPDATE contrato SET data_assinatura = ?, data_venc = ?, status = ?, observacao = ?, condicoes_pagamento = ?, multa = ?, aluguel_id = ? WHERE id = ?",
    [
      data_assinatura,
      data_venc,
      status,
      observacao,
      condicoes_pagamento,
      multa,
      aluguel_id,
      id,
    ]
  );
  return result.affectedRows > 0;
};

// Deletar contrato por ID
const remove = async (id) => {
  const [result] = await pool.query("DELETE FROM contrato WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, create, update, remove };
