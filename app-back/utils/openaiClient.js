const OpenAi = require("openai");

const openai = new OpenAi({
    apiKey: process.env.OPENAI_APIKEY
});

async function testCompletion() {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content: "Você é um assistente que responde de forma curta." },
            { role: "user", content: "Diga Olá, barberbot!" }
        ]
    });

    console.log("resposta da OpenAi:");
    console.log(completion.choices[0].message);
}

async function interpretarMensagem(mensagem) {

    function obterDataEHoraAtual() {
        const hoje = new Date()
        const ano = hoje.getFullYear();
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const dia = String(hoje.getDate()).padStart(2, '0');
        const hora = String(hoje.getHours()).padStart(2, '0');
        const minuto = String(hoje.getMinutes()).padStart(2, '0');

        return {
            dataAtual: `${ano}-${mes}-${dia}`,
            horaAtual: `${hora}:${minuto}`
        };
    }

    const { dataAtual, horaAtual } = obterDataEHoraAtual();
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `Você é um assistente que extrai informações de agendamento de mensagens livres em português. 
                A data atual do sistema é: ${dataAtual}.
                O horario atual do sistema é: ${horaAtual}. 
                Sua tarefa é identificar serviço, data e hora.
                Responda APENAS com um JSON puro e válido, sem formatação, sem texto extra, sem crases e sem markdown.
                Formato EXATO: 
                {
                    "servico": "",
                    "data": "",
                    "hora": ""
                }

                Regras obrigatórias:
                - O campo "data" deve SEMPRE estar no formato YYYY-MM-DD.
                - Se o cliente disser "hoje", converta para a data atual do sistema.
                - Se o cliente disser "amanhã", converta para o próximo dia no formato YYYY-MM-DD.
                - Se o cliente disser "próxima segunda", "próxima terça", ou qualquer dia da semana, converta para a data real correspondente.
                - Nunca retorne "amanhã", "hoje", "segunda", "terça" ou texto livre no campo "data".
                - O campo "hora" deve estar no formato HH:mm.
                - Se o cliente te pedir um horario que já passou hoje, ainda assim extraia a data e hora pedidas. A validação será feita pelo sistema.
                - Se não conseguir identificar algum dado, coloque "null".

                Não escreva nada além do JSON.`.trim()
            },
            {
                role: "user",
                content: mensagem
            }
        ],
        temperature: 0
    });

    const resposta = completion.choices[0].message.content;

    try {

        const jsonLimpo = resposta
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const dados = JSON.parse(jsonLimpo);
        return dados;
    } catch (error) {
        console.error("Erro ao converterJSON:", error);
        console.error("Resposta bruta:", resposta);

        return null;
    }
}

module.exports = {
    testCompletion,
    interpretarMensagem
};