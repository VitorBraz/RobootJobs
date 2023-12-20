const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // Escolha a porta desejada

app.use(bodyParser.json());

// Rota para receber os dados do N8N
app.post('/webhook', (req, res) => {
  try {
    // Extraia os dados do corpo da solicitação
    const data = req.body[0];

    // Exiba os dados no console (apenas para teste)
    console.log('Dados recebidos:', data);

    res.status(200).json({ message: 'Webhook testado com sucesso!' });
  } catch (error) {
    console.error('Erro ao processar o webhook:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Inicie o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
