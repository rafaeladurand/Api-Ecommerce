const User = require("../models/user");
const Client = require("../models/client");

async function createClient(req, res) {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const clientExists = await Client.findOne({ user: userId });
    if (clientExists) {
      return res.status(400).json({ message: "Cliente já cadastrado." });
    }

    const newClient = new Client({ user: userId, purchases: [] });
    await newClient.save();

    res.status(201).json({ message: "Cliente criado com sucesso.", client: newClient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function getClient(req, res) {
  try {
    const client = await Client.findById(req.params.id).populate("user").populate("purchases");
    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function getAllClients(req, res) {
  try {
    const clients = await Client.find().populate("user").populate("purchases");
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

async function deleteClient(req, res) {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }
    res.json({ message: "Cliente excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}

module.exports = {createClient, getClient, getAllClients, deleteClient,};
