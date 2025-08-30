import { useState } from "react";
import './AgendamentoItem.css';
import AgendamentoEditor from './AgendamentoEditor';

function AgendamentoItem({ item, onEditar, onCancelar, onConfirmar }) {

  if (!item) return null;

  const [editando, setEditando] = useState(false);
  const [formulario, setFormulario] = useState({
    servico: item.servico,
    horario: item.horario,
    nome: item.nome
  });

  const salvar = () => {
    onEditar(item.id, formulario);
    setEditando(false);
  }

  return (
    <div className="agendamento-item">
      <h3>{item.nome}</h3>
      {editando ? (
        <AgendamentoEditor
          item={item}
          onConfirmar={(id, dados) => {
            onEditar(id, dados);
            setEditando(false);
          }}
          onCancelar={() => setEditando(false)}
        />

      ) : (
        <>
          <p>Serviço: {item.servico}</p>
          <p>Horário: {item.horario}</p>
          <p>Status: {item.status}</p>

          {item.status.toLowerCase() === 'pendente' && (
            <button
              className="confirmar"
              onClick={() => onConfirmar(item.id)}
            >Confirmar
            </button>
          )}

          <button
            onClick={() => setEditando(true)}
            className="editar"
          >Editar</button>

          <button
            className="cancelar"
            onClick={() => onCancelar(item.id)}
          >Cancelar</button>
        </>
      )
      }
    </div>
  );
}

export default AgendamentoItem;