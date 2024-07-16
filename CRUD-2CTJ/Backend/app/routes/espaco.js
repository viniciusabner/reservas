const express = require('express');
const router = express.Router();
const espacoController = require('../controllers/espacoController');

// router.get('/espaco', espacoController.criarEspaco);
router.post('/adicionar-espaco', espacoController.criarEspaco);
router.get('/listar-espacos', espacoController.listarEspacos);
router.put('/editar-espaco/:id', espacoController.editarEspaco);
router.post('/reservar-horario', espacoController.reservarHorario);
router.delete('/excluir-espaco/:id', espacoController.excluirEspaco);

module.exports = router;
