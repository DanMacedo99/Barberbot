import './AgendaVisual.css';
import AgendamentoItem from './AgendamentoItem';
import { useConfig } from '../../context/ConfigContext';

function AgendaVisual({ agendamentos, onEditar, onCancelar, onConfirmar }) {
    const { config } = useConfig();

    if (!config) {
        return <div className="agenda-empty-state">Carregando configuração...</div>;
    }


    const dataHoje = new Date();
    const diaSemana = dataHoje.getDay()

    const funcionamentoDia = config.funcionamento[diaSemana];
    if (!funcionamentoDia || !funcionamentoDia.aberto) {
        return <div className="agenda-empty-state">Estabelecimento fechado hoje.</div>;
    }

    const intervaloMin = config.slotMin;
    const horaAberto = funcionamentoDia.horaAbertura;
    const horaFechado = funcionamentoDia.horaFechamento;

    function gerarHorarios(inicio, fim, intervaloMin) {
        const horariosGerados = [];
        let [horaAtual, minutoAtual] = inicio.split(':').map(Number);
        const [horaFinal, minutoFinal] = fim.split(':').map(Number);

        while (horaAtual < horaFinal || (horaAtual === horaFinal && minutoAtual <= minutoFinal)) {

            const horaFormatada = `${String(horaAtual).padStart(2, '0')}:${String(minutoAtual).padStart(2, '0')}`;
            horariosGerados.push(horaFormatada);

            minutoAtual += intervaloMin;
            if (minutoAtual >= 60) {
                minutoAtual -= 60;
                horaAtual += 1;
            }
        }
        return horariosGerados;
    }

    const horarios = gerarHorarios(horaAberto, horaFechado, intervaloMin);
    const horariosOcupados = new Set();

    return (
        <div className="agenda-visual">
            {horarios.map((horarioAtual) => {
                if (horariosOcupados.has(horarioAtual)) {
                    return null; // Pula horários já ocupados
                }

                const agendamento = agendamentos.find(a => a.horario === horarioAtual);

                if (!agendamento) {
                    return (
                        <div className='bloco-horario livre' key={horarioAtual}>
                            <div className='hora'>{horarioAtual}</div>
                            <div className='conteudo'>
                                <span className='disponivel'>Disponível</span>
                            </div>
                        </div>
                    );
                }

                const servicoConfig = config.servicos.find(s => {
                    if (typeof agendamento.servico === 'string') {
                        return s.nome === agendamento.servico;
                    }
                    return s.id === agendamento.servico;
                });
                const duracaoServico = servicoConfig?.duracao || intervaloMin;
                const blocosNecessarios = Math.ceil(duracaoServico / intervaloMin);

                const indexInicial = horarios.indexOf(horarioAtual);
                for (let i = 0; i < blocosNecessarios; i++) {
                    horariosOcupados.add(horarios[indexInicial + i]);

                }
                return (
                    <div
                        className="bloco-horario ocupado"
                        key={horarioAtual}
                        style={{ height: `${blocosNecessarios * 50}px` }}
                    >
                        <div className="hora">{horarioAtual}</div>
                        <div className="conteudo">

                            <AgendamentoItem
                                item={agendamento}
                                onEditar={onEditar}
                                onCancelar={onCancelar}
                                onConfirmar={onConfirmar}
                            />
                        </div>
                    </div>

                );

            })}
        </div>



    );

}

export default AgendaVisual;
