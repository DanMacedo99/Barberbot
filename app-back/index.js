const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
const whatsappWebhook = require('./routes/whatsappWebhook');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/webhook', whatsappWebhook);

const agendamentoRoutes = require('./routes/agendamentos');
app.use('/', agendamentoRoutes)

app.get('/', (req, res) => {
    res.send('Olá, este é o back end');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
