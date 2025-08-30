import './AgendaVisual.css';
import AgendamentoItem from './AgendamentoItem';
import { useConfig } from '../../context/ConfigContext';

function AgendaVisual({ agendamentos, onEditar, onCancelar, onConfirmar }) {
    const { config } = useConfig();

    const intervaloMin = config.slotMin;
    const dataHoje = new Date();
    const diaSemana = dataHoje.getDay()
    const horaAberto = config.funcionamento[diaSemana].horaAbertura;
    const horaFechado = config.funcionamento[diaSemana].horaFechamento;

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
                        <div className='' key={horarioAtual}>
                            <div className=''>{horarioAtual}</div>
                            <div className=''>
                                <span className='disponivel'>Disponível</span>
                            </div>
                        </div>
                    );
                }

                const servicoConfig = config.servicos.find(s => s.nome === agendamento?.servico);
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
