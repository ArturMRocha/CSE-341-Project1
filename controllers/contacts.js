const mongodb = require('../data/database');
const { ObjectId } = require('mongodb'); // ObjectId será necessário

/**
 * GET /contacts
 * Retorna todos os contatos.
 */
const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().collection('contacts').find();
        const contacts = await result.toArray();
        res.setHeader("Content-type", "application/json");
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message || 'Erro ao buscar contatos.' });
    }
};

/**
 * GET /contacts/{id}
 * Retorna um único contato pelo ID.
 */
const getSingle = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID fornecido não é válido.' });
        }

        const contactId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().collection('contacts').findOne({ _id: contactId });

        if (result) {
            res.setHeader("Content-type", "application/json");
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Contato não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Erro ao buscar o contato.' });
    }
};

/**
 * POST /contacts
 * Cria um novo contato.
 */
const createContact = async (req, res) => {
    try {
        const { firstName, lastName, email, favoriteColor, birthday } = req.body;

        // Validação simples (todos os campos são obrigatórios)
        if (!firstName || !lastName || !email || !favoriteColor || !birthday) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        const contact = {
            firstName,
            lastName,
            email,
            favoriteColor,
            birthday
        };

        const result = await mongodb.getDatabase().collection('contacts').insertOne(contact);

        if (result.acknowledged) {
            // Retorna o ID do novo contato
            res.status(201).json({ id: result.insertedId });
        } else {
            res.status(500).json({ message: 'Erro ao criar o contato.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Erro ao criar o contato.' });
    }
};

/**
 * PUT /contacts/{id}
 * Atualiza um contato existente.
 */
const updateContact = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID fornecido não é válido.' });
        }

        const contactId = new ObjectId(req.params.id);
        const updateData = req.body;

        // Remove o _id do corpo se ele foi enviado, para evitar erros
        delete updateData._id;

        const result = await mongodb.getDatabase().collection('contacts').updateOne(
            { _id: contactId },
            { $set: updateData }
        );

        if (result.modifiedCount > 0) {
            // Sucesso, retorna "No Content"
            res.status(204).send();
        } else {
            // Pode ser que não encontrou ou os dados eram os mesmos
            res.status(404).json({ message: 'Contato não encontrado ou dados não alterados.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Erro ao atualizar o contato.' });
    }
};

/**
 * DELETE /contacts/{id}
 * Deleta um contato existente.
 */
const deleteContact = async (req, res) => {
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'ID fornecido não é válido.' });
        }

        const contactId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().collection('contacts').deleteOne({ _id: contactId });

        if (result.deletedCount > 0) {
            // Sucesso, retorna "No Content"
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Contato não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Erro ao deletar o contato.' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};