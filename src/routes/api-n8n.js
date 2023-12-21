const express = require('express');
const router = express.Router();
const axios = require('axios');
const { AES, enc } = require('crypto-js'); // Importando a biblioteca para criptografia
const cookieParser = require('cookie-parser'); // Importando o pacote 'cookie-parser'

const COOKIE_ID_UUID = process.env.COOKIE_ID_UUID;
const COOKIE_ID_NAME = process.env.COOKIE_ID_NAME;
const COOKIE_ID_NUMB = process.env.COOKIE_ID_NUMB;
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

function decryptData(decryptData) {
    const decodedCookieValue = decodeURIComponent(decryptData);
    const decrypted = AES.decrypt(decodedCookieValue, ENCRYPTION_KEY).toString(enc.Utf8);
    console.log('oi', decrypted);
    return decrypted;
}

router.use(cookieParser());

router.get('/instances', async (req, res) => {
    try {
        const cookieValueUUID = req.cookies[COOKIE_ID_UUID];
        const cookieValueNAME = req.cookies[COOKIE_ID_NAME];
        const cookieValueNUMB = req.cookies[COOKIE_ID_NUMB];

        const decryptedUUID = decryptData(cookieValueUUID);
        const decryptedName = decryptData(cookieValueNAME);
        const decryptedNUMB = decryptData(cookieValueNUMB);

        const data = {
            decryptedUUID,
            decryptedName,
            decryptedNUMB
        };

        const response = await axios.post('https://api.123zap.com.br/webhook/InstancesConnection', data);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao obter dados da API:', error);
        res.status(500).json({ error: 'Erro ao obter dados da API' });
    }
});


router.get('/dashboard', async (req, res) => {
    try {
        const cookieValueUUID = req.cookies[COOKIE_ID_UUID];
        const cookieValueNAME = req.cookies[COOKIE_ID_NAME];
        const cookieValueNUMB = req.cookies[COOKIE_ID_NUMB];

        const decryptedUUID = decryptData(cookieValueUUID);
        const decryptedName = decryptData(cookieValueNAME);
        const decryptedNUMB = decryptData(cookieValueNUMB);

        const data = {
            decryptedUUID,
            decryptedName,
            decryptedNUMB
        };

        const response = await axios.post('https://api.123zap.com.br/webhook/DashboardData', data);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao obter dados da API:', error);
        res.status(500).json({ error: 'Erro ao obter dados da API' });
    }
});



router.get('/processos', async (req, res) => {
    try {
        const cookieValueUUID = req.cookies[COOKIE_ID_UUID];
        const cookieValueNAME = req.cookies[COOKIE_ID_NAME];
        const cookieValueNUMB = req.cookies[COOKIE_ID_NUMB];

        const decryptedUUID = decryptData(cookieValueUUID);
        const decryptedName = decryptData(cookieValueNAME);
        const decryptedNUMB = decryptData(cookieValueNUMB);

        const data = {
            decryptedUUID,
            decryptedName,
            decryptedNUMB
        };

        const response = await axios.post('https://api.123zap.com.br/webhook/Processos', data);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao obter dados da API:', error);
        res.status(500).json({ error: 'Erro ao obter dados da API' });
    }
});

router.post('/configuration-instances', async (req, res) => {
    try {
        const cookieValueUUID = req.cookies[COOKIE_ID_UUID];
        const cookieValueNAME = req.cookies[COOKIE_ID_NAME];
        const cookieValueNUMB = req.cookies[COOKIE_ID_NUMB];

        const decryptedUUID = decryptData(cookieValueUUID);
        const decryptedName = decryptData(cookieValueNAME);
        const decryptedNUMB = decryptData(cookieValueNUMB);

        const data = {
            decryptedUUID,
            decryptedName,
            decryptedNUMB
        };

        const response = await axios.post('https://api.123zap.com.br/webhook/GetConfiguration', data);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao obter dados da API:', error);
        res.status(500).json({ error: 'Erro ao obter dados da API' });
    }
});


router.post('/save-configuration-instances', async (req, res) => {
    try {
        const cookieValueUUID = req.cookies[COOKIE_ID_UUID];
        const cookieValueNAME = req.cookies[COOKIE_ID_NAME];
        const cookieValueNUMB = req.cookies[COOKIE_ID_NUMB];

        const decryptedUUID = decryptData(cookieValueUUID);
        const decryptedName = decryptData(cookieValueNAME);
        const decryptedNUMB = decryptData(cookieValueNUMB);

        const data = {
            decryptedUUID,
            decryptedName,
            decryptedNUMB,
            ...req.body 

        };

        const response = await axios.post('https://api.123zap.com.br/webhook/SaveConfiguration', data);
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao obter dados da API:', error);
        res.status(500).json({ error: 'Erro ao obter dados da API' });
    }
});

router.post('/add-instances', async (req, res) => {
    try {
        const cookieValueUUID = req.cookies[COOKIE_ID_UUID];
        const cookieValueNAME = req.cookies[COOKIE_ID_NAME];
        const cookieValueNUMB = req.cookies[COOKIE_ID_NUMB];

        const decryptedUUID = decryptData(cookieValueUUID);
        const decryptedName = decryptData(cookieValueNAME);
        const decryptedNUMB = decryptData(cookieValueNUMB);

        const data = {
            decryptedUUID,
            decryptedName,
            decryptedNUMB,
            'instanceName': req.body.instanceName
        };

        try {
            const response = await axios.post('https://api.123zap.com.br/webhook/add-instance', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            res.json(response.data);
        } catch (error) {
            console.error('Erro na solicitação axios.post:', error);
            res.status(500).json({ error: 'Erro na solicitação axios.post' });
        }
    } catch (error) {
        console.error('Erro ao obter dados da API:', error);
        res.status(500).json({ error: 'Erro ao obter dados da API' });
    }
});



router.post('/check-instances', async (req, res) => {
    try {
        const cookieValueUUID = req.cookies[COOKIE_ID_UUID];
        const cookieValueNAME = req.cookies[COOKIE_ID_NAME];
        const cookieValueNUMB = req.cookies[COOKIE_ID_NUMB];

        const decryptedUUID = decryptData(cookieValueUUID);
        const decryptedName = decryptData(cookieValueNAME);
        const decryptedNUMB = decryptData(cookieValueNUMB);

        console.log('olaaaaaaaaaaaaaa11',req.body)
        
        const data = {
            decryptedUUID,
            decryptedName,
            decryptedNUMB,
            'instanceName': req.body.instanceName
        };

        try {
            const response = await axios.post('https://api.123zap.com.br/webhook/checkInstance', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            res.json(response.data);
        } catch (error) {
            console.error('Erro na solicitação axios.post:', error);
            res.status(500).json({ error: 'Erro na solicitação axios.post' });
        }
    } catch (error) {
        console.error('Erro ao obter dados da API:', error);
        res.status(500).json({ error: 'Erro ao obter dados da API' });
    }
});


module.exports = router;
