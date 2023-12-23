const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const moment = require('moment');
const path = require('path'); // Adicione esta linha
const routes = require('./src/routes/index.js');
const apiN8NRouter = require('./src/routes/api-n8n');

const app = express();
const PORT = 3000;
app.use(cookieParser());


app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3001', // Substitua pelo domínio do seu frontend
  credentials: true // Se você estiver enviando credenciais, como cookies
}));


const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'robootjobsdb',
};

// Configuração do middleware cookie-parser

// Configuração do mecanismo de modelo EJS
app.set('view engine', 'ejs');

// Define o diretório de visualizações
app.set('views', path.join(__dirname, 'src', 'views'));

// Define o diretório 'src/public' como o diretório de recursos estáticos
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Usa as rotas definidas em src/routes/index.js
app.use('/', routes);
app.use('/api/n8n', apiN8NRouter);


// Adiciona uma rota para servir o arquivo CSS diretamente


app.post('/receivedjob', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Extraia os dados do corpo da solicitação
    const data = req.body;

    // Converta a string de data para o formato desejado
    const formattedTimestamp = moment(data['timestamp'], 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

    // Construa a consulta
    const query = `
      INSERT INTO vagas 
      SET 
        publicar_vaga = ?,
        timestamp = ?,
        nome_empresa = ?,
        responsavel = ?,
        telefone = ?,
        confidencial = ?,
        titulo = ?,
        habilidades = ?,
        horario = ?,
        email = ?,
        autorizacao = ?;
    `;

    // Mapeie os dados do JSON para os nomes de coluna corretos
    const queryParams = [
      data['publicar_vaga'],
      formattedTimestamp, // Use a data formatada aqui
      data['nome_empresa'],
      data['responsavel'],
      data['telefone'],
      data['confidencial'],
      data['titulo'],
      data['habilidades'],
      data['horario'],
      data['email'],
      data['autorizacao']
    ];

    // Insira os dados no banco de dados
    await connection.execute(query, queryParams);

    // Feche a conexão
    await connection.end();

    res.status(200).json({ message: 'Dados Inseridos com sucesso!' });
  } catch (error) {
    console.error('Erro ao processar o dados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


// Rota para obter os dados para o dashboard
app.get('/dashboarddata', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Construa a consulta para obter os dados do dashboard
    const query = `
      SELECT
        COUNT(*) AS total_vagas,
        SUM(CASE WHEN publicar_vaga = 'SIM' THEN 1 ELSE 0 END) AS vagas_publicadas,
        SUM(CASE WHEN confidencial = 'Sim' THEN 1 ELSE 0 END) AS vagas_confidenciais,
        COUNT(DISTINCT nome_empresa) AS total_empresas,
        TIMESTAMPDIFF(HOUR, (SELECT MIN(timestamp) FROM vagas), (SELECT MAX(timestamp) FROM vagas)) AS horas_entre_primeira_e_ultima_publicacao,
        (SUM(CASE WHEN confidencial = 'Sim' THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS taxa_vagas_confidenciais,
        AVG(TIMESTAMPDIFF(HOUR, (SELECT MIN(timestamp) FROM vagas), (SELECT MAX(timestamp) FROM vagas))) AS media_horas_entre_publicacoes,
        AVG(LENGTH(habilidades) - LENGTH(REPLACE(habilidades, '*', '')) + 1) AS media_habilidades_por_vaga
      FROM
        vagas;
    `;

    // Execute a consulta
    const [results] = await connection.execute(query);

    // Feche a conexão
    await connection.end();

    // Envie os resultados como resposta
    res.status(200).json(results[0]);
  } catch (error) {
    console.error('Erro ao obter dados do dashboard:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
