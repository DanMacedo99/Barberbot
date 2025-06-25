import { useState } from "react";

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
    <div style={{}}>
        <h3>{item.nome}</h3>
        {editando ? (
          <div>
            <input
                type='text'
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
                value={formulario.horario}
                onChange={(e) =>
                    setFormulario({ 
                        ...formulario, horario: e.target.value 
                    })
                }
                placeholder='Horário'
            />
            <button onClick={salvar}>Salvar</button>
            <button onClick={() => setEditando(false)}>Cancelar</button>
          </div> ) : (
            <>
            <p>Serviço: {item.servico}</p>
            <p>Horário: {item.horario}</p>
            <p>Status: {item.situacao}</p>

            {item.situacao.toLowerCase() === 'pendente' && (
              <button onClick={() => onConfirmar(item.id)}>Confirmar</button>
            )}  
            <button onClick={() => setEditando(true)}>Editar</button>
            <button onClick={() => onCancelar(item.id)}>Cancelar</button>
            </>
          )
        }
    </div>
  );
}

export default AgendamentoItem;