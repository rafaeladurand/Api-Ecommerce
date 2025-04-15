const express = require("express");
const router = express.Router();
const {createUser, loginUser, getUser, talkWithGemini, getAllUsers, updateUser, deleteUser, getUserPurchases, updatePassword} = require("../controllers/user-controller");

// Importa middleware de autenticação JWT // /gustavo
const authenticateToken = require("../middleware/isAuthenticated.js");

// Rota para criação de usuário (pública)
router.post("/register", createUser);
router.post("/login", loginUser);

// Rotas protegidas com autenticação JWT // /gustavo
router.get("/", authenticateToken, getAllUsers);
router.get("/:id", getUser);
router.put("/:id",  updateUser);
router.delete("/:id", deleteUser);
router.get("/:userId/purchases", getUserPurchases);
router.put("/:id/password",  updatePassword);

router.post("/ia", talkWithGemini)

module.exports = router;
