import './AgendaVisual.css';
import AgendamentoItem from './AgendamentoItem';
import { useConfig } from '../../context/ConfigContext';
import { useState, useEffect } from 'react';

function formatarDataLocal(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${dia}-${mes}-${ano}`;
}

function AgendaVisual({ agendamentos, onEditar, onCancelar, onConfirmar }) {
    const { config } = useConfig();
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [horarioAtual, setHorarioAtual] = useState(new Date());

    useEffect(() => {
        const intervalo = setInterval(() => {
            setHorarioAtual(new Date());
        }, 60000);

        return () => clearInterval(intervalo);
    }, []);

    if (!config) {
        return <div className="agenda-empty-state">Carregando configuração...</div>;
    }

    const diaSemana = dataSelecionada.getDay()
    const dataSelecionadaFormatada = formatarDataLocal(dataSelecionada);
    const dataAtualFormatada = formatarDataLocal(new Date());
    const exibindoHoje = dataSelecionadaFormatada === dataAtualFormatada;

    function handleChangeDay(daysToAdd) {
        const novaData = new Date(dataSelecionada);
        novaData.setDate(novaData.getDate() + daysToAdd);
        setDataSelecionada(novaData);
    }

    function handleChangeToToday() {
        setDataSelecionada(new Date());
    }

    const funcionamentoDia = config.funcionamento[diaSemana];
    const estabelecimentoFechado = !funcionamentoDia || !funcionamentoDia.aberto;


    const intervaloMin = config.slotMin;
    const horaAberto = funcionamentoDia?.horaAbertura;
    const horaFechado = funcionamentoDia?.horaFechamento;

    console.log('Dia da semana:', diaSemana);
    console.log('Funcionamento do dia:', funcionamentoDia);
    console.log('Hora aberto:', horaAberto);
    console.log('Hora fechado:', horaFechado);

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

    function converterHorarioParaMinutos(horario) {
        const [hora, minuto] = horario.split(':').map(Number);
        return hora * 60 + minuto;
    }

    const horarios = estabelecimentoFechado ? [] : gerarHorarios(horaAberto, horaFechado, intervaloMin);
    const horariosOcupados = new Set();

    let posicaoLinhaHorarioAtual = null;
    if (exibindoHoje && !estabelecimentoFechado) {
        const agora = horarioAtual;
        const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

        const minutosAbertura = converterHorarioParaMinutos(horaAberto);
        const minutosDesdeAbertura = minutosAgora - minutosAbertura;
        const alturaBloco = 66; // altura de cada bloco de horário em pixels
        const pixelsPorMinuto = alturaBloco / intervaloMin;
        posicaoLinhaHorarioAtual = minutosDesdeAbertura * pixelsPorMinuto;

    }

    return (
        <div className="agenda-visual">
            <div className="agenda-header">
                <button onClick={() => handleChangeDay(-1)}>←</button>

                <button onClick={handleChangeToToday}>Hoje</button>

                <button onClick={() => handleChangeDay(1)}>→</button>

                <strong>{dataSelecionadaFormatada}</strong>
            </div>
            <div className="agenda-corpo">
                {posicaoLinhaHorarioAtual !== null && (
                    <div
                        className="linha-horario-atual"
                        style={{ top: `${posicaoLinhaHorarioAtual}px` }}
                    />
                )}

                {estabelecimentoFechado ? (
                    <div className="agenda-empty-state">Fechado</div>
                ) : (
                    horarios.map((horarioAtual) => {
                        if (horariosOcupados.has(horarioAtual)) {
                            return null; // Pula horários já ocupados
                        }

                        const agendamento = agendamentos.find((agendamentoAtual) => {
                            return (
                                agendamentoAtual.data === dataSelecionadaFormatada &&
                                agendamentoAtual.horario === horarioAtual
                            )
                        })

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

                    })

                )}
            </div>
        </div>



    );

}

export default AgendaVisual;
