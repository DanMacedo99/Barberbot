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

    if (!horarioDentroDoFuncionamento(data, horario, servicoEncontrado.duracao)) {
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
        servicoId: Number(servicoId),
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

function horarioDentroDoFuncionamento(data, horario, duracaoServico) {
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

function listarAgendamentosFormatados() {
    return agendamentos.map((agendamento) => {
        const servicoEncontrado = buscarServicoPorId(agendamento.servicoId);
        return {
            ...agendamento,
            servico: servicoEncontrado ? servicoEncontrado.nome : 'Serviço não encontrado'
        };
    });

}

function atualizarAgendamentoPorId(id, novosDados) {
    const index = agendamentos.findIndex((agendamento) => {
        return agendamento.id === id;
    });

    if (index === -1) {
        return { erro: true, status: 404, resposta: { error: 'Agendamento não encontrado.' } };
    }

    const agendamentoAntigo = { ...agendamentos[index] };


    agendamentos[index] = {
        ...agendamentos[index],
        nome: novosDados.nome || agendamentos[index].nome,
        servicoId: novosDados.servicoId || agendamentos[index].servicoId,
        data: novosDados.data || agendamentos[index].data,
        horario: novosDados.horario || agendamentos[index].horario,
        status: novosDados.status || agendamentos[index].status
    };

    const servicoEncontrado = buscarServicoPorId(agendamentos[index].servicoId);

    const agendamentoNovo = {
        ...agendamentos[index],
        servico: servicoEncontrado ? servicoEncontrado.nome : 'Serviço não encontrado'
    };

    return { erro: false, agendamentoAntigo, agendamentoNovo };
}


function deletarAgendamentoPorId(id) {
    const index = agendamentos.findIndex((agendamento) => {
        return agendamento.id === id;
    });

    if (index === -1) {
        return { erro: true, status: 404, resposta: { error: 'Agendamento não encontrado.' } };
    }

    const agendamentoRemovido = agendamentos[index];
    agendamentos.splice(index, 1);

    const servicoEncontrado = buscarServicoPorId(agendamentoRemovido.servicoId);

    const agendamentoFormatado = {
        ...agendamentoRemovido,
        servico: servicoEncontrado ? servicoEncontrado.nome : 'Serviço não encontrado'
    };

    return { erro: false, agendamento: agendamentoFormatado };
}

module.exports = {
    buscarServicoPorNome,
    criarNovoAgendamento,
    listarAgendamentosFormatados,
    atualizarAgendamentoPorId,
    deletarAgendamentoPorId
};

