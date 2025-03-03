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

  const generatePDF = async (db, pagamento_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const [rows] = await db.execute(
          `SELECT u.conta, u.agencia 
           FROM pagamento p
           JOIN fatura f ON p.fatura_id = f.id
           JOIN aluguel a ON f.aluguel_id = a.id
           JOIN usuario u ON a.locatario = u.id
           WHERE p.id = ?`,
          [pagamento_id]
        );

        if (rows.length === 0) {
          return reject(new Error("Pagamento não encontrado"));
        }

        const { conta, agencia } = rows[0];

        const doc = new PDFDocument();
        const chunks = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", (err) => reject(err));

        // Gerando o conteúdo do boleto
        doc.fontSize(12).text("Boleto de Pagamento");
        doc.text(`ID do Pagamento: ${pagamento_id}`);
        doc.text(`Conta: ${conta}`);
        doc.text(`Agência: ${agencia}`);
        doc.text(`Valor: R$ 100.00`);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  };

  try {
    const [result] = await pool.query(
      "INSERT INTO pagamento (num_transacao, fatura_id) VALUES (?, ?)",
      [num_transacao, fatura_id]
    );

    const pagamento_id = result.insertId;
    const boletoPdf = await generatePDF(pool, pagamento_id);

    await pool.query(
      "UPDATE pagamento SET boleto_pdf = ? WHERE id = ?",
      [boletoPdf, pagamento_id]
    );

    return { id: pagamento_id, ...payment };
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    throw new Error("Erro ao processar pagamento.");
  }
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