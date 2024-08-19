const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Halaman untuk memasukkan nomor HP
app.get('/', (req, res) => {
  res.send(`
    <form action="/request-otp" method="post">
      <label for="phone">Masukkan Nomor HP:</label>
      <input type="text" id="phone" name="phone" required>
      <button type="submit">Kirim OTP</button>
    </form>
  `);
});

// Mengirim OTP ke nomor HP yang dimasukkan
app.post('/request-otp', (req, res) => {
  const phone = req.body.phone;
  
  const curlCommand = `
    curl -X POST "https://myim3app.indosatooredoo.com/api/v1/otp/send/v2" \
    -H "Content-Type: application/json" \
    -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36" \
    -H "Referer: https://myim3app.indosatooredoo.com/#/login" \
    -d '{
      "msisdn": "${phone}"
    }'
  `;

  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      res.send(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      res.send(`Stderr: ${stderr}`);
      return;
    }

    res.send(`
      <p>OTP telah dikirim ke nomor ${phone}</p>
      <form action="/validate-otp" method="post">
        <input type="hidden" name="phone" value="${phone}">
        <label for="otp">Masukkan OTP:</label>
        <input type="text" id="otp" name="otp" required>
        <button type="submit">Validasi OTP</button>
      </form>
    `);
  });
});

// Memvalidasi OTP yang dimasukkan
app.post('/validate-otp', (req, res) => {
  const phone = req.body.phone;
  const otp = req.body.otp;

  const curlCommand = `
    curl -X POST "https://myim3app.indosatooredoo.com/api/v1/otp/validate/v2" \
    -H "Content-Type: application/json" \
    -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36" \
    -H "Referer: https://myim3app.indosatooredoo.com/#/login" \
    -d '{
      "msisdn": "${phone}",
      "otp": "${otp}"
    }'
  `;

  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      res.send(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      res.send(`Stderr: ${stderr}`);
      return;
    }

    res.send(`
      <p>OTP valid! Login berhasil.</p>
      <pre>${stdout}</pre>
    `);
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
