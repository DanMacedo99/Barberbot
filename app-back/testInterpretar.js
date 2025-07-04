require('dotenv').config();
const { interpretarMensagem } = require("./utils/openaiClient");

(async () => {
    const mensagem = "oi, quero mandar um degradezinho na proxima quinta no primeiro horario";
    const resultado = await interpretarMensagem(mensagem);
    console.log("resultado interpretado:");
    console.log(resultado)
})();