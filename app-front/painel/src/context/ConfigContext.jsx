import { createContext, useContext, useState, useMemo, useEffect } from 'react';

const ConfigContext = createContext(null);



export function ConfigProvider({ children }) {
    const [config, setConfig] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/config')
            .then(res => res.json())
            .then(data => setConfig(data))
            .catch(err => console.error('Erro ao buscar configuração:', err));
    }, []);

    const salvarConfig = async (novaConfig) => {
        try {
            const response = await fetch('http://localhost:3000/config', {
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

    const value = useMemo(() => ({ config, setConfig, salvarConfig }), [config]);

    return <ConfigContext.Provider value={value}>
        {children}
    </ConfigContext.Provider>;
}

export function useConfig() {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig deve ser usado dentro de <ConfigProvider>');

    }
    return context;
}
