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

    const agendamentoAtual = agendamentos[index];
    const horarioAntigo = agendamentoAtual.horario;
    const statusAntigo = agendamentoAtual.status;

    agendamentos[index] = {
        ...agendamentos[index],
        nome: nome || agendamentos[index].nome,
        servico: servico || agendamentos[index].servico,
        horario: horario || agendamentos[index].horario,
        status: status || agendamentos[index].status
    };


    let mensagemCliente = "";



    if (agendamentos[index].status === 'confirmado') {

        mensagemCliente = `Olá, ${agendamentos[index].nome}! Seu agendamento foi confirmado \n\nServiço: ${agendamentos[index].servico}\nHorário: ${agendamentos[index].horario}\n\nObrigado!`

    } else if (horario && horario !== horarioAntigo) {
        mensagemCliente = `Olá ${agendamentos[index].nome}. O horario do seu agendamento foi alterado \n\n de: ${horarioAntigo} para: ${agendamentos[index].horario}`
    }

    if (mensagemCliente) {
        try {
            await enviarMensagemWhatsapp(
                agendamentos[index].numero,
                mensagemCliente
            );
            console.log(`mensagem enviada para ${agendamentos[index].numero}`)
        } catch (error) {
            console.error(`Error ao enviar mensagem pelo WhatsApp:`, error);
        }
    };

    res.json({
        message: 'Agendamento atualizado com sucesso',
        agendamento: agendamentos[index]
    });
}

async function deletarAgendamento(req, res) {
    const id = req.params.id;
    const index = agendamentos.findIndex(a => a.id === id);



    mensagemCliente = `Olá, Seu agendamento foi cancelado. \nSe precisar, estamos à deisposição para remarcar.`


    if (index === -1) {
        return res.status(404).json({ error: 'Agendamento não encontrado.' });
    } else if (mensagemCliente) {
        try {
            await enviarMensagemWhatsapp(
                agendamentos[index].numero,
                mensagemCliente
            );
            console.log(`mensagem enviada para ${agendamentos[index].numero}`)
        } catch (error) {
            console.error(`Error ao enviar mensagem pelo WhatsApp:`, error);
        }
    };

    const deletado = agendamentos.splice(index, 1);


    res.json({ mensagem: 'Agendamento excluído com sucesso.', deletado });







}


module.exports = {
    listarAgendamento,
    criarAgendamento,
    atualizarAgendamento,
    deletarAgendamento
};