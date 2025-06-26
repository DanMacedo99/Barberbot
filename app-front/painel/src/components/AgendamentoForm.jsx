import { useState } from 'react';
import './AgendamentoForm.css'; 

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
        <div className='agendamento-form'>
            <h2>Novo Agendamento</h2>
            <input
                type="text"
                name="nome"
                placeholder="Nome do cliente"
                value={formulario.nome}
                onChange={handleChange}
            />
            <input
                type="text"
                name="servico"
                placeholder="Serviço"
                value={formulario.servico}
                onChange={handleChange}
            />
            <input
                type="time"
                name="horario"
                placeholder="Horário"
                value={formulario.horario}
                onChange={handleChange}         
            />
            <button onClick={handleSubmit}>Criar Agendamento</button> 
        </div>
    );

}

export default AgendamentoForm;