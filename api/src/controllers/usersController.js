const { parseISO, isFuture, isValid } = require("date-fns");
const usersModel = require("../models/usersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validarCPF = require("../Utils/validaCpf");

const recoveryCodes = {};

const recoverAccount = async (req, res) => {
  const { email } = req.body;
  const user = await usersModel.findByEmail(email);
  if (!user) {
    return res.status(404).json({ error: "Email não encontrado" });
  }

  const code = Math.floor(10000 + Math.random() * 90000).toString();
  recoveryCodes[email] = code;
  console.log(`🔒 Código de recuperação para ${email}: ${code}`);

  return res.status(200).json({ message: "Código de recuperação gerado" });
};

const verifyRecoveryCode = (req, res) => {
  const { email, code } = req.body;
  if (recoveryCodes[email] === code) {
    return res.status(200).json({ message: "Código válido" });
  }
  return res.status(400).json({ error: "Código inválido" });
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (recoveryCodes[email] !== code) {
    return res.status(400).json({ error: "Código inválido" });
  }

  const bcrypt = require("bcryptjs");
  const hashed = bcrypt.hashSync(newPassword, 8);
  await usersModel.updateByEmail(email, { senha: hashed });

  delete recoveryCodes[email];
  return res.status(200).json({ message: "Senha atualizada com sucesso" });
};

const validarDadosUsuario = (dadosUsuario) => {
  const erros = {};

  if (!dadosUsuario.CPF) {
    erros.CPF = "CPF é obrigatório";
  } else if (!validarCPF(dadosUsuario.CPF)) {
    erros.CPF = "CPF inválido";
  }

  if (!dadosUsuario.nome) {
    erros.nome = "Nome é obrigatório";
  } else if (dadosUsuario.nome.length < 3) {
    erros.nome = "Nome deve ter pelo menos 3 caracteres";
  }

  if (!dadosUsuario.data_nascimento) {
    erros.data_nascimento = "Data de nascimento é obrigatória";
  } else {
    try {
      const dataFormatada = parseISO(dadosUsuario.data_nascimento);
      if (!isValid(dataFormatada)) {
        erros.data_nascimento = "Data inválida";
      } else if (isFuture(dataFormatada)) {
        erros.data_nascimento = "Data não pode ser no futuro";
      }
    } catch {
      erros.data_nascimento = "Data inválida";
    }
  }

  if (!dadosUsuario.telefone) {
    erros.telefone = "Telefone é obrigatório";
  } else if (dadosUsuario.telefone.length < 10) {
    erros.telefone = "Telefone inválido";
  }

  if (!dadosUsuario.email) {
    erros.email = "Email é obrigatório";
  } else if (!/^\S+@\S+\.\S+$/.test(dadosUsuario.email)) {
    erros.email = "Email inválido";
  }

  if (!dadosUsuario.senha && !dadosUsuario.id) { // Para update sem senha
    erros.senha = "Senha é obrigatória";
  } else if (dadosUsuario.senha && dadosUsuario.senha.length < 6) {
    erros.senha = "Senha deve ter pelo menos 6 caracteres";
  }

  if (!dadosUsuario.foto) {
    erros.foto = "Foto é obrigatória";
  } else if (typeof dadosUsuario.foto !== "string" || !dadosUsuario.foto.startsWith("data:image")) {
    erros.foto = "Formato de imagem inválido";
  }

  if (!dadosUsuario.conta) {
    erros.conta = "Número da conta é obrigatório";
  } else if (!/^\d{1,10}(-\d{1})?$/.test(dadosUsuario.conta)) {
    erros.conta = "Formato de conta inválido. Use: 12345 ou 12345-6";
  } else if (dadosUsuario.conta.replace(/-/g, '').length > 10) {
    erros.conta = "Conta bancária não pode ter mais de 10 dígitos";
  }

  if (!dadosUsuario.agencia) {
    erros.agencia = "Agência é obrigatória";
  } else if (!/^\d{4}$/.test(dadosUsuario.agencia)) {
    erros.agencia = "Agência deve ter exatamente 4 dígitos numéricos";
  }

  return erros;
};

// Login do usuário
const login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await usersModel.getByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado!" });
    }

    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      return res.status(401).json({ error: "Senha incorreta!" });
    }

    const fotoBase64 = user.foto ? user.foto.toString("base64") : null;

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret_key", {
      expiresIn: "1h",
    });

    res.status(200).json({
      user: {
        ...user,
        foto: fotoBase64,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro no servidor!" });
  }
};

// Listar todos os usuários
const getAll = async (req, res) => {
  try {
    const usuarios = await usersModel.getAll();
    const usuariosComFoto = usuarios.map((u) => ({
      ...u,
      foto: u.foto ? u.foto.toString("base64") : null,
    }));
    res.json(usuariosComFoto);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
};

// Criar um novo usuário
const create = async (req, res) => {
  try {
    const errosValidacao = validarDadosUsuario(req.body);

    if (Object.keys(errosValidacao).length > 0) {
      return res.status(400).json({
        error: "Erro de validação",
        errors: errosValidacao,
      });
    }

    const { CPF, nome, data_nascimento, telefone, email, senha, foto, conta, agencia } = req.body;

    const fotoBuffer = Buffer.from(foto.split(",")[1], "base64");

    const novoUsuario = await usersModel.create({
      CPF,
      nome,
      data_nascimento,
      telefone,
      email,
      senha,
      foto: fotoBuffer,
      conta,
      agencia,
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    if (error.message.includes("já cadastrado")) {
      return res.status(400).json({
        error: error.message,
        field: error.message.includes("email") ? "email" : "CPF",
      });
    }
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

// Buscar usuário por ID
const getById = async (req, res) => {
  try {
    const usuario = await usersModel.getById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const fotoBase64 = usuario.foto ? usuario.foto.toString("base64") : null;
    res.json({
      ...usuario,
      foto: fotoBase64,
    });
  } catch (error) {
    console.error("Erro no getById:", error);
    res.status(500).json({ error: "Erro ao buscar usuário." });
  }
};

// Atualizar um usuário existente
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const errosValidacao = validarDadosUsuario({ ...req.body, id }); // Adiciona id para ignorar senha obrigatória

    if (Object.keys(errosValidacao).length > 0) {
      return res.status(400).json({
        error: "Erro de validação",
        errors: errosValidacao,
      });
    }

    const { CPF, nome, data_nascimento, telefone, email, senha, foto, conta, agencia } = req.body;

    const fotoBuffer = Buffer.from(foto.split(",")[1], "base64");

    const updatedData = {
      CPF,
      nome,
      data_nascimento,
      telefone,
      email,
      foto: fotoBuffer,
      conta,
      agencia,
    };

    // Só hash se senha foi enviada
    if (senha) {
      updatedData.senha = senha;
    }

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
const remove = async (req, res) => {
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

module.exports = {
  getAll, getById, create, update, remove, login, recoverAccount,
  verifyRecoveryCode,
  resetPassword,
};