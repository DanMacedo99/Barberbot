# BarberBot

A simple barbershop scheduling system with a Node.js/Express backend and a React/Vite admin dashboard.

The project has two main parts:

- `app-back`: backend API, integrations, and scheduling logic.
- `app-front/painel`: web dashboard to view, create, edit, confirm, and cancel appointments.

## Technologies

### Backend

- Node.js
- Express
- Socket.IO
- dotenv
- CORS
- Twilio
- OpenAI SDK

### Frontend

- React
- Vite
- React Router
- Socket.IO Client
- Component-based CSS

## Project Structure

```text
barberbot/
├── app-back/
│   ├── controllers/
│   ├── data/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── app-front/
    └── painel/
        ├── src/
        │   ├── components/
        │   ├── context/
        │   ├── hooks/
        │   ├── layout/
        │   ├── pages/
        │   ├── App.jsx
        │   └── main.jsx
        ├── package.json
        └── vite.config.js
How to Run
You need Node.js installed.

1. Run the Backend
Open a terminal:

bash

cd app-back
npm install
node index.js
The backend will run at:

text


http://localhost:3000
If everything is working, you should see:

text


Servidor rodando na porta 3000
2. Run the Frontend
Open another terminal:

bash

cd app-front/painel
npm install
npm run dev
The dashboard will usually run at:

text


http://localhost:5173
Environment Variables
Create or configure a .env file inside app-back.

Example:

env

OPENAI_APIKEY=your_openai_key
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+000000000000
TWILIO_MY_NUMBER_TEST=whatsapp:+000000000000
ENVIAR_MENSAGEM=false


Features

Admin Dashboard
Create new appointments.
View appointments in a list.
View appointments in a visual schedule.
Edit existing appointments.
Confirm pending appointments.
Cancel appointments.
Receive real-time updates through Socket.IO.
Settings Page
Set the minimum appointment interval.
Configure business days and working hours.
Add, edit, and remove services.
Save barbershop settings.
Backend
Appointment API.
Settings API.
WhatsApp webhook.
Twilio integration.
OpenAI integration.
Real-time communication with Socket.IO.
Available Scripts
Backend
The backend does not currently have a start script configured in package.json.

Use:

bash

node index.js
Frontend
Inside app-front/painel:

bash

npm run dev
Starts the development server.

bash

npm run build
Creates a production build.

bash

npm run preview
Previews the production build locally.

bash

npm run lint
Runs ESLint.

Main Routes
The frontend communicates with the backend at:

text


http://localhost:3000
Main resources used by the app:

text


/agendamentos
/config
/webhook
Notes
The backend should be running before opening the frontend.
The frontend is configured to access the API at http://localhost:3000.
To use WhatsApp and OpenAI integrations, configure the .env file correctly.
If npm run build fails in PowerShell due to execution policy, use:
bash

npm.cmd run build
Author
A barbershop dashboard and automation project for appointment management, customer scheduling, and WhatsApp integration.
```
