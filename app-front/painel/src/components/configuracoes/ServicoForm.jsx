import { useState } from 'react';

function ServicoForm({ onAdicionarServico }) {
    const [nome, setNome] = useState('');
    const [duracao, setDuracao] = useState(30);
    const [preco, setPreco] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        await onAdicionarServico({ nome, duracao: Number(duracao), preco: Number(preco) });

        setNome('');
        setDuracao(30);
        setPreco('');
    }

    return (
        <form className="servico-form" onSubmit={handleSubmit}>
            <label className="config-field">
                <span>Nome do serviço</span>
                <input
                    placeholder="nome do serviço"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
            </label>
            <label className="config-field">
                <span>Duração (minutos)</span>
                <input
                    type="number"
                    placeholder="duração do serviço"
                    min={5}
                    step={5}
                    value={duracao}
                    onChange={(e) => setDuracao(e.target.value)}
                />
            </label>
            <label className="config-field">
                <span>Preço</span>
                <input
                    type="number"
                    placeholder="preço"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                />
            </label>

            <button className="config-secondary-button" type="submit">
                Adicionar serviço
            </button>
        </form>
    );
}
export default ServicoForm;