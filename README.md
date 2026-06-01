# BarberBot

Sistema de agendamento para barbearia com backend Node.js/Express, integracao com WhatsApp via Twilio, interpretacao de mensagens com OpenAI e painel administrativo em React/Vite.

O projeto e dividido em duas partes principais:

- `app-back`: API, regras de agendamento, configuracoes, WebSocket, webhook do WhatsApp e integracoes.
- `app-front/painel`: painel web para criar, visualizar, editar, confirmar e cancelar agendamentos.

## Tecnologias

### Backend

- Node.js
- Express
- Socket.IO
- dotenv
- CORS
- Twilio
- OpenAI SDK
- ngrok, como dependencia de desenvolvimento para testes de webhook

### Frontend

- React
- Vite
- React Router
- Socket.IO Client
- CSS por componente
- ESLint

## Estrutura do Projeto

```text
barberbot/
|-- app-back/
|   |-- controllers/
|   |   |-- agendamentoController.js
|   |   |-- configController.js
|   |   `-- whatsappController.js
|   |-- data/
|   |   |-- agendamentos.js
|   |   |-- config.js
|   |   |-- fluxoAgendamento.js
|   |   `-- mensagens.js
|   |-- routes/
|   |   |-- agendamentos.js
|   |   |-- config.js
|   |   `-- whatsappWebhook.js
|   |-- utils/
|   |   |-- openaiClient.js
|   |   |-- socket.js
|   |   `-- twilioClient.js
|   |-- index.js
|   `-- package.json
|
`-- app-front/
    `-- painel/
        |-- src/
        |   |-- components/
        |   |   |-- Navbar.jsx
        |   |   `-- agendamentos/
        |   |       |-- AgendaVisual.jsx
        |   |       |-- AgendamentoEditor.jsx
        |   |       |-- AgendamentoForm.jsx
        |   |       |-- AgendamentoItem.jsx
        |   |       |-- ListaAgendamentos.jsx
        |   |       `-- VisualizacaoSelector.jsx
        |   |-- context/
        |   |   `-- ConfigContext.jsx
        |   |-- hooks/
        |   |   `-- useAgendamentos.js
        |   |-- layout/
        |   |   `-- PainelLayout.jsx
        |   |-- pages/
        |   |   |-- Configuracoes.jsx
        |   |   |-- Home.jsx
        |   |   |-- Login.jsx
        |   |   |-- Logout.jsx
        |   |   `-- Perfil.jsx
        |   |-- utils/
        |   |   `-- gerarHorariosParaData.js
        |   |-- App.jsx
        |   `-- main.jsx
        |-- package.json
        `-- vite.config.js
```

## Como Rodar

E necessario ter o Node.js instalado.

### 1. Backend

```bash
cd app-back
npm install
node index.js
```

O backend roda em:

```text
http://localhost:3000
```

Quando iniciar corretamente, o terminal deve mostrar:

```text
Servidor rodando na porta 3000
```

### 2. Frontend

Em outro terminal:

```bash
cd app-front/painel
npm install
npm run dev
```

O painel normalmente fica disponivel em:

```text
http://localhost:5173
```

## Variaveis de Ambiente

Crie ou configure um arquivo `.env` dentro de `app-back`.

Exemplo:

```env
OPENAI_APIKEY=your_openai_key
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+000000000000
TWILIO_MY_NUMBER_TEST=whatsapp:+000000000000
ENVIAR_MENSAGEM=false
```

## Funcionalidades

### Painel Administrativo

- Pagina inicial com resumo de agendamentos totais, pendentes e confirmados.
- Criacao manual de novos agendamentos.
- Selecao de servico a partir do catalogo configurado.
- Validacao para impedir agendamentos em datas passadas.
- Validacao de dias fechados conforme configuracao da barbearia.
- Mensagens temporarias de feedback para acoes do painel.
- Atualizacao em tempo real quando um novo agendamento e criado via Socket.IO.

### Visualizacoes de Agenda

- Visualizacao em lista dos agendamentos.
- Visualizacao em agenda visual por dia.
- Navegacao entre dia anterior, hoje e proximo dia.
- Indicacao de horarios disponiveis e ocupados.
- Linha do horario atual quando a agenda esta exibindo o dia de hoje.
- Bloqueio visual de duracao conforme o tempo do servico.
- Acoes de editar, confirmar e cancelar a partir dos itens da agenda.

### Configuracoes da Barbearia

- Pagina dedicada de configuracoes.
- Metricas de dias abertos, quantidade de servicos e intervalo de slot.
- Configuracao do intervalo minimo de agendamento (`slotMin`).
- Configuracao de funcionamento por dia da semana.
- Possibilidade de abrir ou fechar dias especificos.
- Campos de horario de abertura e fechamento.
- Cadastro, edicao e remocao de servicos.
- Cada servico pode ter nome, duracao e preco.

### Backend

- API REST para agendamentos.
- API REST para configuracoes.
- Validacao de campos obrigatorios ao criar agendamento.
- Validacao de servico existente.
- Verificacao de conflito de horarios usando a duracao do servico.
- Status inicial `pendente` para novos agendamentos.
- Confirmacao, edicao e cancelamento de agendamentos.
- Envio de mensagens pelo WhatsApp ao confirmar, alterar horario ou cancelar agendamentos.
- Comunicacao em tempo real com Socket.IO.

### WhatsApp e IA

- Webhook para receber mensagens do WhatsApp via Twilio.
- Registro das mensagens recebidas em memoria.
- Interpretacao da mensagem com OpenAI para extrair servico, data e hora.
- Controle de fluxo por numero de telefone enquanto faltam informacoes do agendamento.
- Criacao automatica de agendamento pendente quando servico, data e horario sao identificados.
- Respostas automaticas solicitando informacoes faltantes.
- Emissao de evento `agendamento-criado` para atualizar o painel em tempo real.

## Rotas Principais

O frontend se comunica com o backend em:

```text
http://localhost:3000
```

### Agendamentos

```text
GET    /agendamentos
POST   /agendamentos
PUT    /agendamentos/:id
DELETE /agendamentos/:id
```

### Configuracoes

```text
GET /config
PUT /config
```

### WhatsApp

```text
POST /webhook
```

## Scripts

### Backend

O backend ainda nao possui um script `start` configurado no `package.json`.

Use:

```bash
node index.js
```

Tambem existem arquivos de teste manuais no backend:

```text
testBarberbot.js
testInterpretar.js
testOpenAi.js
testTwilio.js
```

### Frontend

Dentro de `app-front/painel`:

```bash
npm run dev
```

Inicia o servidor de desenvolvimento.

```bash
npm run build
```

Gera a build de producao.

```bash
npm run preview
```

Pre-visualiza a build de producao localmente.

```bash
npm run lint
```

Executa o ESLint.

## Observacoes

- O backend deve estar rodando antes de abrir o painel.
- O frontend esta configurado para acessar a API em `http://localhost:3000`.
- Os dados de agendamentos, mensagens, fluxo e configuracao atual sao mantidos em memoria/arquivos JavaScript simples, nao em banco de dados.
- Para usar WhatsApp e OpenAI, configure corretamente o `.env`.
- Para testar webhook do Twilio localmente, use uma URL publica apontando para o backend, por exemplo com ngrok.
- Se `npm run build` falhar no PowerShell por politica de execucao, use:

```bash
npm.cmd run build
```

## Autor

Projeto de painel e automacao para barbearia, focado em gestao de agendamentos, atendimento por WhatsApp e acompanhamento em tempo real.
