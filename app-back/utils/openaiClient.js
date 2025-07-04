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

    console.log("reposta da OpenAi:");
    console.log(completion.choices[0].message);
}

async function interpretarMensagem(mensagem) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `Você é um assistente que extrai informações de agendamento de mensagens livres em português. Responda APENAS com um JSON puro e válido, sem formatação, sem texto extra, sem crases e sem markdown.
                Formato EXATO:
                    {
                        "servico": "",
                        "data": "",
                        "hora": ""
                    }
                Se não conseguir identificar algum dado, coloque "null".
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