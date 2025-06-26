const express = require('express');
const router = express.Router();
const { receberMensagemWhatsapp } = require('../controllers/whatsappController');

router.post('/webhook', receberMensagemWhatsapp);

module.exports = router;