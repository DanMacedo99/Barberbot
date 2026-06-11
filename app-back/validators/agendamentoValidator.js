const { z } = require('zod');

const agendamentoSchema = z.object({
    nome: z.string().trim().min(1, 'Nome é obrigatório'),
    servicoId: z.coerce.number().int('Serviço Inválido').positive('Serviço Inválido'),
    data: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD.')
        .refine((data) => {
            const [ano, mes, dia] = data.split('-').map(Number);
            const dataCriada = new Date(ano, mes - 1, dia);
            return (
                dataCriada.getFullYear() === ano &&
                dataCriada.getMonth() === mes - 1 &&
                dataCriada.getDate() === dia
            )
        }, 'Data inválida'),
    horario: z.string()
        .regex(/^\d{2}:\d{2}$/, 'Horário deve estar no formato HH:mm.')
        .refine((horario) => {
            const [hora, minuto] = horario.split(':').map(Number);
            return hora >= 0 && hora <= 23 && minuto >= 0 && minuto <= 59;

        }, 'Horário Inválido'),
    numero: z.string().optional().nullable(),
    origem: z.enum(['painel', 'whatsapp']).optional(),
    status: z.enum(['pendente', 'confirmado', 'cancelado']).optional()
}).strict()

function validarAgendamento(dados) {
    const resultado = agendamentoSchema.safeParse(dados);

    if (!resultado.success) {
        return {
            valido: false,
            erros: resultado.error.issues.map((erro) => erro.message)
        };
    }

    return {
        valido: true,
        dados: resultado.data
    };
}

module.exports = {
    validarAgendamento
};