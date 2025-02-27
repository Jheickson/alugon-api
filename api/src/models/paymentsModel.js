const PDFDocument = require('pdfkit');
const pool = require("./connection");

// Buscar todos os pagamentos
const getAll = async () => {
  const [rows] = await pool.query("SELECT * FROM pagamento");
  return rows;
};

// Buscar pagamento por ID
const getById = async (id) => {
  try {
    const [rows] = await pool.query("SELECT * FROM pagamento WHERE id = ?", [id]);
    return rows[0] || null;
  } catch (error) {
    console.error("Erro na query getById:", error);
    throw error;
  }
};

// Criar novo pagamento
const create = async (payment) => {
  const { num_transacao, fatura_id } = payment;

  const doc = new PDFDocument();
  const chunks = [];

  doc.on('data', chunk => chunks.push(chunk));
  doc.on('end', async () => {
    const boletoPdf = Buffer.concat(chunks); // Gera o buffer do boleto em PDF

    try {
      const [result] = await pool.query(
        "INSERT INTO pagamento (num_transacao, fatura_id, boleto_pdf) VALUES (?, ?, ?)",
        [num_transacao, fatura_id, boletoPdf]
      );

      return { id: result.insertId, ...payment };
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      throw new Error("Erro ao processar pagamento.");
    }
  });

  // Gerando o conteúdo do boleto (exemplo)
  doc.fontSize(12).text('Boleto de Pagamento');
  doc.text(`ID da Fatura: ${fatura_id}`);
  doc.text(`Número da Transação: ${num_transacao}`);
  doc.text(`Valor: R$ 100.00`);
  doc.end();
};




// Atualizar pagamento por ID
const update = async (id, payment) => {
  const {
    num_transacao,
    data_pagamento,
  } = payment;
  const [result] = await pool.query(
    "UPDATE pagamento SET  num_transacao = ?, data_pagamento = ? WHERE id = ?",
    [
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
