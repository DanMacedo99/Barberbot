const twilio = require('twilio');

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function enviarMensagemWhatsapp(destino, mensagem) {

    if (process.env.ENVIAR_MENSAGEM === 'false') {
        console.log(`[Simulação] Enviando mensagem para ${destino}: ${mensagem}`);
        return

    }

    try {
        const response = await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: destino,
            body: mensagem
        });

        console.log("este é o response:", response)
        console.log("Mensagem enviada com sucesso:", response.sid);
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error.message);
    }

}


module.exports = {
    enviarMensagemWhatsapp
}