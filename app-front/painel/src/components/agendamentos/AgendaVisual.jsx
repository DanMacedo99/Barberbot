import './AgendaVisual.css';
import AgendamentoItem from './AgendamentoItem';

function AgendaVisual({ agendamentos, onEditar, onCancelar, onConfirmar }) {
    const horarios = gerarHorarios('9:00', '18:00', 30);

    function gerarHorarios(inicio, fim, intervaloMin) {
        const lista = [];
        let [hora, minuto] = inicio.split(':').map(Number);
        const [fimHora, fimMinuto] = fim.split(':').map(Number);

        while (hora < fimHora || (hora === fimHora && minuto <= fimMinuto)) {
            const h = String(hora).padStart(2, '0');
            const m = String(minuto).padStart(2, '0');
            lista.push(`${h}:${m}`);
            minuto += intervaloMin;
            if (minuto >= 60) {
                minuto -= 60;
                hora += 1;
            }
        }
        return lista;
    }


    return (
        <div className="agenda-visual">
            {horarios.map((hora) => {
                const agendadosNesseHorario = agendamentos.filter(item => item.horario === hora);

                return (
                    <div className="bloco-horario" key={hora}>
                        <div className="hora">{hora}</div>
                        <div className="conteudo">
                            {agendadosNesseHorario.length === 0 ? (
                                <span className="disponivel">Disponível</span>
                            ) : (
                                agendadosNesseHorario.map(item => (
                                    <AgendamentoItem
                                        key={item.id}
                                        item={item}
                                        onEditar={onEditar}
                                        onCancelar={onCancelar}
                                        onConfirmar={onConfirmar}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                );
            })}
        </div>



    );

}

export default AgendaVisual;
