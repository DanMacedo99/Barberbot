import './AgendaVisual.css';
import AgendamentoItem from './AgendamentoItem';
import AgendaDiaHeader from './AgendaDiaHeader';
import AgendamentoModal from './AgendamentoModal';
import LinhaHorarioAtual from './LinhaHorarioAtual';
import { useConfig } from '../../hooks/useConfig';
import { useState, useEffect } from 'react';
import { obterHorariosPorFuncionamento } from '../../utils/obterHorariosPorFuncionamento';
import {
    formatarDataISO,
    formatarDataParaExibicao,
    calcularPosicaoLinhaHorarioAtual,
    horarioEstaDentroDoFuncionamentoAtual,
    calcularEstiloAgendamentoVisual,
    filtrarAgendamentosPorData,
    buscarAgendamentoPorId
} from '../../utils/agendaUtils';


function AgendaVisual({ agendamentos, onEditar, onCancelar, onConfirmar }) {
    const { config } = useConfig();
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [horarioAtual, setHorarioAtual] = useState(new Date());
    const [agendamentoSelecionadoId, setAgendamentoSelecionadoId] = useState(null)
    const ALTURA_SLOT = 56;

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
    const dataSelecionadaISO = formatarDataISO(dataSelecionada)
    const dataSelecionadaExibicao = formatarDataParaExibicao(dataSelecionada);
    const dataAtualISO = formatarDataISO(new Date());
    const exibindoHoje = dataSelecionadaISO === dataAtualISO;


    const funcionamentoDia = config.funcionamento[diaSemana];
    const estabelecimentoFechado = !funcionamentoDia || !funcionamentoDia.aberto;

    const intervaloMin = config.slotMin;
    const horaAberto = funcionamentoDia?.horaAbertura;

    const horarios = obterHorariosPorFuncionamento(dataSelecionadaISO, config);


    function handleChangeDay(daysToAdd) {
        const novaData = new Date(dataSelecionada);
        novaData.setDate(novaData.getDate() + daysToAdd);
        setDataSelecionada(novaData);
    }

    function handleChangeToToday() {
        setDataSelecionada(new Date());
    }

    let posicaoLinhaHorarioAtual = null;


    if (exibindoHoje && !estabelecimentoFechado && horarioEstaDentroDoFuncionamentoAtual({
        horarioAtual,
        horaAbertura: funcionamentoDia.horaAbertura,
        horaFechamento: funcionamentoDia.horaFechamento
    })) {
        posicaoLinhaHorarioAtual = calcularPosicaoLinhaHorarioAtual({
            horarioAtual,
            horarioAbertura: horaAberto,
            intervaloMin,
            alturaBloco: ALTURA_SLOT
        });
    }

    const agendamentosDoDia = filtrarAgendamentosPorData(agendamentos, dataSelecionadaISO);

    const agendamentoSelecionado = buscarAgendamentoPorId(
        agendamentos,
        agendamentoSelecionadoId
    );

    return (
        <div className="agenda-visual">

            <AgendaDiaHeader
                dataSelecionadaFormatada={dataSelecionadaExibicao}
                onDiaAnterior={() => handleChangeDay(-1)}
                onProximoDia={() => handleChangeDay(1)}
                onHoje={handleChangeToToday}
            />
            <div className="agenda-corpo">
                {estabelecimentoFechado ? (
                    <div className="agenda-empty-state">Fechado</div>
                ) : (
                    <>
                        <div className='grade-horarios'>

                            {horarios.map((horarioAtual) => (
                                <div className='bloco-horario livre' key={horarioAtual}>
                                    <div className='hora'>{horarioAtual}</div>
                                    <div className='conteudo'>

                                    </div>

                                </div>
                            ))}
                        </div>
                        <div className='camada-agendamentos'>
                            {agendamentosDoDia.map((agendamento) => {
                                const estiloAgendamento = calcularEstiloAgendamentoVisual({
                                    agendamento,
                                    servicos: config.servicos,
                                    horarioAbertura: horaAberto,
                                    intervaloMin,
                                    alturaSlot: ALTURA_SLOT
                                })
                                const mostrarConteudo = estiloAgendamento.alturaEmPixels >= 40;
                                return (
                                    <div
                                        key={agendamento.id}
                                        className='agendamento-sobreposto'
                                        style={{
                                            top: estiloAgendamento.top,
                                            height: estiloAgendamento.height
                                        }}
                                    >
                                        <AgendamentoItem
                                            item={agendamento}
                                            onEditar={onEditar}
                                            onCancelar={onCancelar}
                                            onConfirmar={onConfirmar}
                                            modoCompacto={true}
                                            mostrarConteudo={mostrarConteudo}
                                            onClick={() => setAgendamentoSelecionadoId(agendamento.id)}
                                        />

                                    </div>
                                )

                            })}
                        </div>
                    </>
                )}

                {posicaoLinhaHorarioAtual !== null && (
                    <LinhaHorarioAtual posicao={posicaoLinhaHorarioAtual} />
                )}
            </div>
            {agendamentoSelecionado && (
                <AgendamentoModal
                    agendamento={agendamentoSelecionado}
                    onFechar={() => setAgendamentoSelecionadoId(null)}
                    onEditar={onEditar}
                    onCancelar={onCancelar}
                    onConfirmar={onConfirmar}
                />
            )}
        </div>



    );

}

export default AgendaVisual;
