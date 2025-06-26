import { useState } from "react";
import './AgendamentoItem.css';

function AgendamentoItem({ item, onEditar, onCancelar, onConfirmar }) {

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
        <div>
          <input
            type='text'
            style={{
              padding: '8px',
              marginBottom: '10px',
              borderRadius: '8px',
              border: 'none',
              width: '95%',
              maxWidth: '800px',
              fontSize: '14px'
            }}
            value={formulario.nome}
            onChange={(e) =>
              setFormulario({
                ...formulario, nome: e.target.value
              })
            }
            placeholder='Nome do cliente'
          />
          <input
            type='text'
            style={{
              padding: '8px',
              marginBottom: '10px',
              borderRadius: '8px',
              border: 'none',
              width: '95%',
              maxWidth: '800px',
              fontSize: '14px'
            }}
            value={formulario.servico}
            onChange={(e) =>
              setFormulario({
                ...formulario, servico: e.target.value
              })
            }
            placeholder='Serviço'
          />
          <input
            type='time'
            style={{
              padding: '8px',
              marginBottom: '10px',
              borderRadius: '8px',
              border: 'none',
              width: '95%',
              maxWidth: '800px',
              fontSize: '14px'
            }}
            value={formulario.horario}
            onChange={(e) =>
              setFormulario({
                ...formulario, horario: e.target.value
              })
            }
            placeholder='Horário'
          />

          <button
            className="confirmar"
            onClick={salvar}
          >Salvar</button>

          <button
            className="cancelar"
            onClick={() => setEditando(false)}
          >Cancelar</button>

        </div>) : (
        <>
          <p>Serviço: {item.servico}</p>
          <p>Horário: {item.horario}</p>
          <p>Status: {item.situacao}</p>

          {item.situacao.toLowerCase() === 'pendente' && (
            <button
              className="confirmar"
              onClick={() => onConfirmar(item.id)}
            >Confirmar</button>
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