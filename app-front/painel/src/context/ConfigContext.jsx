import { createContext, useContext, useState, useMemo } from 'react';

const ConfigContext = createContext(null);

const DEFAULT_CONFIG = {
    slotMin: 15,
    funcionamento: {
        1: { aberto: true, horaAbertura: '08:00', horaFechamento: '18:00' },
        2: { aberto: true, horaAbertura: '08:00', horaFechamento: '18:00' },
        3: { aberto: true, horaAbertura: '08:00', horaFechamento: '18:00' },
        4: { aberto: true, horaAbertura: '08:00', horaFechamento: '18:00' },
        5: { aberto: true, horaAbertura: '08:00', horaFechamento: '18:00' },
        6: { aberto: true, horaAbertura: '08:00', horaFechamento: '18:00' },
        0: null,
    },
    servicos: [
        { nome: 'Corte de Cabelo', duracao: 30, preco: 20 },
        { nome: 'Barba', duracao: 20, preco: 15 },
        { nome: 'Corte e Barba', duracao: 45, preco: 30 },
    ],
};

export function ConfigProvider({ children }) {
    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const value = useMemo(() => ({ config, setConfig }), [config]);

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
