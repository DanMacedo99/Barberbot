module.exports = {
    slotMin: 60, // intervalo padrão em minutos
    funcionamento: {
        1: { aberto: true, horaAbertura: '08:00', horaFechamento: '18:00' },
        2: { aberto: true, horaAbertura: '08:00', horaFechamento: '18:00' },
        3: { aberto: true, horaAbertura: '08:00', horaFechamento: '18:00' },
        4: { aberto: true, horaAbertura: '08:00', horaFechamento: '18:00' },
        5: { aberto: true, horaAbertura: '08:00', horaFechamento: '18:00' },
        6: { aberto: true, horaAbertura: '09:00', horaFechamento: '18:00' },
        0: { aberto: true, horaAbertura: '13:00', horaFechamento: '23:00' }
    },
    servicos: [
        { id: 1, nome: 'Corte de Cabelo', duracao: 30, preco: 20 },
        { id: 2, nome: 'Barba', duracao: 20, preco: 15 },
        { id: 3, nome: 'Corte e Barba', duracao: 45, preco: 30 }
    ]
};
