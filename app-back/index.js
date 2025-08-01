require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socket = require('./utils/socket');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const agendamentoRoutes = require('./routes/agendamentos');
app.use('/', agendamentoRoutes)

const whatsappWebhook = require('./routes/whatsappWebhook');
app.use('/', whatsappWebhook);


app.get('/', (req, res) => {
    res.send('Olá, este é o back end');
});

const server = http.createServer(app);

const io = socket.init(server);

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})

