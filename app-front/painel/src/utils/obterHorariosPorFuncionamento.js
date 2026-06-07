import { gerarHorarios } from "./agendaUtils";


export function obterHorariosPorFuncionamento(dataSelecionada, config) {
    if (!dataSelecionada || !config) {
        return [];
    }
    const data = new Date(`${dataSelecionada}T00:00`);
    const diaSemana = data.getDay();
    const funcionamentoDia = config.funcionamento[diaSemana];

    if (!funcionamentoDia || !funcionamentoDia.aberto) {
        return []
    };

    if (!funcionamentoDia.horaAbertura || !funcionamentoDia.horaFechamento) {
        return [];
    }

    return gerarHorarios(
        funcionamentoDia.horaAbertura,
        funcionamentoDia.horaFechamento,
        config.slotMin
    );
};