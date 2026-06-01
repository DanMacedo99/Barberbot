import './AgendaVisual.css';
import AgendamentoItem from './AgendamentoItem';
import AgendaDiaHeader from './AgendaDiaHeader';
import LinhaHorarioAtual from './LinhaHorarioAtual';
import { useConfig } from '../../context/ConfigContext';
import { useState, useEffect } from 'react';
import {
    formatarDataLocal,
    gerarHorarios,
    calcularPosicaoLinhaHorarioAtual,
    encontrarServicoDoAgendamento,
    calcularBlocosNecessarios
} from '../../utils/agendaUtils';


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



    const horarios = estabelecimentoFechado ? [] : gerarHorarios(horaAberto, horaFechado, intervaloMin);
    const horariosOcupados = new Set();

    let posicaoLinhaHorarioAtual = null;


    if (exibindoHoje && !estabelecimentoFechado) {
        posicaoLinhaHorarioAtual = calcularPosicaoLinhaHorarioAtual({
            horarioAtual,
            horarioAbertura: horaAberto,
            intervaloMin,
            alturaBloco: 66
        });
    }

    return (
        <div className="agenda-visual">
            <AgendaDiaHeader
                dataSelecionadaFormatada={dataSelecionadaFormatada}
                onDiaAnterior={() => handleChangeDay(-1)}
                onProximoDia={() => handleChangeDay(1)}
                onHoje={handleChangeToToday}
            />
            <div className="agenda-corpo">
                {posicaoLinhaHorarioAtual !== null && (
                    <LinhaHorarioAtual posicao={posicaoLinhaHorarioAtual} />
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

                        const servicoConfig = encontrarServicoDoAgendamento(agendamento, config.servicos);
                        const blocosNecessarios = calcularBlocosNecessarios(servicoConfig, intervaloMin);

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
