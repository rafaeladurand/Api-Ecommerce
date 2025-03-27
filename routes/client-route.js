const express = require("express");
const router = express.Router();
const {createClient,getClient,getAllClients,updateClient,deleteClient,} = require("../controllers/clientController");
const authenticateToken = require("../middlewares/authMiddleware");

// Rota para criação de usuário (pública)
router.post("/register",createClient);

// Rotas protegidas com autenticação JWT 
router.get("/", authenticateToken, getAllClients);
router.get("/:id", authenticateToken, getClient);
router.put("/:id", authenticateToken, updateClient);
router.delete("/:id", authenticateToken, deleteClient);

module.exports = router;