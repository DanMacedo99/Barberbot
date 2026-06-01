import './LinhaHorarioAtual.css';

function LinhaHorarioAtual({ posicao }) {
    if (posicao === null) {
        return null; // Não exibe a linha se a posição for nula
    }

    return (
        <div
            className="linha-horario-atual"
            style={{ top: `${posicao}px` }}
        />
    );
}

export default LinhaHorarioAtual;