import { API_URL } from '../config/api';
import { createContext, useState, useMemo, useEffect } from 'react';

export const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
    const [config, setConfig] = useState(null);


    useEffect(() => {
        fetch(`${API_URL}/config`)
            .then(res => res.json())
            .then(data => setConfig(data))
            .catch(err => console.error('Erro ao buscar configuração:', err));
    }, []);

    const salvarConfig = async (novaConfig) => {
        try {
            const response = await fetch(`${API_URL}/config`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaConfig)
            });

            const data = await response.json();
            setConfig(data.config);

        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
        }
    };

    const adicionarServico = async (novoServico) => {
        try {
            const response = await fetch(`${API_URL}/config/servicos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoServico)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao adicionar serviço');
            }

            setConfig(data.config);


            return data.servico;

        } catch (error) {
            console.error('Erro ao adicionar serviço:', error);
            throw error;
        }
    };

    const atualizarServico = async (id, servicoAtualizado) => {
        try {
            const response = await fetch(`${API_URL}/config/servicos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(servicoAtualizado)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao atualizar serviço');
            }

            setConfig(data.config);

            return data.servico;
        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            throw error;
        }
    };

    const removerServico = async (id) => {
        try {
            const response = await fetch(`${API_URL}/config/servicos/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao deletar serviço');
            }

            setConfig(data.config);

        } catch (error) {
            console.error('Erro ao deletar serviço:', error);
            throw error;
        }
    };

    const value = useMemo(() => ({
        config,
        setConfig,
        salvarConfig,
        adicionarServico,
        atualizarServico,
        removerServico,
        atualizarServico
    }), [config]);

    return <ConfigContext.Provider value={value}>
        {children}
    </ConfigContext.Provider>;
}


