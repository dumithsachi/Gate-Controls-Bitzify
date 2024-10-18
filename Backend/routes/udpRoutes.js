// routes/udpRoutes.js
const express = require('express');
const router = express.Router();
const { sendUdpMessage } = require('../controllers/udpController');

router.get('/send-udp', sendUdpMessage);

module.exports = router;
