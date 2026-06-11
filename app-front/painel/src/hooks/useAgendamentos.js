import { useState, useRef, useEffect } from "react";
import useToast from "./useToast.js";
import { API_URL } from "../config/api.js";

import { io } from "socket.io-client";

function useAgendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const { mensagem, exibirMensagem } = useToast();
    const criouViaPainel = useRef(false);

    const criarAgendamento = (agendamento) => {
        const agendamentoComStatus = { ...agendamento, status: "pendente" };

        fetch(`${API_URL}/agendamentos`, {
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

        fetch(`${API_URL}/agendamentos/${id}`, {
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
        fetch(`${API_URL}/agendamentos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosAtualizados),
        })
            .then(async (res) => {
                const dados = await res.json();

                if (!res.ok) {
                    throw dados;
                }

                return dados;

            }).then((dados) => {
                console.log("Agendamento editado:", dados.agendamento);
                setAgendamentos((prev) =>
                    prev.map((item) =>
                        item.id === id ? dados.agendamento : item
                    )
                );
                exibirMensagem(dados.message || 'agendamento editado com sucesso');
            })
            .catch((err) => {
                console.error("Erro ao editar agendamento:", err);

                const mensagemErro =
                    err.message ||
                    err.error ||
                    err.detalhe?.[0] ||
                    'erro ao editar agendamento';
                exibirMensagem("Erro ao editar agendamento");
            });

    }

    const cancelarAgendamento = (id) => {
        fetch(`${API_URL}/agendamentos/${id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((dados) => {
                console.log("Agendamento cancelado:", dados.message);
                setAgendamentos((prev) =>
                    prev.filter((item) => item.id !== id)
                );
                exibirMensagem("Agendamento cancelado com sucesso");
            })
            .catch((err) => {
                console.error("Erro ao cancelar agendamento:", err);
                exibirMensagem("Erro ao cancelar agendamento");
            });
    }

    useEffect(() => {
        const socket = io(API_URL);

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
        fetch(`${API_URL}/agendamentos`)
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