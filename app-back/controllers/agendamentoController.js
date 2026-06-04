
const { enviarMensagemWhatsapp } = require('../utils/twilioClient')
const {
    listarAgendamentosFormatados,
    criarNovoAgendamento,
    atualizarAgendamentoPorId,
    deletarAgendamentoPorId,
} = require('../services/agendamentoService')
const {
    mensagemConfirmacaoAgendamento,
    mensagemAlteracaoHorario,
    mensagemCancelamentoAgendamento
} = require('../services/whatsappService');


function listarAgendamento(req, res) {

    const agendamentosFormatados = listarAgendamentosFormatados();

    res.json(agendamentosFormatados);

}

function criarAgendamento(req, res) {
    const resultado = criarNovoAgendamento(req.body);


    if (resultado.erro) {
        return res.status(resultado.status).json(resultado.resposta);
    }

    const io = require('../utils/socket').getIO();
    io.emit('agendamento-criado', resultado.agendamento);

    res.status(201).json({
        message: 'Agendamento criado com sucesso',
        agendamento: resultado.agendamento
    });
}

async function atualizarAgendamento(req, res) {
    const id = req.params.id;
    const resultado = atualizarAgendamentoPorId(id, req.body);

    if (resultado.erro) {
        return res.status(resultado.status).json(resultado.resposta);
    }

    const agendamentoAntigo = resultado.agendamentoAntigo;
    const agendamentoNovo = resultado.agendamentoNovo;



    let mensagemCliente = "";

    if (
        agendamentoAntigo.status !== agendamentoNovo.status &&
        agendamentoNovo.status === 'confirmado'
    ) {
        mensagemCliente = mensagemConfirmacaoAgendamento(agendamentoNovo);

    } else if (agendamentoAntigo.horario !== agendamentoNovo.horario) {
        mensagemCliente = mensagemAlteracaoHorario(agendamentoAntigo, agendamentoNovo);
    }

    if (mensagemCliente && agendamentoNovo.numero) {
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
    const resultado = deletarAgendamentoPorId(id);

    if (resultado.erro) {
        return res.status(resultado.status).json(resultado.resposta);
    }

    const mensagemCliente = mensagemCancelamentoAgendamento(resultado.agendamento);

    if (resultado.agendamento.numero) {
        try {
            await enviarMensagemWhatsapp(resultado.agendamento.numero, mensagemCliente);
            console.log(`mensagem enviada para ${resultado.agendamento.numero}`);
        } catch (error) {
            console.error(`Error ao enviar mensagem pelo WhatsApp:`, error.message);
        }
    }

    res.json({ mensagem: 'Agendamento excluído com sucesso.', agendamento: resultado.agendamento });

}


module.exports = {
    listarAgendamento,
    criarAgendamento,
    atualizarAgendamento,
    deletarAgendamento
};