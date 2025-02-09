const pool = require("./connection");

// Buscar todos os aluguéis
const getAll = async () => {
  const [rows] = await pool.query("SELECT * FROM aluguel");
  return rows;
};

// Buscar aluguel por ID
const getById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM aluguel WHERE id = ?", [id]);
  return rows[0] || null;
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
    observacao,
  } = rental;
  const [result] = await pool.query(
    "INSERT INTO aluguel (espaco_id, locador, data_inicio, data_fim, valor_total, locatario, encerrado, observacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      espaco_id,
      locador,
      data_inicio,
      data_fim,
      valor_total,
      locatario,
      encerrado,
      observacao,
    ]
  );
  return { id: result.insertId, ...rental };
};

// Atualizar aluguel por ID
const update = async (id, rental) => {
  const {
    espaco_id,
    locador,
    data_inicio,
    data_fim,
    valor_total,
    locatario,
    encerrado,
    observacao,
  } = rental;
  const [result] = await pool.query(
    "UPDATE aluguel SET espaco_id = ?, locador = ?, data_inicio = ?, data_fim = ?, valor_total = ?, locatario = ?, encerrado = ?, observacao = ? WHERE id = ?",
    [
      espaco_id,
      locador,
      data_inicio,
      data_fim,
      valor_total,
      locatario,
      encerrado,
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

module.exports = { getAll, getById, create, update, remove };
