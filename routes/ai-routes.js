const express = require('express');
const router = express.Router();
const aiController = require("../controllers/ai-controller.js");
const isAuthenticated = require("../middleware/isAuthenticated.js");


router.post("/", isAuthenticated, aiController.defaultPrompt);
router.post("/long-context", aiController.longContext);

module.exports = router;