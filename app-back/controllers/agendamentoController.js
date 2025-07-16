const agendamentos = require('../data/agendamentos');
const { enviarMensagemWhatsapp } = require('../utils/twilioClient')



function listarAgendamento(req, res) {
    res.json(agendamentos);
}

function criarAgendamento(req, res) {
    const { nome, servico, horario } = req.body;

    if (!nome || !servico || !horario) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const novoAgendamento = {
        id: Date.now().toString(),
        nome,
        servico,
        horario,
        status: 'pendente'
    };

    agendamentos.push(novoAgendamento);


    const io = require('../utils/socket').getIO();
    io.emit('agendamento-criado', novoAgendamento);// Emitindo o evento de novo agendamento para todos os clientes conect

    res.status(201).json({
        message: 'Agendamento criado com sucesso',
        agendamento: novoAgendamento
    });
}

async function atualizarAgendamento(req, res) {
    const id = req.params.id;
    const { nome, servico, horario, status } = req.body;
    const index = agendamentos.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Agendamento não encontrado.' });
    };

    const agendamentoAntigo = { ...agendamentos[index] }

    agendamentos[index] = {
        ...agendamentos[index],
        nome: nome || agendamentos[index].nome,
        servico: servico || agendamentos[index].servico,
        horario: horario || agendamentos[index].horario,
        status: status || agendamentos[index].status
    };

    const agendamentoNovo = agendamentos[index];
    let mensagemCliente = "";



    if (
        agendamentoAntigo.status !== agendamentoNovo.status &&
        agendamentoNovo.status === 'confirmado'
    ) {
        mensagemCliente = `Olá, ${agendamentoNovo.nome}! Seu agendamento foi confirmado \n\nServiço: ${agendamentoNovo.servico}\nHorário: ${agendamentoNovo.horario}\n\nObrigado!`

    } else if (agendamentoAntigo.horario !== agendamentoNovo.horario) {
        mensagemCliente = `Olá ${agendamentos[index].nome}. O horario do seu agendamento foi alterado \n\n de: ${agendamentoAntigo.horario} para: ${agendamentoNovo.horario}\n\nObrigado!`
    }

    if (mensagemCliente) {
        try {
            await enviarMensagemWhatsapp(
                agendamentoNovo.numero,
                mensagemCliente
            );
            console.log(`mensagem enviada para ${agendamentoNovo.numero}`)
        } catch (error) {
            console.error(`Error ao enviar mensagem pelo WhatsApp:`, error);
        }
    };

    res.json({
        message: 'Agendamento atualizado com sucesso',
        agendamento: agendamentoNovo
    });
}

async function deletarAgendamento(req, res) {
    const id = req.params.id;
    const index = agendamentos.findIndex(a => a.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    const agendamento = agendamentos[index];
    const numero = agendamento.numero;

    mensagemCliente = `Olá ${agendamento.nome}, Seu agendamento foi cancelado. \nSe precisar, estamos à deisposição para remarcar.`

    try {
        await enviarMensagemWhatsapp(numero, mensagemCliente);
        console.log(`mensagem enviada para ${numero}`);
    } catch (error) {
        console.error(`Error ao enviar mensagem pelo WhatsApp:`, error.message);
    }

    const deletado = agendamentos.splice(index, 1);
    res.json({ mensagem: 'Agendamento excluído com sucesso.', deletado });

}


module.exports = {
    listarAgendamento,
    criarAgendamento,
    atualizarAgendamento,
    deletarAgendamento
};