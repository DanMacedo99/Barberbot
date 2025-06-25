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
    <div style={{
      backgroundColor: '#4b1623',
      border: '1px solid #75233d',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.5)',

    }}>
        <h3>{item.nome}</h3>
        {editando ? (
          <div>
            <input
                type='text'
                style= {{
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
                style= {{
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
                style= {{
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

            <button onClick={salvar}
              style={{
                marginTop: '8px',
                marginRight: '8px',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: '#120a8f',
                color: '#fff'
              }}
            >Salvar</button>

            <button onClick={() => setEditando(false)}
               style={{
                marginTop: '8px',
                marginRight: '8px',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: '#8b0000',
                color: '#fff'
              }}  
              
            >Cancelar</button>
          </div> ) : (
            <>
            <p>Serviço: {item.servico}</p>
            <p>Horário: {item.horario}</p>
            <p>Status: {item.situacao}</p>

            {item.situacao.toLowerCase() === 'pendente' && (
              <button onClick={() => onConfirmar(item.id)}
                style={{
                  marginRight: '8px',
                  padding: '6px 12px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  backgroundColor: '#006400',
                  color: '#fff'
                }}

              >Confirmar</button>
            )}  
            <button onClick={() => setEditando(true)}
               style={{
                marginRight: '8px',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: 'black',
                color: '#fff'
              }}
            >Editar</button>
            <button onClick={() => onCancelar(item.id)}
               style={{
                marginRight: '8px',
                padding: '6px 12px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: '#8b0000',
                color: '#fff'
              }}
            
            
            >Cancelar</button>
            </>
          )
        }
    </div>
  );
}

export default AgendamentoItem;