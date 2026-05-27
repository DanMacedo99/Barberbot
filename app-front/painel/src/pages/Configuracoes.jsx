import { useState } from 'react';
import { useConfig } from '../context/ConfigContext.jsx';
import PainelLayout from '../layout/PainelLayout.jsx';
import './Configuracoes.css';

function Configuracoes() {

    const { config, setConfig } = useConfig();
    const [slotMin, setSlotMin] = useState(config.slotMin);
    const [funcionamento, setFuncionamento] = useState(config.funcionamento);
    const [servicos, setServicos] = useState(config.servicos);

    const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    const handleSave = () => {
        setConfig({ slotMin, funcionamento, servicos });
        alert('Configurações atualizadas!');
    };

    const atualizaHorarioDia = (indexDia, status, novoHorario) => {
        setFuncionamento((prev) => {

            //copia do estado atual garantindo imutabilidade do original
            const novo = { ...prev };

            //se o dia não tiver configuração(null), inicializa com valores padrão
            if (!novo[indexDia]) novo[indexDia] = { abre: '09:00', fecha: '18:00' };

            novo[indexDia] = { ...novo[indexDia], [status]: novoHorario };
            return novo;
        });
    };

    const alternarFechado = (dia) => {
        setFuncionamento((prev) => {
            const novo = { ...prev };
            novo[dia] = novo[dia] ? null : { abre: '08:00', fecha: '18:00' };
            return novo;
        });
    }

    const adicionarServico = () => {
        setServicos((prev) => [...prev, { nome: '', duracao: 30, preco: "" }]);
    }

    const atualizarServico = (indexServico, campo, novoValor) => {
        setServicos((prev) => prev.map((servico, i) => (
            i === indexServico ? { ...servico, [campo]: campo === 'duracao' || campo === 'preco' ? Number(novoValor) : novoValor } : servico
        )))
    };

    const removerServico = (index) => {
        setServicos((prev) => prev.filter((_, idx) => idx !== index));
    }

    const diasAbertos = Object.values(funcionamento || {}).filter(Boolean).length;

    return (
        <PainelLayout>
            <div className="configuracoes-container">

                <div className='configuracoes-texto'>

                    <section className="configuracoes-hero">
                        <div>
                            <span className="configuracoes-eyebrow">Preferências do CRM</span>
                            <h2 className='configuracoes-title'>Configurações da barbearia</h2>
                            <p>Controle horários, serviços e o intervalo mínimo usado nos agendamentos.</p>
                        </div>

                        <div className="configuracoes-metrics">
                            <div>
                                <span>Dias abertos</span>
                                <strong>{diasAbertos}</strong>
                            </div>
                            <div>
                                <span>Serviços</span>
                                <strong>{servicos.length}</strong>
                            </div>
                            <div>
                                <span>Slot</span>
                                <strong>{slotMin}m</strong>
                            </div>
                        </div>
                    </section>

                    <section className="config-card config-slot-card">
                        <div className="config-card-header">
                            <span className="configuracoes-eyebrow">Agenda</span>
                            <h3>Tempo mínimo de agendamento</h3>
                        </div>
                        <label className="config-field config-field-inline">
                            <span>Slot (min)</span>
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
                                                            value={conf?.abre || '09:00'}
                                                            onChange={(e) => atualizaHorarioDia(index, 'abre', e.target.value)}
                                                        />
                                                    </label>
                                                    <label className="config-field">
                                                        <span>Horário de fechamento</span>
                                                        <input
                                                            type='time'
                                                            value={conf?.fecha || '18:00'}
                                                            onChange={(e) => atualizaHorarioDia(index, 'fecha', e.target.value)}
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="config-card">
                        <div className="config-card-header config-card-header-actions">
                            <div>
                                <span className="configuracoes-eyebrow">Catalogo</span>
                                <h3>Serviços</h3>
                            </div>
                            <button className="config-secondary-button" onClick={adicionarServico}>Adicionar serviço</button>
                        </div>
                        <div className="servicos-lista">
                            {servicos.map((servico, index) => (
                                <div
                                    key={index}
                                    className="servico-item"
                                >
                                    <label className="config-field">
                                        <span>Nome</span>
                                        <input
                                            placeholder="Nome do serviço"
                                            value=""
                                            onChange={(e) => atualizarServico(index, 'nome', e.target.value)}
                                        />
                                    </label>
                                    <label className="config-field">
                                        <span>Duração</span>
                                        <input
                                            type="number"
                                            placeholder="Duração (min)"
                                            min={5}
                                            step={5}
                                            value=""
                                            onChange={(e) => atualizarServico(index, 'duracaoMin', e.target.value)}
                                        />
                                    </label>
                                    <label className="config-field">
                                        <span>Preço</span>
                                        <input
                                            type="number"
                                            placeholder="Preço"
                                            min={0}
                                            step={1}
                                            value=""
                                            onChange={(e) => atualizarServico(index, 'preco', e.target.value)}
                                        />
                                    </label>
                                    <button className="config-danger-button" onClick={() => removerServico(index)}>Remover</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <button className="config-save-button" onClick={handleSave}>
                        Salvar Configurações
                    </button>


                </div >

            </div>
        </PainelLayout>


    );

}



export default Configuracoes;
