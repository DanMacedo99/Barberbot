const twilio = require('twilio');
const mensagens = require('../data/mensagens');
const fluxoAgendamentos = require('../data/fluxoAgendamento');
const agendamentos = require('../data/agendamentos');
const { interpretarMensagem } = require("../utils/openaiClient")



async function receberMensagemWhatsapp(req, res) {
    const mensagem = req.body.Body;
    const numero = req.body.From;
    const nomePerfil = req.body.ProfileName;
    const idMensagem = req.body.MessageSid;

    // Aqui você pode processar a mensagem recebida
    console.log(`Mensagem recebida do ${numero}, de ${nomePerfil} mensagem é:\n${mensagem} `);


    mensagens.push({
        id: idMensagem,
        numero,
        nomePerfil,
        mensagem,
        dataHora: new Date().toISOString()
    });

    const twiml = new twilio.twiml.MessagingResponse();

    const interpretado = await interpretarMensagem(mensagem);
    console.log('dados interpretados pela IA:', interpretado);

    if (!fluxoAgendamentos[numero]) {
        fluxoAgendamentos[numero] = {
            servico: null,
            data: null,
            horario: null
        }

    }

    const fluxo = fluxoAgendamentos[numero];

    if (interpretado) {
        if (interpretado.servico &&
            interpretado.servico !== "null" &&
            interpretado.servico.trim() !== ""
        ) fluxo.servico = interpretado.servico;

        if (interpretado.data &&
            interpretado.data !== "null" &&
            interpretado.data.trim() !== ""
        ) fluxo.data = interpretado.data;

        if (interpretado.hora &&
            interpretado.hora !== "null" &&
            interpretado.hora.trim() !== ""
        ) fluxo.hora = interpretado.hora;
    }

    if (
        fluxo.servico && fluxo.servico !== "null" && fluxo.servico.trim() !== "" &&
        fluxo.data && fluxo.data !== "null" && fluxo.data.trim() !== "" &&
        fluxo.hora && fluxo.hora !== "null" && fluxo.hora.trim() !== ""

    ) {

        const agendamento = {
            id: Date.now().toString(),
            numero,
            nome: nomePerfil || numero,
            servico: fluxo.servico,
            horario: `${fluxo.data} às ${fluxo.hora}`,
            status: 'pendente',
            dataHoraCriacao: new Date().toISOString()
        };

        agendamentos.push(agendamento);
        delete fluxoAgendamentos[numero];

        twiml.message(`Fechado, ${agendamento.nome}! Certo recebemos o seu pedido de agendamento:\n\n Serviço: ${agendamento.servico}\n Data e hora: ${agendamento.horario}\n\nVamos confirmar e entramos em contato!`);
    } else {
        if (!fluxo.servico) {
            twiml.message("fala ai Beleza? Qual serviço você quer agendar?");
        } else if (!fluxo.data && !fluxo.hora) {
            twiml.message(`Show, anotado: ${fluxo.servico}. Qual dia e horario você prefere?`);
        } else if (!fluxo.hora) {
            twiml.message(`Show, anotado: ${fluxo.servico}. Certo então ${fluxo.data} e qual horario você prefere?`);
        } else if (!fluxo.data) {
            twiml.message(`Certo então as ${fluxo.hora} e qual dia você gostaria?`);
        } else {
            twiml.message("não consegui entender bem, pode repetir?");
        }
    }

    res.writeHead(200, { 'content-Type': 'text/xml' })
    res.end(twiml.toString());

}

module.exports = {
    receberMensagemWhatsapp
}