const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const path = require('path');
const axios = require('axios');
const { AES, enc } = require('crypto-js'); // Importando a biblioteca para criptografia
const fs = require('fs');
const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'robootjobsdb',
};

function getFileExtension(fileName) {
    return path.extname(fileName).slice(1);
}

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/avatars'); // Define o diretório onde a imagem será salva
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // O nome do arquivo será o mesmo que o original enviado do cliente
    }
});

const upload = multer({ storage: storage });


router.use(bodyParser.json());

require('dotenv').config();

// Função para criptografar os dados
function encryptData(data, encryptionKey) {
    return AES.encrypt(data, encryptionKey).toString(); // Utilizando o método da biblioteca CryptoJS
}


const getImagePath = (hash) => {
    // Lógica para mapear o hash a um caminho de arquivo (pasta 'avatars', por exemplo)
    // Isso pode envolver banco de dados, sistemas de arquivos, etc.
    return path.join(__dirname, '..', 'public', 'avatars', hash);
};

router.get('/images/:hash', (req, res) => {
    const { hash } = req.params;
    const imagePath = getImagePath(hash);

    try {
        const buffer = fs.readFileSync(imagePath);
        const fileExtension = getFileExtension(imagePath);

        let contentType = '';

        // Mapeamento da extensão do arquivo para o tipo MIME
        switch (fileExtension) {
            case 'jpg':
                contentType = 'image/jpeg';
                break;
            case 'png':
                contentType = 'image/png';
                break;
            // Adicione mais extensões e tipos MIME conforme necessário
            default:
                contentType = 'application/octet-stream';
                break;
        }

        if (contentType !== 'application/octet-stream') {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(buffer, 'binary');
        } else {
            res.sendStatus(200);
        }
    } catch (error) {
        console.error('Arquivo não encontrado:', error);
        res.sendStatus(404);
    }
});
const COOKIE_ID_UUID = process.env.COOKIE_ID_UUID;
const COOKIE_ID_NAME = process.env.COOKIE_ID_NAME;
const COOKIE_ID_NUMB = process.env.COOKIE_ID_NUMB;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

router.get('/', (req, res) => {
    const COOKIE_ID_UUID_GET = req.cookies[COOKIE_ID_UUID];
    const COOKIE_ID_NAME_GET = req.cookies[COOKIE_ID_NAME];
    const COOKIE_ID_NUMB_GET = req.cookies[COOKIE_ID_NUMB];
    const ENCRYPTION_KEY_GET = req.cookies[ENCRYPTION_KEY];

    if (COOKIE_ID_UUID_GET) {
        res.redirect('http://localhost:3001/dashboard');
    } else {
        res.sendFile(path.join(__dirname, '..', 'views', 'login', 'index.html'));
    }
});


router.post('/', async (req, res) => {
    try {

        const connection = await mysql.createConnection(dbConfig);

        let [result] = await connection.execute(`
    SELECT 
        CASE 
            WHEN EXISTS (
                SELECT 1
                FROM users
                WHERE email = '${req.body.username}' AND password = MD5('${req.body.password}')
            ) THEN true
            ELSE false
        END AS validate,
        CASE 
            WHEN EXISTS (
                SELECT 1
                FROM users
                WHERE email = '${req.body.username}' AND password = MD5('${req.body.password}')
            ) THEN (SELECT uuid FROM users WHERE email = '${req.body.username}' AND password = MD5('${req.body.password}'))
            ELSE null
        END AS user_uuid,
        name,
        id
    FROM users
    WHERE email = '${req.body.username}' AND password = MD5('${req.body.password}');
`);

        connection.end();
        console.log(result[0])
        if (result[0].validate && result[0].user_uuid && result[0].name && result[0].id) {
            // Assuming these properties are present in the result object
            const encryptedHash1 = encryptData(result[0].user_uuid, ENCRYPTION_KEY);
            const encryptedHash2 = encryptData(result[0].name, ENCRYPTION_KEY);
            const encryptedHash3 = encryptData(result[0].id.toString(), ENCRYPTION_KEY);

            res.cookie(COOKIE_ID_UUID, encryptedHash1, { maxAge: 3600000 });
            res.cookie(COOKIE_ID_NAME, encryptedHash2, { maxAge: 3600000 });
            res.cookie(COOKIE_ID_NUMB, encryptedHash3, { maxAge: 3600000 });

            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Login failed' });
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ error: 'Error during authentication' });
    }
});



router.post('/upload', upload.single('avatar'), (req, res) => {
    // Neste ponto, a imagem foi salva na pasta 'public/avatars' com o nome 'avatar.jpg'
    res.status(200).json({ message: 'Imagem salva com sucesso' });
});

module.exports = router;