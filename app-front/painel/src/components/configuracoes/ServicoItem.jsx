import { use, useState } from 'react';


function ServicoItem({ servico, onRemoverServico, onAtualizarServico }) {

    const [editando, setEditando] = useState(false);
    const [nome, setNome] = useState(servico.nome);
    const [duracao, setDuracao] = useState(servico.duracao);
    const [preco, setPreco] = useState(servico.preco);

    const handleSalvar = async () => {
        await onAtualizarServico(servico.id, {
            nome,
            duracao: Number(duracao),
            preco: Number(preco)
        });

        setEditando(false)
    };

    if (editando) {
        return (
            <div className='servico-item'>
                <label className='config-field'>
                    <span>Nome</span>
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </label>

                <label className='config-field'>
                    <span>Duração</span>
                    <input
                        type="number"
                        min={5}
                        step={5}
                        value={duracao}
                        onChange={(e) => setDuracao(e.target.value)}
                    />
                </label>

                <label className='config-field'>
                    <span>Preço</span>
                    <input
                        type="number"
                        min={0}
                        step={1}
                        value={preco}
                        onChange={(e) => setPreco(e.target.value)}
                    />
                </label>

                <button className='config-secondary-button' onClick={handleSalvar}>
                    Salvar
                </button>

                <button className='config-danger-button' onClick={() => setEditando(false)}>
                    Cancelar
                </button>
            </div>
        )
    }




    return (
        <div className="servico-item">
            <div>
                <strong>{servico.nome}</strong>
                <p>
                    {servico.duracao} min - €{servico.preco}
                </p>
            </div>

            <button
                className='config-secondary-button'
                onClick={() => setEditando(true)}
            >
                Editar
            </button>

            <button className="config-danger-button"
                onClick={() => onRemoverServico(servico.id)}
            >
                Remover
            </button>

        </div>
    )

}

export default ServicoItem;