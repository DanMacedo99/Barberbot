let config = require('../data/config');

function getConfig(req, res) {
    res.json(config);
}


function updateConfig(req, res) {
    const { slotMin, funcionamento, servicos } = req.body;

    if (!slotMin || !funcionamento || !servicos) {
        return res.status(400).json({ error: 'slotMin, funcionamento, servicos são obrigatórios.' });
    }

    config = { slotMin, funcionamento, servicos };

    res.json({
        message: 'Configuração atualizada com sucesso',
        config
    });
}

module.exports = {
    getConfig,
    updateConfig
};