const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();

app.get('/uniq-calls', async (req, res) => {
  try {
    const response = await axios.get('https://api.uniq.app/admin/v1/calls', {
      headers: {
        Authorization: `Bearer ${process.env.UNIQ_API_KEY}`,
      },
    });

    res.json(response.data); // retorna no navegador/postman
  } catch (error) {
    console.error('Erro ao buscar chamadas do Uniq:', error.message);
    res.status(500).json({ error: 'Erro ao buscar chamadas do Uniq' });
  }
});

// se já tiver app.listen() não precisa disso, senão descomenta:
 app.listen(PORT, () =>{
   console.log(`Servidor rodando na porta ${PORT}`);
  }); 	

module.exports = app;
