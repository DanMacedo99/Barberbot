import { useState } from 'react';
import './AgendamentoEditor.css';

function AgendamentoEditor({ item, onConfirmar, onCancelar }) {
    const [formulario, setFormulario] = useState({
        nome: item.nome,
        servico: item.servico,
        horario: item.horario

    });

    const salvar = () => {
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
                type='text'
                value={formulario.servico}
                onChange={(e) =>
                    setFormulario({ ...formulario, servico: e.target.value })
                }
                placeholder='Serviço'
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