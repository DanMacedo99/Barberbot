import { useState } from 'react';
import { useConfig } from '../../hooks/useConfig';
import './AgendamentoEditor.css';

function AgendamentoEditor({ item, onConfirmar, onCancelar }) {
    const [formulario, setFormulario] = useState({
        nome: item.nome || "",
        numero: item.numero || "",
        servicoId: item.servicoId || "",
        data: item.data || "",
        horario: item.horario || ""

    });
    const { config } = useConfig();
    const servicos = config?.servicos || [];

    const salvar = () => {
        console.log('Dados enviados', formulario)
        onConfirmar(item.id, formulario);
    };

    return (
        <div className="agendamento-editor">
            <h3>Editar Agendamento</h3>
            <input
                type='text'
                value={formulario.nome}
                onChange={(e) =>
                    setFormulario({ ...formulario, nome: e.target.value })
                }
                placeholder='Nome do cliente'
            />
            <input
                type='tel'
                value={formulario.numero}
                onChange={(e) =>
                    setFormulario({ ...formulario, numero: e.target.value })
                }
                placeholder='Telefone do cliente'
            />


            <select
                name="servicoId"
                value={formulario.servicoId}
                onChange={(e) => setFormulario({ ...formulario, servicoId: Number(e.target.value) })}
            >
                <option value="">Selecione um serviço</option>
                {servicos.map((servico) => (
                    <option key={servico.id} value={servico.id}>
                        {servico.nome} - {servico.duracao} min - €{servico.preco}
                    </option>
                ))}
            </select>

            <input
                type="date"
                value={formulario.data}
                onChange={(e) => setFormulario({ ...formulario, data: e.target.value })}

            />

            <input
                type='time'
                value={formulario.horario}
                onChange={(e) =>
                    setFormulario({ ...formulario, horario: e.target.value })
                }
                placeholder='Horário'
            />

            <button className="confirmar" onClick={salvar}>Salvar</button>
            <button className="cancelar" onClick={() => onCancelar(item.id)}>Cancelar</button>
        </div>
    );
}

export default AgendamentoEditor;