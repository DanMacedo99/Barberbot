import { useState, useEffect } from 'react'


function App() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagem, setMensagem] = useState('');

  const exibirMensagem = (texto) => {
    setMensagem(texto);
    setTimeout(() => {
      setMensagem('');
    }, 3000);
  }

  useEffect(() => {
    fetch('http://localhost:3000/agendamentos')
      .then((res) => res.json())
      .then((dados) => {
        setAgendamentos(dados);
      })
      .catch((err) => {
        console.error('Erro ao buscar agendamentos:', err);
      });
  
  }, [])

  const cancelarAgendamento =(id) => {
    fetch(`http://localhost:3000/agendamentos/${id}`, {
      method: 'DELETE',
    })
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
       console.error('Erro ao cancelar agendamento:');  
      }
    })
    .then((dados) => {
      setAgendamentos((prev) => prev.filter((item) => item.id !== id));
      exibirMensagem(dados.message);
    })
    .catch((err) => {
      console.error('Erro ao cancelar agendamento:', err);
    });
    
  }

  const confirmarAgendamento = (id) => {

    const agendamento = agendamentos.find((item) => item.id === id);

    if (!agendamento) return;

    const agendamentoAtualizado = {
      ...agendamento,
      situacao: 'confirmado',
    };

    fetch(`http://localhost:3000/agendamentos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agendamentoAtualizado),
    })
    .then((res) => res.json())
    .then((dados) => {
      setAgendamentos((prev) =>
        prev.map((item) => (item.id === id ? dados.agendamento : item))
      );
      exibirMensagem(dados.message);
    })
     
    .catch((err) => console.error('Erro ao confirmar agendamento:', err));
    
  };

  return (
    <div>
      {mensagem && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '16px',
          textAlign: 'center',
          fontWeight: 'bold',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {mensagem}
        </div>
      )}

      <h1>Painel do barbeiro</h1>
      {agendamentos.length === 0 ? (
        <p> Carregando agendamentos...</p>
      ) : (
        agendamentos.map((item) => (
          <div key={item.id}>
          
            <h3>{item.nome}</h3>
            
            <p>Serviço: {item.servico}</p>
            <p>Horário: {item.horario}</p>
            <p>Status: {item.situacao}</p>
            
            {item.situacao.toLowerCase() === 'pendente' && (
              <button 
                onClick={() => confirmarAgendamento(item.id)}>
                  Confirmar
              </button>
            )}

            <button 
              onClick={() => cancelarAgendamento(item.id)}>
                Cancelar
            </button>
            
            <hr />
          
          </div>
        ))
      )}

      
    </div>
  )
}

export default App
