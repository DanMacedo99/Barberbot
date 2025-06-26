function receberMensagemWhatsapp(req, res) {
    const mensagem = req.body.Body;
    const numero = req.body.from; // Número do remetente

    // Aqui você pode processar a mensagem recebida
    console.log('Mensagem recebida do WhatsApp:');
    console.log(`De: ${numero}`);
    console.log(`Mensagem: ${mensagem}`);

    // Responder com um status 200 OK
    res.status(200).send('Mensagem recebida com sucesso');

    res.set('Content-Type', 'text/xml');
    res.send('<response></response>');
}

module.exports = {
    receberMensagemWhatsapp
}