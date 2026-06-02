const agendamentos = require('../data/agendamentos');
const config = require('../data/config');

function criarDataHora(data, horario) {
    return new Date(`${data}T${horario}`);
}

function calcularFimAgendamento(data, horario, duracao) {
    const inicio = criarDataHora(data, horario);
    return new Date(inicio.getTime() + duracao * 60000); // 60000 milissegundos em um minuto
}

function horarioEstaNoPassado(data, horario) {
    const agora = new Date();
    const dataHoraAgendamento = criarDataHora(data, horario);
    return dataHoraAgendamento < agora;
}

function verificarConflito(inicioAgendamentoNovo, fimAgendamentoNovo, inicioAgendamentoExistente, fimAgendamentoExistente) {
    return (
        (inicioAgendamentoNovo < fimAgendamentoExistente && fimAgendamentoNovo > inicioAgendamentoExistente)
    );
}

function existeConflito(dataNovoAgendamento, horarioNovoAgendamento, duracaoNovoAgendamento) {
    const inicioAgendamentoNovo = criarDataHora(dataNovoAgendamento, horarioNovoAgendamento);
    const fimAgendamentoNovo = calcularFimAgendamento(dataNovoAgendamento, horarioNovoAgendamento, duracaoNovoAgendamento);


    const agendamentosNoMesmoDia = agendamentos.filter((agendamentoExistente) => { return agendamentoExistente.data === dataNovoAgendamento });

    for (const agendamentoExistente of agendamentosNoMesmoDia) {
        const servicoAgendamentoExistente = buscarServicoPorId(agendamentoExistente.servicoId);
        if (!servicoAgendamentoExistente) {
            continue;
        }

        const inicioAgendamentoExistente = criarDataHora(
            agendamentoExistente.data,
            agendamentoExistente.horario
        );

        const fimAgendamentoExistente = calcularFimAgendamento(
            agendamentoExistente.data,
            agendamentoExistente.horario,
            servicoAgendamentoExistente.duracao
        );

        const conflitoEncontrado = verificarConflito(
            inicioAgendamentoNovo,
            fimAgendamentoNovo,
            inicioAgendamentoExistente,
            fimAgendamentoExistente
        );

        if (conflitoEncontrado) {
            return true;
        }

    }
    return false;
}

function buscarServicoPorId(servicoId) {
    return config.servicos.find((servico) => { return servico.id === Number(servicoId) });
}

function criarNovoAgendamento({ nome, servicoId, data, horario, numero = null, origem = 'painel' }) {
    if (!nome || !servicoId || !data || !horario) {
        return {
            erro: true,
            status: 400,
            resposta: { error: 'Preencha todos os campos, nome, serviço, data e horário são necessários.' }
        }
    };

    const servicoEncontrado = buscarServicoPorId(servicoId);

    if (!servicoEncontrado) {
        return {
            erro: true,
            status: 400,
            resposta: { error: 'Serviço inválido.' }
        }
    }

    if (horarioEstaNoPassado(data, horario)) {
        return {
            erro: true,
            status: 400,
            resposta: {
                error: 'Este horário já passou, qual outro seria melhor pra ti?.',
                message: 'Este horário já passou, por favor escolha outro horário ou data para o seu agendamento.'
            }
        }
    }

    if (!HorarioDentroDoFuncionamento(data, horario, servicoEncontrado.duracao)) {
        return {
            erro: true,
            status: 400,
            resposta: { error: 'Horário fora do horário de funcionamento.' }
        }
    }




    const conflito = existeConflito(data, horario, servicoEncontrado.duracao);

    if (conflito) {
        return {
            erro: true,
            status: 409,
            resposta: {
                error: 'Já existe um agendamento neste horário.',
                message: 'Por favor, escolha outro horário ou data para o seu agendamento.'
            }
        }
    };

    const novoAgendamento = {
        id: Date.now().toString(),
        nome,
        servicoId,
        data,
        horario,
        status: 'pendente',
        numero,
        origem
    };

    agendamentos.push(novoAgendamento);

    const agendamentoFormatado = {
        ...novoAgendamento,
        servico: servicoEncontrado.nome
    };

    return {
        erro: false,
        agendamento: agendamentoFormatado
    };
}

function buscarServicoPorNome(nomeServico) {
    return config.servicos.find((servico) => { return servico.nome.toLowerCase() === nomeServico.toLowerCase() });
}

function HorarioDentroDoFuncionamento(data, horario, duracaoServico) {
    const dataAgendamento = new Date(`${data}T00:00`);
    const diaSemana = dataAgendamento.getDay();

    const funcionamentoDia = config.funcionamento[diaSemana];

    if (!funcionamentoDia || !funcionamentoDia.aberto) {
        return false;
    }

    const inicioAgendamento = criarDataHora(data, horario);
    const fimAgendamento = calcularFimAgendamento(data, horario, duracaoServico);

    const inicioFuncionamento = criarDataHora(data, funcionamentoDia.horaAbertura);
    const fimFuncionamento = criarDataHora(data, funcionamentoDia.horaFechamento);

    return inicioAgendamento >= inicioFuncionamento && fimAgendamento <= fimFuncionamento;

}

module.exports = {
    existeConflito,
    buscarServicoPorId,
    buscarServicoPorNome,
    criarNovoAgendamento
};

