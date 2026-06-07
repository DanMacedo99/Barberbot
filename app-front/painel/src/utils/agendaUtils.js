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
    return servicos.find(servicoAtual => {
        if (typeof agendamento.servico === 'string') {
            return servicoAtual.nome === agendamento.servico;
        }
        return servicoAtual.id === agendamento.servico;
    });
}

export function calcularBlocosNecessarios(servicoConfig, intervaloMin) {
    const duracaoServico = servicoConfig?.duracao || intervaloMin;
    return Math.ceil(duracaoServico / intervaloMin);
}