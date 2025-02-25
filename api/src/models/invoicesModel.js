const pool = require("./connection");

// Buscar todas as faturas
const getAll = async () => {
  const [rows] = await pool.query("SELECT * FROM fatura");
  return rows;
};

// Buscar fatura por ID
const getById = async (id) => {
  try {
    const [rows] = await pool.query("SELECT * FROM fatura WHERE id = ?", [id]);
    return rows[0] || null;
  } catch (error) {
    console.error("Erro na query getById:", error); // Log para identificar erros
    throw error;
  }
};


const getByUserId = async(id) => {
  const [rows] = await pool.query(
    "SELECT fatura.*, usuario.id AS responsavel_id FROM fatura INNER JOIN aluguel ON fatura.aluguel_id = aluguel.id INNER JOIN espaco ON aluguel.espaco_id = espaco.id INNER JOIN usuario ON espaco.responsavel = usuario.id WHERE usuario.id = ?", id);
  return rows;
};

// Criar nova fatura
const create = async (invoice) => {
  const {
    valor,
    data_emissao,
    data_venc,
    status,
    descontos,
    imposto,
    aluguel_id,
    pagamento_id,
  } = invoice;
  const [result] = await pool.query(
    "INSERT INTO fatura (valor, data_emissao, data_venc, status, descontos, imposto, aluguel_id, pagamento_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      valor,
      data_emissao,
      data_venc,
      status,
      descontos,
      imposto,
      aluguel_id,
      pagamento_id,
    ]
  );
  return { id: result.insertId, ...invoice };
};

// Atualizar fatura por ID
const update = async (id, invoice) => {
  const {
    valor,
    data_emissao,
    data_venc,
    status,
    descontos,
    imposto,
    aluguel_id,
    pagamento_id,
  } = invoice;
  const [result] = await pool.query(
    "UPDATE fatura SET valor = ?, data_emissao = ?, data_venc = ?, status = ?, descontos = ?, imposto = ?, aluguel_id = ?, pagamento_id = ? WHERE id = ?",
    [
      valor,
      data_emissao,
      data_venc,
      status,
      descontos,
      imposto,
      aluguel_id,
      pagamento_id,
      id,
    ]
  );
  return result.affectedRows > 0;
};

// Deletar fatura por ID
const remove = async (id) => {
  const [result] = await pool.query("DELETE FROM fatura WHERE id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = { getAll, getById, getByUserId, create, update, remove };
