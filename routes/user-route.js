const express = require("express");
const router = express.Router();
const {createUser, loginUser, getUser, getAllUsers, updateUser, deleteUser, getUserPurchases,} = require("../controllers/user-controller");

// Importa middleware de autenticação JWT // /gustavo
const authenticateToken = require("../middleware/isAuthenticated.js");

// Rota para criação de usuário (pública)
router.post("/register", createUser);
router.post("/login", loginUser);

// Rotas protegidas com autenticação JWT // /gustavo
router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUser);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);
router.get("/:userId/purchases", authenticateToken, getUserPurchases);

module.exports = router;
