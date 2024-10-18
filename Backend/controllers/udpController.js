// controllers/udpController.js
const dgram = require('dgram');

exports.sendUdpMessage = (req, res) => {
    const client = dgram.createSocket('udp4');
    const message = Buffer.from('Test Message');
    const port = 41234;
    const host = 'localhost';

    client.send(message, port, host, (err) => {
        if (err) {
            res.status(500).json({ message: 'Error sending UDP message', error: err.message });
        } else {
            console.log(`UDP message sent to ${host}:${port}`);
            res.status(200).json({ message: 'UDP message sent successfully' });
        }
        client.close();
    });
};
