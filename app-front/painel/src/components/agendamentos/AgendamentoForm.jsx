import { useConfig } from '../../hooks/useConfig';
import { useState } from 'react';
import { obterHorariosPorFuncionamento } from '../../utils/obterHorariosPorFuncionamento';
import useToast from '../../hooks/useToast';
import './AgendamentoForm.css';

function AgendamentoForm({ onCriar }) {

    const hoje = new Date().toISOString().split('T')[0];
    const { config } = useConfig();
    const servicos = config?.servicos || [];
    const { mensagem, exibirMensagem } = useToast()
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [formulario, setFormulario] = useState({
        nome: '',
        servico: '',
        data: '',
        horario: '',
    });




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormulario((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const { nome, servico, data, horario } = formulario;
        if (!nome || !servico || !data || !horario) {
            exibirMensagem('Preencha todos os campos!');
            return;
        }


        const dataSelecionada = new Date(data);
        const diaSemana = dataSelecionada.getDay();
        const funcionamentoDia = config.funcionamento[diaSemana];

        if (data < hoje) {
            exibirMensagem('Data inválida. não é possivel agendar no passado.');
            return;
        }

        if (!funcionamentoDia?.aberto) {
            exibirMensagem("Esse dia da semana não está disponível para agendamentos.");
            return;
        }

        onCriar({
            ...formulario,
            servicoId: Number(formulario.servico),
            status: 'pendente'
        });

        setFormulario({
            nome: '',
            servico: '',
            data: '',
            horario: ''
        });

        setHorariosDisponiveis([]);

    };

    return (
        <div className='agendamento-form'>
            <h2>Novo Agendamento</h2>
            {mensagem && <p className='toast-message'>{mensagem}</p>}
            <input
                type="text"
                name="nome"
                placeholder="Nome do cliente"
                value={formulario.nome}
                onChange={handleChange}
            />
            <select
                name="servico"
                value={formulario.servico}
                onChange={handleChange}
            >
                <option value="">Selecione um serviço</option>
                {servicos.map((servico) => (
                    <option key={servico.id} value={servico.id}>
                        {servico.nome} - {servico.duracao} min - R$ {servico.preco}
                    </option>
                ))}
            </select>
            <input
                type="date"
                name="data"
                placeholder="Data"
                value={formulario.data}
                min={hoje}
                onChange={(e) => {

                    const valor = e.target.value;

                    if (!valor) {
                        e.target.setCustomValidity("");
                        setHorariosDisponiveis([]);
                        handleChange(e);
                        return;
                    }


                    const dataSelecionada = new Date(valor);
                    const diaSemana = dataSelecionada.getDay();
                    const funcionamentoDia = config.funcionamento[diaSemana];
                    const diaHoje = new Date();
                    diaHoje.setHours(0, 0, 0, 0);


                    if (dataSelecionada < diaHoje) {
                        e.target.setCustomValidity('Data inválida. Escolha a partir de hoje.');
                        setHorariosDisponiveis([]);
                    } else if (!funcionamentoDia?.aberto) {
                        exibirMensagem('O estabelecimento está fechado nesse dia. Escolha outra data.');
                        setHorariosDisponiveis([]);
                        return;
                    } else {
                        e.target.setCustomValidity('');
                        const novosHorarios = obterHorariosPorFuncionamento(valor, config);
                        setHorariosDisponiveis(novosHorarios);
                    }

                    handleChange(e);
                }}
            />
            <select
                name="horario"
                value={formulario.horario}
                onChange={handleChange}
            >
                <option value="">Selecione um horário</option>
                {horariosDisponiveis.map((horario, index) => (
                    <option key={index} value={horario}>
                        {horario}
                    </option>
                ))}
            </select>
            <button onClick={handleSubmit}>Criar Agendamento</button>
        </div>
    );

}

export default AgendamentoForm;