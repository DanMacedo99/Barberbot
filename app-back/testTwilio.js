require('dotenv').config();
const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);


async function enviarMensagemTeste() {
    try {
        const mensagem = await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: process.env.TWILIO_MY_NUMBER_TEST,
            body: 'teste de integração Twilio Whatsapp funcionando com sucesso!'
        })

        console.log('Mensagem enviada com sucesso! SID:', mensagem.sid);

    } catch (error) {
        console.error('erro ao enviar mensagem:', error);
    }
}

enviarMensagemTeste();