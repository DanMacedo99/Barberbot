import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client';
import AgendamentoItem from './components/AgendamentoItem';
import AgendamentoForm from './components/AgendamentoForm';
import './App.css';




function App() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [mensagem, setMensagem] = useState('');

  const criouViaPainel = useRef(false);

  const criarAgendamento = (agendamento) => {

    const agendamentoComStatus = {
      ...agendamento,
      status: 'pendente'
    }

    fetch('http://localhost:3000/agendamentos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(agendamentoComStatus),
    })
      .then((res) => res.json())
      .then((dados) => {
        console.log('Agendamento criado pelo painel:', dados.agendamento);

        criouViaPainel.current = true;

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
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      console.log('Conectado ao socket.io-client', socket.id);
    })

    socket.on('agendamento-criado', (novoAgendamento) => {
      console.log('Novo agendamento recebido via socket:', novoAgendamento);

      setAgendamentos((prev) => {
        const jaExiste = prev.some((item) => item.id === novoAgendamento.id);
        if (jaExiste) {
          console.log('Agendamento já existe, não adicionando novamente.');

          return prev;
        }

        console.log('novo, adicionando agendamento')
        return [...prev, novoAgendamento];

      })

      if (criouViaPainel.current) {
        exibirMensagem('Agendamento criado com sucesso!');
        criouViaPainel.current = false;
        return;
      }

      exibirMensagem('Novo agendamento recebido em tempo real!');
    });

    return () => {
      socket.disconnect();
      console.log('Desconectado do socket.io-client');
    }
  }, []);

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

  const cancelarAgendamento = (id) => {
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
      status: 'confirmado',
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
    <div
      className='app-container'
    >
      <div >

        {mensagem && (
          <div className='toast-message'>
            {mensagem}
          </div>
        )}

        <h1 className='app-title'
        >Painel do Barbeiro</h1>

        <div >
          <AgendamentoForm
            onCriar={criarAgendamento}
          />
        </div>

        <h1 className='app-title'>Agendados</h1>

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
    </div>
  )
}

export default App
