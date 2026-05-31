import './ListaAgendamentos.css';
import { useState } from 'react';
import AgendamentoEditor from './AgendamentoEditor';


function ListaAgendamentos({ agendamentos, onEditar, onCancelar, onConfirmar }) {
    const [editandoId, setEditandoId] = useState(null);

    function obterDataHoraDoAgendamento(agendamento) {
        return new Date(`${agendamento.data}T${agendamento.horario}:00`);
    }

    const agendamentosOrdenados = [...agendamentos].sort((a, b) => {
        const dataHoraA = obterDataHoraDoAgendamento(a);
        const dataHoraB = obterDataHoraDoAgendamento(b);
        return dataHoraA - dataHoraB;
    })

    return (
        <div className="lista-agendamentos">
            <table>
                <thead>
                    <tr>
                        <th>Horário</th>
                        <th>Cliente</th>
                        <th>Serviço</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {agendamentosOrdenados.map((item) => (
                        <tr key={item.id}>
                            {editandoId === item.id ? (
                                <td colSpan="5">
                                    <AgendamentoEditor
                                        item={item}
                                        onConfirmar={(id, dados) => {
                                            onEditar(id, dados);
                                            setEditandoId(null);
                                        }}
                                        onCancelar={() => setEditandoId(null)}
                                    />
                                </td>
                            ) : (
                                <>
                                    <td className="lista-horario">{item.horario}</td>
                                    <td className="lista-cliente">{item.nome}</td>
                                    <td>{item.servico}</td>
                                    <td>
                                        <span className={`status-badge status-${item.status?.toLowerCase()}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="lista-acoes">
                                        <button className="acao-editar" onClick={() => setEditandoId(item.id)}>Editar</button>
                                        <button className="acao-cancelar" onClick={() => onCancelar(item.id)}>Cancelar</button>

                                        {item.status === 'pendente' && (
                                            <button className="acao-confirmar" onClick={() => onConfirmar(item.id)}>Confirmar</button>
                                        )}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListaAgendamentos;
