require('dotenv').config();
const { interpretarMensagem } = require("./utils/openaiClient");

(async () => {
    const mensagem = "oi, quero agendar um corte de cabelo amanhã as 14h";
    const resultado = await interpretarMensagem(mensagem);
    console.log("resultado interpretado:");
    console.log(resultado)
})();