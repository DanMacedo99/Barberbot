const config = require('../data/config')
const { validarServico } = require('../validators/serviceValidator')
const { validarConfig } = require('../validators/configValidator')

function obterConfig() {
    return config;
}

function atualizarConfig(novaConfig) {
    const validacao = validarConfig(novaConfig)

    if (!validacao.valido) {
        return {
            erro: true,
            status: 400,
            resposta: {
                error: 'Dados inválido',
                detalhes: validacao.erros
            }
        };
    }

    const { slotMin, funcionamento } = validacao.dados;


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

    const validacao = validarServico(novoServico);
    if (!validacao.valido) {
        return {
            erro: true,
            status: 400,
            resposta: {
                error: 'Dados inválidos',
                detalhes: validacao.erros
            }
        }
    }
    const { nome, duracao, preco } = validacao.dados;

    const id = gerarProximoId();

    const servicoCriado = {
        id,
        nome,
        duracao,
        preco
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

    const validacao = validarServico(novosDados);

    if (!validacao.valido) {
        return {
            erro: true,
            status: 400,
            resposta: {
                error: 'Dado inválidos.',
                detalhes: validacao.erros
            }
        };
    }
    console.log('essa é a validacao:', validacao)

    const { nome, duracao, preco } = validacao.dados

    config.servicos[index] = { ...config.servicos[index], nome, duracao, preco };

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
