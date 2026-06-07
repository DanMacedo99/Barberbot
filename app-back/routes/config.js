const express = require('express');
const router = express.Router();
const { getConfig, updateConfig, createServico, updateServico, deleteServico } = require('../controllers/configController');

router.get('/config', getConfig);
router.put('/config', updateConfig);
router.post('/config/servicos', createServico);
router.put('/config/servicos/:id', updateServico);
router.delete('/config/servicos/:id', deleteServico);

module.exports = router;