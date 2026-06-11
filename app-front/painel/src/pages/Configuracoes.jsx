import { useState, useEffect } from 'react';
import { useConfig } from '../hooks/useConfig';
import PainelLayout from '../layout/PainelLayout.jsx';
import ServicoForm from '../components/configuracoes/ServicoForm.jsx';
import useToast from '../hooks/useToast.js';
import ListaServicos from '../components/configuracoes/ListaServicos.jsx';
import './Configuracoes.css';

function Configuracoes() {

    const { config, salvarConfig, adicionarServico, removerServico, atualizarServico } = useConfig();
    const { mensagem, exibirMensagem } = useToast();
    const [slotMin, setSlotMin] = useState(15);
    const [funcionamento, setFuncionamento] = useState({});
    const [servicos, setServicos] = useState([]);

    useEffect(() => {
        if (config) {
            setSlotMin(config.slotMin);
            setFuncionamento(config.funcionamento);
            setServicos(config.servicos);
        }
    }, [config]);

    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    const handleSave = async () => {
        try {
            await salvarConfig({ slotMin, funcionamento });
            exibirMensagem("Configurações atualizadas com sucesso");
        } catch (error) {
            console.error('Erro ao salvar configurações:', error)
            exibirMensagem('Erro ao salvar configurações');

            setSlotMin(config.slotMin);
            setFuncionamento(config.funcionamento);
        }
    };

    const handleRemoverServico = async (id) => {

        try {
            await removerServico(id);
            exibirMensagem('Serviço removido com sucesso')
        } catch (error) {
            console.error('Erro ao remover serviço:', error);
            exibirMensagem('Erro ao remover servico.');
        }

    }

    const handleAtualizarServico = async (id, servicoAtualizado) => {

        try {
            await atualizarServico(id, servicoAtualizado);
            exibirMensagem('Serviço atualizado com sucesso')
        } catch (error) {
            console.error('Erro ao atualizar serviço', error)
            exibirMensagem('Erro ao atualizar serviço')
        }
    }

    const atualizaHorarioDia = (indexDia, status, novoHorario) => {
        setFuncionamento((prev) => {

            //copia do estado atual garantindo imutabilidade do original
            const novo = { ...prev };

            //se o dia não tiver configuração(null), inicializa com valores padrão
            if (!novo[indexDia]) novo[indexDia] = { aberto: true, horaAbertura: '09:00', horaFechamento: '18:00' };

            novo[indexDia] = { ...novo[indexDia], [status]: novoHorario };
            return novo;
        });
    };

    const alternarFechado = (dia) => {
        setFuncionamento((prev) => {
            const novo = { ...prev };
            novo[dia] = novo[dia] ? null : { aberto: true, horaAbertura: '08:00', horaFechamento: '18:00' };
            return novo;
        });
    }
    const handleAdicionarServico = async (novoServico) => {
        try {
            await adicionarServico(novoServico);
            exibirMensagem("Serviço adicionado com sucesso");

        } catch (error) {
            console.error('Erro ao adicionar serviço:', error);
            exibirMensagem("Erro ao adicionar serviço");
        }
    }


    const diasAbertos = Object.values(funcionamento || {}).filter(Boolean).length;

    if (!config) {
        return (
            <PainelLayout>

                <div className="configuracoes-container">
                    <p>Carregando configurações...</p>
                </div>
            </PainelLayout>
        );
    }

    return (
        <PainelLayout>
            {mensagem && <div className="toast-message">{mensagem}</div>}

            <div className="configuracoes-container">

                <div className='configuracoes-texto'>

                    <section className="configuracoes-hero">
                        <div>

                            <h2 className='configuracoes-title'>Configurações da empresa</h2>
                            <p>Controle horários, serviços e o intervalo mínimo usado nos agendamentos.</p>
                        </div>

                        <div className="configuracoes-metrics">

                            <div>
                                <span>Serviços</span>
                                <strong>{servicos.length}</strong>
                            </div>

                            <div>
                                <span>Dias abertos</span>
                                <strong>{diasAbertos}</strong>
                            </div>
                        </div>
                    </section>

                    <section className="config-card config-slot-card">
                        <div className="config-card-header">
                            <span className="configuracoes-eyebrow">Agenda</span>
                            <h3>Sua agenda será exibida com espaços de {slotMin} minutos</h3>
                        </div>
                        <label className="config-field config-field-inline">
                            <input
                                type="number"
                                min={5}
                                step={5}
                                value={slotMin}
                                onChange={(e) => setSlotMin(Number(e.target.value))}
                            />
                        </label>
                    </section>

                    <section className="config-card">
                        <div className="config-card-header">
                            <span className="configuracoes-eyebrow">Disponibilidade</span>
                            <h3>Funcionamento</h3>
                        </div>
                        <div className="funcionamento-lista">
                            {dias.map((d, index) => {
                                const conf = funcionamento[index];
                                const fechado = conf === null;

                                return (
                                    <div key={index} className={`funcionamento-dia ${fechado ? 'fechado' : 'aberto'}`} >
                                        <div className="funcionamento-dia-topo">
                                            <strong>{d}</strong>
                                            <span>{fechado ? 'Fechado' : 'Aberto'}</span>
                                        </div>
                                        <label className="config-check">
                                            <input
                                                type="checkbox"
                                                checked={!fechado}
                                                onChange={() => alternarFechado(index)} />
                                            Aberto
                                        </label>
                                        {
                                            !fechado && (
                                                <div className="funcionamento-horarios">
                                                    <label className="config-field">
                                                        <span>Horário de abertura</span>
                                                        <input
                                                            type='time'
                                                            value={conf?.horaAbertura || '09:00'}
                                                            onChange={(e) => atualizaHorarioDia(index, 'horaAbertura', e.target.value)}
                                                        />
                                                    </label>
                                                    <label className="config-field">
                                                        <span>Horário de fechamento</span>
                                                        <input
                                                            type='time'
                                                            value={conf?.horaFechamento || '18:00'}
                                                            onChange={(e) => atualizaHorarioDia(index, 'horaFechamento', e.target.value)}
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                    </div>
                                );
                            })}

                            <button className="config-save-button" onClick={handleSave}>
                                Salvar funcionamento
                            </button>
                        </div>
                    </section>

                    <section className="config-card">
                        <div className="config-card-header config-card-header-actions">
                            <div>
                                <span className="configuracoes-eyebrow">Catalogo</span>
                                <h3>Serviços</h3>
                            </div>
                        </div>

                        <ServicoForm onAdicionarServico={handleAdicionarServico} />

                        <ListaServicos
                            servicos={servicos}
                            onRemoverServico={handleRemoverServico}
                            onAtualizarServico={handleAtualizarServico}
                        />
                    </section>


                </div >

            </div>
        </PainelLayout>


    );

}



export default Configuracoes;
