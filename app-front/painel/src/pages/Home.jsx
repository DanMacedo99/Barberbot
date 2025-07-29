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

    return (
        <PainelLayout>

            {mensagem && <div className="toast-message">{mensagem}</div>}

            <h1 className="app-title">Painel do Barbeiro</h1>

            <AgendamentoForm onCriar={criarAgendamento} />

            <VisualizacaoSelector modoAtual={modo} aoMudarModo={setModo} />

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
        </PainelLayout >
    );
}

export default Home;
