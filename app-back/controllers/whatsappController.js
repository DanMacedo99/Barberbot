const twilio = require('twilio');
const mensagens = require('../data/mensagens');
const fluxoAgendamentos = require('../data/fluxoAgendamento');
const agendamentos = require('../data/agendamentos');



function receberMensagemWhatsapp(req, res) {
    const mensagem = req.body.Body;
    const numero = req.body.From;
    const nomePerfil = req.body.ProfileName;
    const idMensagem = req.body.MessageSid;

    // Aqui você pode processar a mensagem recebida
    console.log('Mensagem recebida do WhatsApp:');
    console.log(`${numero}`);
    console.log(`nome: ${nomePerfil}`);
    console.log(`Mensagem: ${mensagem}`);


    const novaMensagem = {
        id: idMensagem,
        numero,
        nomePerfil,
        mensagem,
        dataHora: new Date().toISOString()
    };

    mensagens.push(novaMensagem);

    console.log("mensagem salva no sistema:");
    console.log(novaMensagem);

    const twiml = new twilio.twiml.MessagingResponse();
    const mensagemMinuscula = mensagem.toLowerCase();

    if (!fluxoAgendamentos[numero]) {
        fluxoAgendamentos[numero] = {
            etapa: 1,
            servico: null,
            horario: null,
        }
        twiml.message('olá! vamos agendar seu horario. qual serviço deseja?')
    } else {
        const etapa = fluxoAgendamentos[numero].etapa;

        if (etapa === 1) {

            fluxoAgendamentos[numero].servico = mensagem;
            fluxoAgendamentos[numero].etapa = 2;
            twiml.message(`perfeito! Qual o horario desejado para o serviço "${mensagem}"?`);

        } else if (etapa === 2) {
            fluxoAgendamentos[numero].horario = mensagem;

            const agendamento = {
                id: Date.now().toString(),
                numero,
                nome: nomePerfil || numero,
                servico: fluxoAgendamentos[numero].servico,
                horario: fluxoAgendamentos[numero].horario,
                status: 'pendente',
                dataHoraCriacao: new Date().toISOString()
            };

            agendamentos.push(agendamento);

            delete fluxoAgendamentos[numero];

            twiml.message(`obrigado, seu agendamento foi criado:
                \nServiço: ${agendamento.servico}
                \nHorário: ${agendamento.horario}
                \nStatus: ${agendamento.status}`
            )
        } else {
            delete fluxoAgendamentos[numero];
            twiml.message('Descule, não entendi. vamos começar novamente.Qual serviço deseja?');
        }


    }

    res.writeHead(200, { 'content-Type': 'text/xml' })
    res.end(twiml.toString());

}

module.exports = {
    receberMensagemWhatsapp
}