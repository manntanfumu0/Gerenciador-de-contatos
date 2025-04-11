require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect(err => {
    if (err) {
        console.error("Erro ao conectar ao banco:", err);
        process.exit(1);
    }
    console.log("Banco de dados conectado!");
});

app.post('/add', (req, res) => {
    const { name, email, phone } = req.body;
    db.query(
        'INSERT INTO contatos (name, email, phone) VALUES (?, ?, ?)', 
        [name, email, phone], 
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Erro ao adicionar contato");
            }
            res.send("Contato adicionado!");
        }
    );
});

app.get('/contacts', (req, res) => {
    db.query('SELECT * FROM contatos', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao buscar contatos");
        }
        res.json(results);
    });
});

app.delete('/delete/:id', (req, res) => {
    db.query('DELETE FROM contatos WHERE id = ?', [req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao remover contato");
        }
        res.send("Contato removido!");
    });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
