import { useState } from 'react';

function useToast() {
    const [toast, setToast] = useState("");

    const exibirToast = (mensagem) => {
        setToast(mensagem);
        setTimeout(() => {
            setToast("");
        }, 3000);
    }
    return {
        mensagem: toast,
        exibirMensagem: exibirToast
    };
}

export default useToast;