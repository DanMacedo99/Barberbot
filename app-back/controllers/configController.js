const {
    atualizarConfig,
    obterConfig,
    adicionarServico,
    atualizarServicoPorId,
    deletarServicoPorId
} = require('../services/configService');

function getConfig(req, res) {
    const config = obterConfig();
    res.json(config);
}

function updateConfig(req, res) {
    const resultado = atualizarConfig(req.body);

    if (resultado.erro) {
        return res.status(resultado.status).json(resultado.resposta);
    }

    res.json({
        message: 'Configuração atualizada com sucesso',
        config: resultado.resposta.config
    });
}

function createServico(req, res) {
    const resultado = adicionarServico(req.body);

    if (resultado.erro) {
        return res.status(resultado.status).json(resultado.resposta);
    }

    res.status(201).json(resultado.resposta);
}

function updateServico(req, res) {
    const { id } = req.params;
    const resultado = atualizarServicoPorId(id, req.body);

    if (resultado.erro) {
        return res.status(resultado.status).json(resultado.resposta);
    }

    res.json(resultado.resposta);
}

function deleteServico(req, res) {
    const { id } = req.params;
    const resultado = deletarServicoPorId(id);

    if (resultado.erro) {
        return res.status(resultado.status).json(resultado.resposta);
    }

    res.json(resultado.resposta);
}

module.exports = {
    getConfig,
    updateConfig,
    createServico,
    updateServico,
    deleteServico
};