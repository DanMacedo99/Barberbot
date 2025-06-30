import React, { useEffect, useState } from "react";
import AgendamentoItem from "./AgendamentoItem";

const AgendamentoList = () => {
    const [agendamentos, setAgendamentos] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/agendamentos")
            .then((response) => response.json())
            .then((data) => setAgendamentos(data))
            .catch((error) => {
                console.error("erro ao buscar agendamentos:", error);
            });

    }, []);
}


return (
    <div>
        <h2>Agendamentos Recebidos</h2>
        {agendamentos.lenght === 0 ? (
            <p>Nenhum agendamento encontrado.</p>
        ) : (
            agendamentos.map((item => (
                <AgendamentoItem
                    key={item.id}
                    item={item}
                />
            )))
        )}
    </div>
)

export default AgendamentoList;