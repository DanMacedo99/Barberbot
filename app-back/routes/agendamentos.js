const express = require('express');
const router = express.Router();
const {
    listarAgendamento,
    criarAgendamento,
    atualizarAgendamento,
    deletarAgendamento,
} = require('../controllers/agendamentoController');

// Rota para listar agendamentos
router.get('/agendamentos', listarAgendamento);

// Rota para criar um novo agendamento
router.post('/agendamentos', criarAgendamento);

// Rota para atualizar um agendamento existente
router.put('/agendamentos/:id', atualizarAgendamento);

// Rota para excluir um agendamento
router.delete('/agendamentos/:id', deletarAgendamento);

// Exporta o roteador para ser usado na aplicação principal
module.exports = router;