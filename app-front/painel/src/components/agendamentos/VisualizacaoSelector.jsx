import './visualizacaoSelector.css';

function VisualizacaoSelector({ modoAtual, aoMudarModo }) {

    return (
        <div className="visualizacao-selector">
            <button
                className={modoAtual === 'lista' ? 'ativo' : ''}
                onClick={() => aoMudarModo('lista')}
            >
                Lista
            </button>
            <button
                className={modoAtual === 'calendario' ? 'ativo' : ''}
                onClick={() => aoMudarModo('calendario')}
            >
                Agenda Visual

            </button>
        </div>
    );
}

export default VisualizacaoSelector;