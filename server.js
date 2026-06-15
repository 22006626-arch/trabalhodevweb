const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',
    database: 'gemeos_aniversario',
    port: 3306
});
db.on('error', (err) => {
    console.error('[MySQL Erro de Conexão]:', err.code);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
        console.log('Tentando ignorar queda de conexão para manter o servidor vivo...');
    }
});
db.connect(err => {
    if (err) {
        console.error('Erro inicial ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao banco Gêmeos de Aniversário!');
});
app.get('/api/gemeos', (req, res) => {
    db.query('SELECT * FROM gemeos_salvos ORDER BY data_descoberta DESC', (err, results) => {
        if (err) {
            console.error('Erro na busca do banco:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
app.post('/api/gemeos', (req, res) => {
    const { nome, detalhes } = req.body;
    db.query('INSERT INTO gemeos_salvos (nome, detalhes) VALUES (?, ?)', [nome, detalhes], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco:', err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, nome, detalhes });
    });
});
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor backend ativo na porta ${PORT}`));