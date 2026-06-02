function mensagemServicoNaoEncontrado(servico) {
    return `Desculpa, não encontrei o serviço ${servico}. Pode escolher um serviço disponível?`;
}

function mensagemErroCriarAgendamento() {
    return 'Desculpa, ocorreu um erro ao criar seu agendamento. Consegue descrever melhor o dia, horário e serviço?';
}

function mensagemAgendamentoRecebido(agendamento) {
    return (
        `Fechado, ${agendamento.nome}! Recebemos o seu pedido de agendamento:\n\n` +
        `Serviço: ${agendamento.servico}\n` +
        `Data: ${agendamento.data}\n` +
        `Horário: ${agendamento.horario}\n\n` +
        `Vamos confirmar e entramos em contato!`
    );
}

function mensagemPerguntarServico() {
    return 'Fala aí, beleza? Qual serviço você quer agendar?';
}

function mensagemPerguntarDataHorario(servico) {
    return `Show, anotado: ${servico}. Qual dia e horário você prefere?`;
}

function mensagemPerguntarHorario(servico, data) {
    return `Show, anotado: ${servico}. Certo, então ${data}. Qual horário você prefere?`;
}

function mensagemPerguntarData(hora) {
    return `Certo, então às ${hora}. Qual dia você gostaria?`;
}

function mensagemNaoEntendi() {
    return 'Não consegui entender bem. Pode repetir?';
}

function mensagemConfirmacaoAgendamento(agendamento) {
    return (
        `Olá, ${agendamento.nome}! Seu agendamento foi confirmado.\n\n` +
        `Serviço: ${agendamento.servico}\n` +
        `Data: ${agendamento.data}\n` +
        `Horário: ${agendamento.horario}\n\n` +
        `Obrigado!`
    );
}

function mensagemAlteracaoHorario(agendamentoAntigo, agendamentoNovo) {
    return (
        `Olá, ${agendamentoNovo.nome}. O horário do seu agendamento foi alterado.\n\n` +
        `De: ${agendamentoAntigo.horario}\n` +
        `Para: ${agendamentoNovo.horario}\n\n` +
        `Obrigado!`
    );
}

function mensagemCancelamentoAgendamento(agendamento) {
    return (
        `Olá, ${agendamento.nome}. Seu agendamento foi cancelado.\n` +
        `Se precisar, estamos à disposição para remarcar.`
    );
}

module.exports = {
    mensagemServicoNaoEncontrado,
    mensagemErroCriarAgendamento,
    mensagemAgendamentoRecebido,
    mensagemPerguntarServico,
    mensagemPerguntarDataHorario,
    mensagemPerguntarHorario,
    mensagemPerguntarData,
    mensagemNaoEntendi,
    mensagemConfirmacaoAgendamento,
    mensagemAlteracaoHorario,
    mensagemCancelamentoAgendamento
};