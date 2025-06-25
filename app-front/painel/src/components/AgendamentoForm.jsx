import { useState } from 'react';

function AgendamentoForm({ onCriar }) {
    const [formulario, setFormulario] = useState({
        nome: '',
        servico: '',
        horario: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const { nome, servico, horario } = formulario;
        if (!nome || !servico || !horario) {
            alert('Preencha todos os campos!');
            return;
        }  

        onCriar({
            ...formulario, situacao: 'pendente'
        });

        setFormulario({
            nome: '',
            servico: '',
            horario: ''
        });

    };

    return(
        <div style={{
            backgroundColor: '#75233D',
            padding: '20px 20px 20px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            color: '#fff'
        }}>
            <h2
                style={{
                    marginBottom: '16px',
                    textAlign: 'center',
                }}
            >Novo Agendamento</h2>
            <input
                type="text"
                style= {{
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    width: '95%',
                    maxWidth: '800px',
                    fontSize: '16px'
                }}
                name="nome"
                placeholder="Nome do cliente"
                value={formulario.nome}
                onChange={handleChange}
            />
            <input
                type="text"
                style= {{
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    width: '95%',
                    maxWidth: '800px',
                    fontSize: '16px'
                }}
                name="servico"
                placeholder="Serviço"
                value={formulario.servico}
                onChange={handleChange}
            />
            <input
                type="time"
                style= {{
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    width: '95%',
                    maxWidth: '800px',
                    fontSize: '16px'
                }}
                name="horario"
                placeholder="Horário"
                value={formulario.horario}
                onChange={handleChange}         
            />
            <button onClick={handleSubmit}
                style={{
                    backgroundColor: '#f0b96b',
                    color: '#4b1623',
                    fontWeight: 'bold',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                }}
            
            >Criar Agendamento</button> 
        </div>
    );

}

export default AgendamentoForm;