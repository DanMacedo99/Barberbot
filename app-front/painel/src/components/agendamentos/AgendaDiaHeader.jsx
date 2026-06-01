function AgendaDiaHeader({
    dataSelecionadaFormatada,
    onDiaAnterior,
    onProximoDia,
    onHoje
}) {
    return (
        <div className="agenda-header">
            <button onClick={onDiaAnterior}>←</button>

            <button onClick={onHoje}>Hoje</button>

            <button onClick={onProximoDia}>→</button>

            <strong>{dataSelecionadaFormatada}</strong>
        </div>
    );
}

export default AgendaDiaHeader;