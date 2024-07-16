const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/adicionar-usuario", userController.adicionarUsuario);
router.get("/login", userController.loginUsuario);
router.get("/idUsuario", userController.carregarFilmesAssistidos);
router.post("/adicionarFilmeAssistido", userController.adicionarFilmeAssistido);
router.delete("/deletarFilmeAssistido", userController.deletarFilmeAssistido);

module.exports = router;

module.exports = router;
