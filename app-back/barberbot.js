const readline = require('readline');
const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let nomeCliente = '';
let servicoEscolhido = '';
let horarioEscolhido = '';

terminal.question('Olá, bem vindo ao barberbot! qual seu nome?', function(respostaNome) {
    nomeCliente = respostaNome;
    console.log(`Olá ${nomeCliente}, vamos agendar seu horário!`);

    perguntaServico()

    function perguntaServico() {
        console.log('Escolha o serviço');
        console.log('1 - Corte de cabelo');
        console.log('2 - Barba');
        console.log('3 - Corte de cabelo e barba');

        terminal.question('Digite o número do serviço desejado: ', function(respostaServico) {
            servicoEscolhido = respostaServico;
            if (respostaServico === '1') {
                servicoEscolhido = 'Corte de cabelo';
            } else if (respostaServico === '2') {
                servicoEscolhido = 'Barba';
            } else if (respostaServico === '3') {
                servicoEscolhido = 'Corte de cabelo e barba';
            } else {
                servicoEscolhido = 'Serviço inválido tente novamente'
                console.log(servicoEscolhido);
                return perguntaServico(); 
            }
            perguntaHorario();
            console.log(`Serviço escolhido: ${servicoEscolhido}`);

            console.log('horarios disponíveis:');
            console.log('1 - 10:00');  
            console.log('2 - 11:00');
            console.log('3 - 12:00');
        })
    };

   
        function perguntaHorario() {
            terminal.question('Digite o número do horário desejado: ', function(respostaHorario) {
                if (respostaHorario === '1') {
                    horarioEscolhido = '10:00';
                } else if (respostaHorario === '2') {
                    horarioEscolhido = '11:00';
                } else if (respostaHorario === '3') {
                    horarioEscolhido = '12:00';
                } else {
                    horarioEscolhido = 'Horário inválido tente novamente'
                    console.log(horarioEscolhido);
                    return perguntaHorario(); 
                }
            
                console.log(`Horário escolhido: ${horarioEscolhido}`);
                console.log(`Agendamento confirmado para ${nomeCliente} - Serviço: ${servicoEscolhido} - Horário: ${horarioEscolhido}`);
                terminal.close();

            });
        }
});