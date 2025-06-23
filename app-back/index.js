const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;


app.use(cors());

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Olá, este é o back end');
});

const agendamento = [];

app.post('/agendamentos', (req, res) => {
    const {nome, servico, horario, situacao} = req.body;

    if (!nome || !servico || !horario || !situacao) {
        return res.status(400).json({error: 'Todos os campos são obrigatórios.'});
    }

const novoAgendamento = {
    id: Date.now(),
    nome,
    servico,
    horario,
    situacao
}; 
    agendamento.push(novoAgendamento);
    
    res.status(201).json({
        message: 'Agendamento criado com sucesso!',
        agendamento: novoAgendamento
    });
});

app.get('/agendamentos', (req, res) => {
   res.json(agendamento);  
})

app.put('/agendamentos/:id', (req, res) => {
   
    const id = parseInt(req.params.id);
    const {nome, servico, horario, situacao} = req.body;
    
    const index = agendamento.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({error: 'Agendamento não encontrado.'});
    };
  
    if (nome) agendamento[index].nome = nome;
    if (servico) agendamento[index].servico = servico;
    if (horario) agendamento[index].horario = horario;
    if (situacao) agendamento[index].situacao = situacao;

    res.json({
        message: 'Agendamento atualizado com sucesso!',
        agendamento: agendamento[index]
    });

});

app.delete('/agendamentos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    const index = agendamento.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({error: 'Agendamento não encontrado.'});
    };

    agendamento.splice(index, 1);

    res.json({message: 'Agendamento deletado com sucesso!'});
})


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
