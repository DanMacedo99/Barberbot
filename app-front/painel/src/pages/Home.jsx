import { useState } from 'react';
import PainelLayout from '../layout/PainelLayout';
import useAgendamentos from '../hooks/useAgendamentos';
import AgendamentoForm from '../components/agendamentos/AgendamentoForm';
import VisualizacaoSelector from '../components/agendamentos/VisualizacaoSelector';
import ListaAgendamentos from '../components/agendamentos/ListaAgendamentos';
import AgendaVisual from '../components/agendamentos/AgendaVisual';


function Home() {
    const [modo, setModo] = useState('lista'); // 'lista' ou 'agenda'
    const {
        agendamentos,
        mensagem,
        criarAgendamento,
        confirmarAgendamento,
        editarAgendamento,
        cancelarAgendamento
    } = useAgendamentos();

    const totalAgendamentos = agendamentos.length;
    const pendentes = agendamentos.filter((item) => item.status === 'pendente').length;
    const confirmados = agendamentos.filter((item) => item.status === 'confirmado').length;

    return (
        <PainelLayout>

            {mensagem && <div className="toast-message">{mensagem}</div>}

            <section className="crm-hero">
                <div>
                    <span className="crm-eyebrow">CRM de agendamentos</span>
                    <h1 className="app-title">Painel do Barbeiro</h1>
                    <p className="crm-subtitle">Acompanhe clientes, horarios e status do dia em um painel simples.</p>
                </div>

                <div className="crm-metrics" aria-label="Resumo dos agendamentos">
                    <div className="crm-metric">
                        <span>Total</span>
                        <strong>{totalAgendamentos}</strong>
                    </div>
                    <div className="crm-metric">
                        <span>Pendentes</span>
                        <strong>{pendentes}</strong>
                    </div>
                    <div className="crm-metric">
                        <span>Confirmados</span>
                        <strong>{confirmados}</strong>
                    </div>
                </div>
            </section>

            <section className="crm-grid">
                <aside className="crm-panel crm-panel-form">
                    <AgendamentoForm onCriar={criarAgendamento} />
                </aside>

                <section className="crm-panel crm-panel-main">
                    <div className="crm-panel-header">
                        <div>
                            <span className="crm-section-label">Operacao</span>
                            <h2>Agenda de clientes</h2>
                        </div>
                        <VisualizacaoSelector modoAtual={modo} aoMudarModo={setModo} />
                    </div>

                    {modo === 'lista' ? (
                        <ListaAgendamentos
                            agendamentos={agendamentos}
                            onEditar={editarAgendamento}
                            onCancelar={cancelarAgendamento}
                            onConfirmar={confirmarAgendamento}
                        />
                    ) : (
                        <AgendaVisual
                            agendamentos={agendamentos}
                            onEditar={editarAgendamento}
                            onCancelar={cancelarAgendamento}
                            onConfirmar={confirmarAgendamento}
                        />
                    )}
                </section>
            </section>
        </PainelLayout >
    );
}

export default Home;
