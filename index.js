const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const OTP_SEND_URL = 'https://myim3app.indosatooredoo.com/api/v1/otp/send/v2';
const OTP_VALIDATE_URL = 'https://myim3app.indosatooredoo.com/api/v1/otp/validate/v2';

// Route untuk mengirim OTP
app.post('/send-otp', async (req, res) => {
    const { msisdn } = req.body;

    if (!msisdn) {
        return res.status(400).json({ error: 'Nomor telepon diperlukan' });
    }

    try {
        const response = await axios.post(OTP_SEND_URL, {
            msisdn: msisdn,
            action: 'register'
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || 'Terjadi kesalahan saat mengirim OTP'
        });
    }
});

// Route untuk memvalidasi OTP
app.post('/validate-otp', async (req, res) => {
    const { transid, otp } = req.body;

    if (!transid || !otp) {
        return res.status(400).json({ error: 'transid dan OTP diperlukan' });
    }

    try {
        const response = await axios.post(OTP_VALIDATE_URL, {
            transid: transid,
            otp: otp
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || 'Terjadi kesalahan saat memvalidasi OTP'
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
