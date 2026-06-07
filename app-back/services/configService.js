const config = require('../data/config')

function obterConfig() {
    return config;
}

function atualizarConfig(novaConfig) {
    const { slotMin, funcionamento } = novaConfig;

    if (!slotMin || !funcionamento) {
        return {
            erro: true,
            status: 400,
            resposta: { error: 'slotMin, funcionamento, servicos são obrigatórios.' }
        };

    }


    config.slotMin = slotMin;
    config.funcionamento = funcionamento;

    return {
        erro: false,
        resposta: { message: 'Configuração atualizada com sucesso', config }
    };

}

function gerarProximoId() {
    if (!config.servicos || config.servicos.length === 0) {
        return 1;
    }

    const maiorId = Math.max(...config.servicos.map((servico) => Number(servico.id)));
    return maiorId + 1;
}

function adicionarServico(novoServico) {
    const { nome, duracao, preco } = novoServico;

    if (!nome || !duracao || !preco === undefined) {
        return {
            erro: true,
            status: 400,
            resposta: { error: 'nome, duracao e preco são obrigatórios.' }
        };
    }

    const id = gerarProximoId();

    const servicoCriado = {
        id,
        nome,
        duracao: Number(duracao),
        preco: Number(preco)
    };


    config.servicos.push(servicoCriado);

    return {
        erro: false,
        resposta: { message: 'Serviço adicionado com sucesso', servico: servicoCriado, config }
    };
}

function atualizarServicoPorId(id, novosDados) {

    const servicoId = Number(id);

    const index = config.servicos.findIndex((servico) => {
        return Number(servico.id) === servicoId
    });

    if (index === -1) {
        return {
            erro: true,
            status: 404,
            resposta: { error: 'Serviço não encontrado.' }
        };
    }

    const { nome, duracao, preco } = novosDados;

    if (!nome || !duracao || !preco === undefined) {
        return {
            erro: true,
            status: 400,
            resposta: { error: 'nome, duracao e preco são obrigatórios.' }
        };
    }

    config.servicos[index] = { ...config.servicos[index], nome, duracao: Number(duracao), preco: Number(preco) };

    return {
        erro: false,
        resposta: { message: 'Serviço atualizado com sucesso', servico: config.servicos[index], config }
    };
}

function deletarServicoPorId(id) {

    const servicoId = Number(id);
    const index = config.servicos.findIndex((servico) => {
        return Number(servico.id) === servicoId
    });

    if (index === -1) {
        return {
            erro: true,
            status: 404,
            resposta: { error: 'Serviço não encontrado.' }
        };
    }

    const servicoRemovido = config.servicos.splice(index, 1)[0];

    return {
        erro: false,
        resposta: { message: 'Serviço deletado com sucesso', servico: servicoRemovido, config }
    };
}

module.exports = {
    obterConfig,
    atualizarConfig,
    adicionarServico,
    atualizarServicoPorId,
    deletarServicoPorId
} 
