const pool = require("./connection");

// Buscar todos os aluguéis
const getAll = async () => {
  const [rows] = await pool.query("SELECT * FROM aluguel WHERE encerrado=0");
  return rows;
};

// Buscar aluguel por ID
const getById = async (id) => {
  try {
    const [rows] = await pool.query("SELECT * FROM aluguel WHERE id = ? AND encerrado = 0", [id]);
    return rows[0] || null;
  } catch (error) {
    console.error("Erro na query getById:", error); 
    throw error;
  }
};

const getByTenantId = async (id) => {
  try {
    const [rows] = await pool.query("SELECT a.*, b.nome AS locatario FROM aluguel a INNER JOIN usuario b ON a.locatario = b.id WHERE a.locatario = ? AND a.encerrado = 0", [id]);
    return rows;
  } catch (error) {
    console.error("Erro na query getByTenantId:", error); 
    throw error;
  }
};

const getByOwnerId = async (id) => {
  try {
    const [rows] = await pool.query("SELECT a.*, b.nome AS locador, c.nome AS locatario FROM aluguel a INNER JOIN usuario b ON a.locador = b.id INNER JOIN usuario c ON a.locatario = c.id WHERE a.locador = ? AND a.encerrado = 0", [id]);
    return rows;
  } catch (error) {
    console.error("Erro na query getByOwnerId:", error); 
    throw error;
  }
};

// Criar novo aluguel
const create = async (rental) => {
  const {
    espaco_id,
    locador,
    data_inicio,
    data_fim,
    valor_total,
    locatario,
    encerrado,
    status,
    observacao,
    contrato_id,
  } = rental;

  const [result] = await pool.query(
    "INSERT INTO aluguel (espaco_id, locador, data_inicio, data_fim, valor_total, locatario, encerrado, status, observacao, contrato_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      espaco_id,
      locador,
      data_inicio,
      data_fim,
      valor_total,
      locatario,
      encerrado,
      status,
      observacao,
      contrato_id,
    ]
  );
  return { id: result.insertId, ...rental };
};

// Atualizar aluguel por ID
const update = async (id, rental) => {
  const {
    espaco_id,
    data_inicio,
    data_fim,
    valor_total,
    encerrado,
    status,
    observacao,
  } = rental;
  const [result] = await pool.query(
    "UPDATE aluguel SET espaco_id = ?, data_inicio = ?, data_fim = ?, valor_total = ?, encerrado = ?, status = ?, observacao = ? WHERE id = ?",
    [
      espaco_id,
      data_inicio,
      data_fim,
      valor_total,
      encerrado,
      status,
      observacao,
      id,
    ]
  );
  return result.affectedRows > 0;
};

// Deletar aluguel por ID
const remove = async (id) => {
  const [result] = await pool.query("DELETE FROM aluguel WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, getByTenantId, getByOwnerId, create, update, remove };
