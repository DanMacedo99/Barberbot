const { z } = require('zod');

function horarioValido(horario) {
    const [hora, minuto] = horario.split(':').map(Number);
    return hora >= 0 && hora <= 23 && minuto >= 0 && minuto <= 59;
}

function converterHorarioParaMinutos(horario) {
    const [hora, minuto] = horario.split(':').map(Number);

    return hora * 60 + minuto;
}

const funcionamentoDiaSchema = z.object({
    aberto: z.boolean(),
    horaAbertura: z.string()
        .regex(/^\d{2}:\d{2}$/, 'Hora de abertura deve estar no formato HH:mm.')
        .refine(horarioValido, 'Horário de abertura inválido')
        .optional(),
    horaFechamento: z.string()
        .regex(/^\d{2}:\d{2}$/, 'Hora de fechamento deve estar no formato HH:mm.')
        .refine(horarioValido, 'Horário de fechamento inválido')
        .optional(),

}).strict().refine((dia) => {
    if (!dia.aberto) {
        return true;
    }

    return Boolean(dia.horaAbertura && dia.horaFechamento);
}, 'Dias de funcionamento devem ter hora de abertura e fechamento definidos.')
    .refine((dia) => {
        if (!dia.aberto) {
            return true;
        }
        return converterHorarioParaMinutos(dia.horaAbertura) < converterHorarioParaMinutos(dia.horaFechamento);
    }, 'Hora de abertura deve vir antes do horario de fechamento ')

const funcionamentoFechadoOuAbertoSchema = z.union([
    funcionamentoDiaSchema,
    z.null()
]);

const configSchema = z.object({
    slotMin: z.coerce.number()
        .int('slotMin deve ser um número inteiro')
        .min(5, 'Slotmin deve ter no mínimo 5 minutos')
        .max(60, 'SlotMin deve ter no máximo 60 minutos'),
    funcionamento: z.object({
        0: funcionamentoFechadoOuAbertoSchema,
        1: funcionamentoFechadoOuAbertoSchema,
        2: funcionamentoFechadoOuAbertoSchema,
        3: funcionamentoFechadoOuAbertoSchema,
        4: funcionamentoFechadoOuAbertoSchema,
        5: funcionamentoFechadoOuAbertoSchema,
        6: funcionamentoFechadoOuAbertoSchema
    }).strict()
}).strict();

function validarConfig(dados) {
    const resultado = configSchema.safeParse(dados);
    if (!resultado.success) {
        return {
            valido: false,
            erros: resultado.error.issues.map((erro) => erro.message)
        };
    }
    return {
        valido: true,
        dados: resultado.data
    }
}

module.exports = {
    validarConfig
};