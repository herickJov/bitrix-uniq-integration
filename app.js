import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// Substitua este mapeamento com os usuários do seu Uniq e Bitrix
const userMap = {
  "9d1b0978-5417-4635-902b-b34eb15c0390": {
    USER_ID: 7
  }
};

app.post('/uniq-webhook', async (req, res) => {
  const data = req.body.payload;
  const subscriberId = data.subscriber;

  if (!userMap[subscriberId]) {
    return res.status(400).json({ error: 'Usuário não mapeado.' });
  }

  const userInfo = userMap[subscriberId];

  const bitrixPayload = {
    CALL_ID: data.call,
    USER_ID: userInfo.USER_ID,
    PHONE_NUMBER: data.remote.replace("tel:", ""),
    CALL_START_DATE: new Date(data.setup).toISOString(),
    CALL_DURATION: Math.floor((data.stop - data.setup) / 1000),
    CALL_FAILED_CODE: data.releaseCause,
    CALL_STATUS: 3,
    RECORD_URL: "",
    CRM_CREATE: 0
  };

  try {
    const response = await axios.post(
      'https://b24-rwd8iz.bitrix24.com.br/rest/94/e3775mpgh3qzop35/telephony.externalcall.register.json',
      bitrixPayload
    );

    res.json({ bitrixResponse: response.data });
  } catch (error) {
    console.error('Erro ao enviar para Bitrix:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao comunicar com o Bitrix' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
