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
    encontrarServicoDoAgendamento,
    calcularBlocosNecessarios
} from '../../utils/agendaUtils';


function AgendaVisual({ agendamentos, onEditar, onCancelar, onConfirmar }) {
    const { config } = useConfig();
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [horarioAtual, setHorarioAtual] = useState(new Date());
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
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

    function converterHorarioParaMinutos(horario) {
        const [horas, minutos] = horario.split(':').map(Number);
        return horas * 60 + minutos;
    }

    function calcularEstiloAgendamento(agendamento) {
        const servicoConfig = encontrarServicoDoAgendamento(agendamento, config.servicos);
        const duracaoServico = servicoConfig?.duracao || intervaloMin;

        const minutosAbertura = converterHorarioParaMinutos(horaAberto)
        const minutosAgendamento = converterHorarioParaMinutos(agendamento.horario)

        const minutosDesdeAbertura = minutosAgendamento - minutosAbertura;

        const top = (minutosDesdeAbertura / intervaloMin) * ALTURA_SLOT;
        const height = (duracaoServico / intervaloMin) * ALTURA_SLOT;

        return {
            top: `${top}px`,
            height: `${height}px`,
            alturaEmPixels: height
        }
    }

    function handleChangeDay(daysToAdd) {
        const novaData = new Date(dataSelecionada);
        novaData.setDate(novaData.getDate() + daysToAdd);
        setDataSelecionada(novaData);
    }

    function handleChangeToToday() {
        setDataSelecionada(new Date());
    }

    let posicaoLinhaHorarioAtual = null;


    if (exibindoHoje && !estabelecimentoFechado) {
        posicaoLinhaHorarioAtual = calcularPosicaoLinhaHorarioAtual({
            horarioAtual,
            horarioAbertura: horaAberto,
            intervaloMin,
            alturaBloco: ALTURA_SLOT
        });
    }

    const agendamentosDoDia = agendamentos.filter((agendamentoAtual) => {
        return agendamentoAtual.data === dataSelecionadaISO;
    })

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
                                const estiloAgendamento = calcularEstiloAgendamento(agendamento)
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
                                            onClick={() => setAgendamentoSelecionado(agendamento)}
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
                    onFechar={() => setAgendamentoSelecionado(null)}
                    onEditar={onEditar}
                    onCancelar={onCancelar}
                    onConfirmar={onConfirmar}
                />
            )}
        </div>



    );

}

export default AgendaVisual;
