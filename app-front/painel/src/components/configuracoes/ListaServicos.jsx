import ServicoItem from "./ServicoItem";

function ListaServicos({ servicos, onRemoverServico, onAtualizarServico }) {
    if (!servicos || servicos.length === 0) {
        return (
            <div className="servico-lista">
                <p>Nenhum serviço cadastrado</p>
            </div>
        );
    }

    return (
        <div className="servico-lista">
            {servicos.map((servico) => (
                <ServicoItem
                    key={servico.id}
                    servico={servico}
                    onRemoverServico={onRemoverServico}
                    onAtualizarServico={onAtualizarServico}
                />
            ))}
        </div>
    );
}

export default ListaServicos;   