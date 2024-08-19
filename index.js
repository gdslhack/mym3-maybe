const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const OTP_SEND_URL = 'https://myim3app.indosatooredoo.com/api/v1/otp/send/v2';
const OTP_VALIDATE_URL = 'https://myim3app.indosatooredoo.com/api/v1/otp/validate/v2';

// Token OAuth dari header yang diterima
const OAUTH_TOKEN = '602296CAA3E13D06345EAF256E4F0FB97A3651C28D76F17939233E3B29C9B54F60383585CED3F84DC40D749D82EEFE653B242DEB5BCE290AB3298C96015C165B';

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
        }, {
            headers: {
                'Authorization': `Bearer ${OAUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
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
        }, {
            headers: {
                'Authorization': `Bearer ${OAUTH_TOKEN}`,
                'Content-Type': 'application/json'
            }
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
