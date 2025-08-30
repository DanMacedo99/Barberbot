export function gerarHorariosParaData(dataSelecionada, config) {
    if (!dataSelecionada) return [];

    const data = new Date(dataSelecionada);
    const diaSemana = data.getDay();
    const funcionamentoDia = config.funcionamento[diaSemana];

    if (!funcionamentoDia?.aberto) return [];

    const horarioAbertura = funcionamentoDia.horaAbertura;
    const horarioFechamento = funcionamentoDia.horaFechamento;
    const intervaloMinutos = config.slotMin;

    const horarios = [];

    let [hora, minuto] = horarioAbertura.split(':').map(Number);
    const [horaFinal, minutoFinal] = horarioFechamento.split(':').map(Number);

    while (hora < horaFinal || (hora === horaFinal && minuto < minutoFinal)) {
        const horarioFormatado = `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
        horarios.push(horarioFormatado);

        minuto += intervaloMinutos;
        if (minuto >= 60) {
            minuto -= 60;
            hora += 1;
        }
    }
    return horarios;
};