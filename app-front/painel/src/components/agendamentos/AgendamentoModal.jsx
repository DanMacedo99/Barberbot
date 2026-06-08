import { useState } from "react";
import AgendamentoEditor from "./AgendamentoEditor";
import './AgendamentoModal.css'

function AgendamentoModal({
    agendamento,
    onFechar,
    onEditar,
    onCancelar,
    onConfirmar
}) {
    const [editando, setEditando] = useState(false);

    if (!agendamento) return null;

    const origemNormalizada = agendamento.origem?.toLowerCase();

    const origemLabel = origemNormalizada === 'whatsapp'
        ? 'WhatsApp'
        : 'Painel';

    const origemClasse = origemNormalizada === 'whatsapp'
        ? 'tag-origem whatsapp'
        : 'tag-origem painel';

    function handleSalvarEdicao(id, dadosAtualizados) {
        onEditar(id, dadosAtualizados);
        setEditando(false);
        onFechar;
    }

    function handleCancelarAgendamento() {

        onCancelar(agendamento.id);
        onFechar();
    }

    function handleConfirmarAgendamento() {
        onConfirmar(agendamento.id)
        onFechar();
    }

    function formatarDataParModal(dataISO) {
        if (!dataISO) return 'não informada';
        const [ano, mes, dia] = dataISO.split('-');

        return `${dia}/${mes}/${ano}`
    }

    return (
        <div className='modal-overlay' onClick={onFechar}>
            <div className={`modal-agendamento ${editando ? 'editando' : ''}`} onClick={(e) => e.stopPropagation()}>
                <button className="modal-fechar" onClick={onFechar}>
                    x
                </button>
                {editando ? (
                    <AgendamentoEditor
                        item={agendamento}
                        onConfirmar={handleSalvarEdicao}
                        onCancelar={() => setEditando(false)}
                    />
                ) : (
                    <>
                        <div className="modal-header">
                            <h2>
                                {agendamento.nome}
                            </h2>
                            <span className={origemClasse}>{origemLabel}</span>
                        </div>

                        <div className="modal-info">
                            <p><strong>Serviço:</strong> {agendamento.servico}</p>
                            <p><strong>Telefone:</strong> {agendamento.numero || 'Não informado'}</p>
                            <p><strong>Data:</strong> {formatarDataParModal(agendamento.data)}</p>
                            <p><strong>Horário:</strong> {agendamento.horario}</p>
                            <p><strong>Status:</strong> {agendamento.status}</p>
                        </div>
                        <div className="modal-acoes">
                            {agendamento.status?.toLowerCase() === 'pendente' && (
                                <button className="confirmar" onClick={handleConfirmarAgendamento}>
                                    Confirmar
                                </button>
                            )}

                            <button className="editar" onClick={() => setEditando(true)}>
                                Editar
                            </button>

                            <button className="cancelar" onClick={handleCancelarAgendamento}>
                                Cancelar
                            </button>
                        </div>
                    </>
                )}
            </div>

        </div>
    )
}

export default AgendamentoModal
