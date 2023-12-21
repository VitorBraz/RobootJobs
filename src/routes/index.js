const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const path = require('path');
const axios = require('axios');
const { AES, enc } = require('crypto-js'); // Importando a biblioteca para criptografia
const fs = require('fs');

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

    if(req.cookies && req.cookies[COOKIE_ID_UUID]){

        const COOKIE_ID_UUID_GET = req.cookies[COOKIE_ID_UUID];

        if (COOKIE_ID_UUID_GET) {
            res.redirect('http://dev01.briotecnologia.com.br:3000/dashboard');
        } else {
            res.sendFile(path.join(__dirname, '..', 'views', 'login', 'index.html'));
        }
    }
    else {
        res.sendFile(path.join(__dirname, '..', 'views', 'login', 'index.html'));
    }
 
});

router.post('/', async (req, res) => {
    try {
        const formData = req.body;
        const webhookURL = 'https://api.123zap.com.br/webhook/login';
        const response = await axios.post(webhookURL, formData);

        console.log('Response Data:', response.data);

        if (response.data.validate) {
            const encryptedHash1 = encryptData(response.data.hash1, ENCRYPTION_KEY);
            const encryptedHash2 = encryptData(response.data.hash2, ENCRYPTION_KEY);
            const encryptedHash3 = encryptData(response.data.hash3, ENCRYPTION_KEY);

            res.cookie(COOKIE_ID_UUID, encryptedHash1, { maxAge: 3600000 });
            res.cookie(COOKIE_ID_NAME, encryptedHash2, { maxAge: 3600000 });
            res.cookie(COOKIE_ID_NUMB, encryptedHash3, { maxAge: 3600000 });

            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Login failed' });
        }
    } catch (error) {
        console.error('Error sending data to the webhook:', error);
        res.status(500).json({ error: 'Error sending data to the webhook' });
    }
});


router.post('/upload', upload.single('avatar'), (req, res) => {
    // Neste ponto, a imagem foi salva na pasta 'public/avatars' com o nome 'avatar.jpg'
    res.status(200).json({ message: 'Imagem salva com sucesso' });
});

module.exports = router;