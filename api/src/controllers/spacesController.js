const spacesModel = require("../models/spacesModel");

// Listar todos os espaços
const getAll = async (req, res) => {
    try {
        const spaces = await spacesModel.getAll();
        const result = spaces.map(space => {
            const fotoBase64 = space.imagem ? space.imagem.toString("base64") : null;
            
            return {
                ...space,
                imagem: fotoBase64 
            };
        });

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao buscar espaços." });
    }
};

// Buscar espaço por ID
const getById = async(req, res) => {
    try {
        const space = await spacesModel.getById(req.params.id);
        if (!space) {
            
            console.log("Não encontrado");
            return res.status(404).json({ error: "Espaço não encontrado." });
        }
        const fotoBase64 = space.imagem ? space.imagem.toString("base64") : null;
        res.status(200).json({ 
                ...space,
                imagem: fotoBase64, 
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar espaço." });
    }
};


const getByUserId = async (req, res) => {
    try {
        const spaces = await spacesModel.getByUserId(req.params.id);

        const spacesComImagens = spaces.map(space => ({
            ...space,
            imagem: space.imagem ? space.imagem.toString("base64") : null,
        }));

        res.status(200).json(spacesComImagens);
    } catch (error) {
        console.error("Erro ao buscar espaços:", error);
        res.status(500).json({ error: "Erro ao buscar espaços." });
    }
};



const create = async(req, res) => {
    try {
        const { numero, disponivel, descricao, valor, responsavel, imagem, cidade, bairro } = req.body;

        let fotoBuffer = null;
        if (imagem.startsWith("data:image")) {
            fotoBuffer = Buffer.from(imagem.split(",")[1], "base64"); 
        }
        
        const newSpace = await spacesModel.create(
            {
                numero,
                disponivel,
                descricao,
                valor: parseFloat(valor),
                responsavel,
                imagem: fotoBuffer,
                cidade,
                bairro,
            }
        );
        res.status(201).json(newSpace);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao criar espaço." });
    }
};

// Atualizar um espaço
const update = async (req, res) => {
    try {
        const { numero, disponivel, descricao, valor, responsavel, imagem, cidade, bairro } = req.body;

        let fotoBuffer = null;
        if (imagem.startsWith("data:image")) {
            fotoBuffer = Buffer.from(imagem.split(",")[1], "base64"); // Remove o prefixo e decodifica em buffer
        }

        const updated = await spacesModel.update(req.params.id, {
            numero,
            disponivel: 1,
            descricao,
            valor,
            responsavel,
            imagem: fotoBuffer, 
            cidade,
            bairro,
        });

        if (!updated) {
            return res.status(404).json({ error: "Espaço não encontrado." });
        }

        res.json({ message: "Espaço atualizado com sucesso." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Erro ao atualizar espaço." });
    }
};


// Deletar um espaço
const remove = async(req, res) => {
    try {
        const deleted = await spacesModel.remove(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Espaço não encontrado." });
        }
        res.json({ message: "Espaço removido com sucesso." });
    } catch (error) {
        res.status(500).json({ error: "Erro ao remover espaço." });
    }
};

module.exports = { getAll, getById, getByUserId, create, update, remove };