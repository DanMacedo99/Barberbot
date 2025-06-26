const agendamentos = require('../data/agendamentos');

function listarAgendamento(req, res) {
    res.json(agendamentos);
}

function criarAgendamento(req, res) {
    const { nome, servico, horario } = req.body;

    if (!nome || !servico || !horario) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const novoAgendamento = {
        id: Date.now().toString(),
        nome,
        servico,
        horario,
        situacao: 'pendente'
    };

    agendamentos.push(novoAgendamento);
    res.status(201).json(novoAgendamento);
}

function atualizarAgendamento(req, res) {
    const id = req.params.id;
    const { nome, servico, horario, situacao } = req.body;
    const index = agendamentos.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    agendamentos[index] = {
        ...agendamentos[index],
        nome: nome || agendamentos[index].nome,
        servico: servico || agendamentos[index].servico,
        horario: horario || agendamentos[index].horario,
        situacao: situacao || agendamentos[index].situacao
    };

    res.json(agendamentos[index]);
}

function deletarAgendamento(req, res) {
    const id = req.params.id;
    const index = agendamentos.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    const deletado = agendamentos.splice(index, 1);
    res.json({ mensagem: 'Agendamento excluído com sucesso.', deletado });
}

module.exports = {
    listarAgendamento,
    criarAgendamento,
    atualizarAgendamento,
    deletarAgendamento
};