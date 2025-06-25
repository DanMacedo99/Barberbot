import { useState, useEffect } from 'react'
import AgendamentoItem from './components/AgendamentoItem';
import AgendamentoForm from './components/AgendamentoForm';




function App() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagem, setMensagem] = useState('');
 


  const criarAgendamento = (agendamento) => {
   
    fetch('http://localhost:3000/agendamentos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agendamento),
    })
    .then((res) => res.json())
    .then((dados) => {
      setAgendamentos((prev) => [...prev, dados.agendamento]);
      exibirMensagem(dados.message);
    })
    .catch((err) => {
      console.error('Erro ao criar agendamento:', err);
      })
  
  }

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

  const editarAgendamento = (id, dadosAtualizados) => {
    fetch(`http://localhost:3000/agendamentos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dadosAtualizados),
    })
    .then((res) => res.json())
    .then((dados) => {
      setAgendamentos((prev) =>
        prev.map((item) => (item.id === id ? dados.agendamento : item))
      );
      exibirMensagem(dados.message);
    })
    .catch((err) => {
      console.error('Erro ao editar agendamento:', err);
      exibirMensagem('Erro ao editar agendamento. Tente novamente.');
    });
  } 

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

      <div style={{ marginBottom: '20px' }}>
        <AgendamentoForm 
          onCriar={criarAgendamento}
        />
      </div>

      {agendamentos.length === 0 ? (
        <p> Carregando agendamentos...</p>
      ) : (
        agendamentos.map((item) => (
            <AgendamentoItem
              key={item.id}
              item={item}
              onEditar={editarAgendamento}
              onCancelar={cancelarAgendamento}
              onConfirmar={confirmarAgendamento}
            />  
        ))
      )}
    </div>
  )
}

export default App
