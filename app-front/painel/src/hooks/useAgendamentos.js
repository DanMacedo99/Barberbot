import { useState, useRef, useEffect } from "react";

import { io } from "socket.io-client";

function useAgendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [mensagem, setMensagem] = useState("");
    const criouViaPainel = useRef(false);

    const exibirMensagem = (texto) => {
        setMensagem(texto);
        setTimeout(() => {
            setMensagem("");
        }, 3000);
    }

    const criarAgendamento = (agendamento) => {
        const agendamentoComStatus = { ...agendamento, status: "pendente" };

        fetch("http://localhost:3000/agendamentos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(agendamentoComStatus),
        })
            .then((res) => res.json())
            .then((dados) => {
                console.log("Agendamento criado pelo painel:", dados.agendamento);
                criouViaPainel.current = true;
                exibirMensagem(dados.message);
            })
            .catch((err) => {
                console.error("Erro ao criar agendamento:", err);
            });

    }

    const confirmarAgendamento = (id) => {
        const agendamento = agendamentos.find((item) => item.id === id);
        if (!agendamento) return;

        const atualizado = { ...agendamento, status: "confirmado" };

        fetch(`http://localhost:3000/agendamentos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(atualizado),
        })
            .then((res) => res.json())
            .then((dados) => {
                console.log("Agendamento confirmado:", dados.agendamento);
                setAgendamentos((prev) =>
                    prev.map((item) =>
                        item.id === id ? dados.agendamento : item
                    )
                );
                exibirMensagem(dados.message);
            })
            .catch((err) => {
                console.error("Erro ao confirmar agendamento:", err);
            });

    }

    const editarAgendamento = (id, dadosAtualizados) => {
        fetch(`http://localhost:3000/agendamentos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosAtualizados),
        })
            .then((res) => res.json())
            .then((dados) => {
                console.log("Agendamento editado:", dados.agendamento);
                setAgendamentos((prev) =>
                    prev.map((item) =>
                        item.id === id ? dados.agendamento : item
                    )
                );
                exibirMensagem(dados.message);
            })
            .catch((err) => {
                console.error("Erro ao editar agendamento:", err);
                exibirMensagem("Erro ao editar agendamento");
            });

    }

    const cancelarAgendamento = (id) => {
        fetch(`http://localhost:3000/agendamentos/${id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((dados) => {
                console.log("Agendamento cancelado:", dados.message);
                setAgendamentos((prev) =>
                    prev.filter((item) => item.id !== id)
                );
                exibirMensagem(dados.message);
            })
            .catch((err) => {
                console.error("Erro ao cancelar agendamento:", err);
                exibirMensagem("Erro ao cancelar agendamento");
            });
    }

    useEffect(() => {
        const socket = io("http://localhost:3000");

        socket.on("connect", () => {
            console.log("Conectado ao socket.io-client", socket.id);
        });

        socket.on("agendamento-criado", (novoAgendamento) => {
            setAgendamentos((prev) => {
                const jaExiste = prev.some((item) => item.id === novoAgendamento.id);
                if (jaExiste) return prev;
                return [...prev, novoAgendamento];
            });
            if (criouViaPainel.current) {
                exibirMensagem("Novo agendamento criado");
                criouViaPainel.current = false;
            } else {
                exibirMensagem("Novo agendamento recebido em tempo real!");
            }
        })

        return () => {
            socket.disconnect();
            console.log("Desconectado do socket.io-client");
        };

    }, []);

    useEffect(() => {
        fetch("http://localhost:3000/agendamentos")
            .then((res) => res.json())
            .then((dados) => {
                setAgendamentos(dados);
            })
            .catch((err) => {
                console.error("Erro ao buscar agendamentos:", err);
            });
    }, []);

    return {
        agendamentos,
        mensagem,
        criarAgendamento,
        confirmarAgendamento,
        editarAgendamento,
        cancelarAgendamento,
        exibirMensagem,
    };

}

export default useAgendamentos;