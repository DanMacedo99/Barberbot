require('dotenv').config();
const twilio = require('twilio');
const { enviarMensagemWhatsapp } = require('./utils/twilioClient');


async function enviarMensagemTeste() {

    const destino = process.env.TWILIO_MY_NUMBER_TEST;
    const mensagem = "Olá, esta é uma mensagem de teste do Twilio!";

    try {
        await enviarMensagemWhatsapp(destino, mensagem);
        console.log("Mensagem de teste enviada com sucesso!");
    } catch (error) {
        console.error("Erro ao enviar mensagem de teste:", error.message);
    }
}

enviarMensagemTeste();