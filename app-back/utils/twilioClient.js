const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function enviarMensagemWhatsapp(destino, mensagem) {
    return client.messages.create({
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        to: destino,
        body: mensagem
    });
}

module.exports = {
    enviarMensagemWhatsapp
}