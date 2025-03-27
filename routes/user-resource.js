const express = require("express");
const router = express.Router();
const {createUser, loginUser, getUser, getAllUsers, updateUser, deleteUser, getUserPurchases,} = require("../controllers/userController");

// Importa middleware de autenticação JWT // /gustavo
const authenticateToken = require("../middlewares/authMiddleware");

// Rota para criação de usuário (pública)
router.post("/register", createUser);

// Rota de login (pública) // /gustavo
router.post("/login", loginUser);

// Rotas protegidas com autenticação JWT // /gustavo
router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUser);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);
router.get("/:userId/purchases", authenticateToken, getUserPurchases);

module.exports = router;
