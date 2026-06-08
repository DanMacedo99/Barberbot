export function formatarDataISO(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
}

export function formatarDataParaExibicao(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${dia}-${mes}-${ano}`
}



export function gerarHorarios(inicio, fim, intervaloMin) {
    const horariosGerados = [];
    let [horarioAtual, minutoAtual] = inicio.split(':').map(Number);
    const [horaFinal, minutoFinal] = fim.split(':').map(Number);

    while (horarioAtual < horaFinal || (horarioAtual === horaFinal && minutoAtual <= minutoFinal)) {

        const horaFormatada = `${String(horarioAtual).padStart(2, '0')}:${String(minutoAtual).padStart(2, '0')}`;
        horariosGerados.push(horaFormatada);

        minutoAtual += intervaloMin;
        if (minutoAtual >= 60) {
            minutoAtual -= 60;
            horarioAtual += 1;
        }
    }
    return horariosGerados;
}

export function converterHorarioParaMinutos(horario) {
    const [hora, minuto] = horario.split(':').map(Number);
    return hora * 60 + minuto;
}

export function calcularPosicaoLinhaHorarioAtual({
    horarioAtual,
    horarioAbertura,
    intervaloMin,
    alturaBloco
}) {
    const minutosAgora = horarioAtual.getHours() * 60 + horarioAtual.getMinutes();
    const minutosAbertura = converterHorarioParaMinutos(horarioAbertura);
    const minutosDesdeAbertura = minutosAgora - minutosAbertura;
    const pixelsPorMinuto = alturaBloco / intervaloMin;
    return minutosDesdeAbertura * pixelsPorMinuto;
}

export function encontrarServicoDoAgendamento(agendamento, servicos) {
    return servicos.find((servicoAtual) => {
        if (agendamento.servicoId) {
            return servicoAtual.id === Number(agendamento.servicoId);
        }

        if (typeof agendamento.servico === 'string') {
            return servicoAtual.nome === agendamento.servico;
        }

        return servicoAtual.id === Number(agendamento.servico);
    });
}

export function calcularEstiloAgendamentoVisual({
    agendamento,
    servicos,
    horarioAbertura,
    intervaloMin,
    alturaSlot
}) {
    const servicoConfig = encontrarServicoDoAgendamento(agendamento, servicos);
    const duracaoServico = servicoConfig?.duracao || intervaloMin;

    const minutosAbertura = converterHorarioParaMinutos(horarioAbertura);
    const minutosAgendamento = converterHorarioParaMinutos(agendamento.horario);

    const minutosDesdeAbertura = minutosAgendamento - minutosAbertura;

    const top = (minutosDesdeAbertura / intervaloMin) * alturaSlot;
    const height = (duracaoServico / intervaloMin) * alturaSlot;

    return {
        top: `${top}px`,
        height: `${height}px`,
        alturaEmPixels: height
    };
}

export function calcularBlocosNecessarios(servicoConfig, intervaloMin) {
    const duracaoServico = servicoConfig?.duracao || intervaloMin;
    return Math.ceil(duracaoServico / intervaloMin);
}

export function horarioEstaDentroDoFuncionamentoAtual({
    horarioAtual,
    horaAbertura,
    horaFechamento
}) {
    if (!horaAbertura || !horaFechamento) {
        return false;
    }

    const horarioAtualEmMinutos = horarioAtual.getHours() * 60 + horarioAtual.getMinutes();
    const aberturaEmMinutos = converterHorarioParaMinutos(horaAbertura);
    const fechamentoEmMinutos = converterHorarioParaMinutos(horaFechamento);

    return horarioAtualEmMinutos >= aberturaEmMinutos && horarioAtualEmMinutos <= fechamentoEmMinutos;
}

export function filtrarAgendamentosPorData(agendamentos, dataISO) {
    return agendamentos.filter((agendamentoAtual) => {
        return agendamentoAtual.data === dataISO;
    });
}

export function buscarAgendamentoPorId(agendamentos, agendamentoId) {
    return agendamentos.find((agendamentoAtual) => {
        return agendamentoAtual.id === agendamentoId;
    });
}