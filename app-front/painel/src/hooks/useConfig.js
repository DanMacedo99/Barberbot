import { useContext } from "react";
import { ConfigContext } from "../context/ConfigContext";

export function useConfig() {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error('useConfig deve ser usado dentro de um <ConfigProvider>');
    }
    return context;
}