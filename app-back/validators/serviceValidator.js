const { z } = require('zod')

const servicoSchema = z.object({
    nome: z.string()
        .trim()
        .min(1, 'Nome do serviço é um campo obrigatório'),
    duracao: z.coerce.number()
        .int('Duração deve ser um numero inteiro')
        .positive('Duração deve ser um numero maior que zero'),
    preco: z.coerce.number()
        .min(0, 'Preço não pode ser negativo')
}).strict();

function validarServico(dados) {
    const resultados = servicoSchema.safeParse(dados);

    if (!resultados.success) {
        return {
            valido: false,
            erros: resultados.error.issues.map((erro) => erro.message)
        };
    }
    return { valido: true, dados: resultados.data };

}

module.exports = {
    validarServico
};