import { useState } from 'react';
import { useConfig } from '../context/ConfigContext.jsx';
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

    const atualizaHorarioDia = (dia, campo, valor) => {
        setFuncionamento((prev) => {
            const novo = { ...prev };
            if (!novo[dia]) novo[dia] = { abre: '09:00', fecha: '18:00' };
            novo[dia] = { ...novo[dia], [campo]: valor };
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
        setServicos((prev) => [...prev, { nome: '', duracao: 30, preco: 0 }]);
    }

    const atualizarServico = (index, campo, valor) => {
        setServicos((prev) => prev.map((servico, idx) => (
            idx === index ? { ...servico, [campo]: campo === 'duracaoMin' || campo === 'preco' ? Number(valor) : valor } : servico
        )))
    };

    const removerServico = (index) => {
        setServicos((prev) => prev.filter((_, idx) => idx !== index));
    }


    return (
        <div className="configuracoes-container"    >
            <div className='configuracoes-texto'>
                <h2 className='configuracoes-title'>Configurações da barbearia</h2>

                <section style={{}}>
                    <h3>Tempo mínimo de agendamento</h3>
                    <label>
                        Slot (min):
                        <input
                            type="number"
                            min={5}
                            step={5}
                            value={slotMin}
                            onChange={(e) => setSlotMin(Number(e.target.value))}
                        />
                    </label>
                </section>

                <section style={{}}>
                    <h3>Funcionamento</h3>
                    {dias.map((d, index) => {
                        const conf = funcionamento[index];
                        const fechado = conf === null;

                        return (
                            <div key={index} style={{}} >
                                <strong style={{}}>{d}</strong>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={!fechado}
                                        onChange={() => alternarFechado(index)} />
                                    Aberto
                                </label>
                                {
                                    !fechado && (
                                        <>
                                            <label>
                                                Horário de abertura:
                                                <input
                                                    type='time'
                                                    value={conf?.abre || '09:00'}
                                                    onChange={(e) => atualizaHorarioDia(index, 'abre', e.target.value)}
                                                />
                                            </label>
                                            <label>
                                                Horário de fechamento:
                                                <input
                                                    type='time'
                                                    value={conf?.fecha || '18:00'}
                                                    onChange={(e) => atualizaHorarioDia(index, 'fecha', e.target.value)}
                                                />
                                            </label>
                                        </>
                                    )}
                            </div>
                        );
                    })}
                </section>




                <section style={{}}>
                    <h3>Serviços</h3>
                    {servicos.map((servico, index) => (
                        <div
                            key={index}
                            style={{}}
                        >
                            <input
                                placeholder="Nome do serviço"
                                value={servico.value}
                                onChange={(e) => atualizarServico(index, 'nome', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Duração (min)"
                                min={5}
                                step={5}
                                value={servico.duracaoMin}
                                onChange={(e) => atualizarServico(index, 'duracaoMin', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Preço"
                                min={0}
                                step={1}
                                value={servico.preco}
                                onChange={(e) => atualizarServico(index, 'preco', e.target.value)}
                            />
                            <button onClick={() => removerServico(index)}>Remover</button>
                        </div>
                    ))}
                    <button onClick={adicionarServico}>Adicionar serviço</button>
                </section>

                <button onClick={handleSave} style={{}}>
                    Salvar Configurações
                </button>


            </div >
        </div>



    );

}



export default Configuracoes;