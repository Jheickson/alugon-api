const { parseISO, isFuture, isValid } = require("date-fns");
const usersModel = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validarCPF = require("../Utils/validaCpf");

const login = async(req, res) => {
    const email = req.body.email;
    const password = req.body.senha;
    try {
        const user = await usersModel.getByEmail(email);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado!" });
        }

        const validPassword = await bcrypt.compare(password, user.senha);

        if (!validPassword) {
            return res.status(401).json({ error: "Senha incorreta!" });
        }

        const fotoBase64 = user.foto ? user.foto.toString("base64") : null;

        const token = jwt.sign({ id: user.id, email: user.email }, "secret_key", {
            expiresIn: "1h",
        });
        res.status(200).json({ 
            user: {
                ...user,
                foto: fotoBase64,
            },
            token 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro no servidor!" });
    }
};


// Listar todos os usuários
const getAll = async(req, res) => {
    try {
        const usuarios = await usersModel.getAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
};

// Criar um novo usuário
const create = async (req, res) => {
  try {
    const { CPF, nome, data_nascimento, telefone, email, senha, foto, conta, agencia } = req.body;

    // Validações
    if (!CPF || !nome || !data_nascimento || !telefone || !email || !senha || !foto || !conta || !agencia) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Validar CPF
    if (!validarCPF(CPF)) {
      return res.status(400).json({ error: "CPF inválido." });
    }

    // Validar formato da data
    const parsedDate = parseISO(data_nascimento);
    if (!isValid(parsedDate) || isFuture(parsedDate)) {
      return res.status(400).json({ error: "Data de nascimento inválida." });
    }

    // Decodificar imagem
    let fotoBuffer = null;
    if (foto.startsWith("data:image")) {
      fotoBuffer = Buffer.from(foto.split(",")[1], "base64");
    }

    // Criar usuário
    const novoUsuario = await usersModel.create({
      CPF,
      nome,
      data_nascimento,
      telefone,
      email,
      senha,
      foto: fotoBuffer,
      conta,
      agencia
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};
  

// Buscar usuário por ID
const getById = async(req, res) => {
    try {
        const usuario = await usersModel.getById(req.params.id);
        if (!usuario) {
            console.error("Usuário não encontrado."); 
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        res.json(usuario);
    } catch (error) {
        console.error("Erro no getById:", error); 
        res.status(500).json({ error: "Erro ao buscar usuário." });
    }
};

// Atualizar um usuário existente
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { CPF, nome, data_nascimento, telefone, email, senha, foto, conta, agencia } = req.body;

    if (!CPF || !nome || !data_nascimento || !telefone || !email || !senha || !foto || !conta || !agencia) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Validar CPF
    if (!validarCPF(CPF)) {
      return res.status(400).json({ error: "CPF inválido." });
    }

    const parsedDate = parseISO(data_nascimento);
    if (!isValid(parsedDate) || isFuture(parsedDate)) {
      return res.status(400).json({ error: "Data de nascimento inválida." });
    }

    let fotoBuffer = null;
    if (foto.startsWith("data:image")) {
      fotoBuffer = Buffer.from(foto.split(",")[1], "base64");
    }

    const updatedData = {
      CPF,
      nome,
      data_nascimento: parsedDate,
      telefone,
      email,
      senha,
      foto: fotoBuffer,
      conta,
      agencia
    };

    const atualizado = await usersModel.update(id, updatedData);
    if (!atualizado) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json({ message: "Usuário atualizado com sucesso." });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};


// Deletar um usuário
const remove = async(req, res) => {
    try {
        const deletado = await usersModel.remove(req.params.id);
        if (!deletado) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }
        res.json({ message: "Usuário removido com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao remover usuário." });
    }
};

module.exports = { getAll, getById, create, update, remove, login };