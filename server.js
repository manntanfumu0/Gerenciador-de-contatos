// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config()

// Importa as dependências necessárias
const express = require("express") // Framework web para criar o servidor
const mysql = require("mysql2") // Biblioteca para se conectar ao MySQL
const cors = require("cors") // Middleware para permitir requisições de outros domínios
const bodyParser = require("body-parser") // Middleware para tratar o corpo das requisições HTTP

// Cria uma instância do Express para configurar o servidor
const app = express()

// Usa o middleware CORS para permitir requisições de outros domínios
app.use(cors())

// Configura o bodyParser para tratar dados JSON no corpo das requisições
app.use(bodyParser.json())

// Cria a conexão com o banco de dados MySQL usando variáveis de ambiente
const db = mysql.createConnection({
  host: process.env.DB_HOST, // Endereço do banco de dados
  user: process.env.DB_USER, // Usuário para autenticação no banco
  password: process.env.DB_PASSWORD, // Senha do usuário
  database: process.env.DB_NAME, // Nome do banco de dados
  port: process.env.DB_PORT, // Porta do banco de dados
})

// Conecta ao banco de dados e verifica se houve erro
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco:", err) // Exibe o erro caso a conexão falhe
    process.exit(1) // Encerra o processo caso a conexão falhe
  }
  console.log("Banco de dados conectado!") // Exibe sucesso na conexão
})

// Rota POST para adicionar um novo contato ao banco de dados
app.post("/add", (req, res) => {
  // Desestrutura os dados do corpo da requisição
  const { name, email, phone } = req.body

  // Verifica se já existe um contato com o mesmo email ou telefone
  db.query("SELECT * FROM contatos WHERE email = ? OR phone = ?", [email, phone], (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).send("Erro ao verificar duplicidade")
    }

    // Se encontrou algum resultado, significa que já existe um contato com esse email ou telefone
    if (results.length > 0) {
      const duplicateField = results[0].email === email ? "email" : "telefone"
      return res.status(400).send(`Já existe um contato com este ${duplicateField} cadastrado!`)
    }

    // Se não encontrou duplicidade, insere o novo contato
    db.query("INSERT INTO contatos (name, email, phone) VALUES (?, ?, ?)", [name, email, phone], (err) => {
      if (err) {
        console.error(err) // Exibe erro no console se houver falha na query
        return res.status(500).send("Erro ao adicionar contato") // Retorna erro de servidor
      }
      res.send("Contato adicionado!") // Retorna sucesso ao adicionar o contato
    })
  })
})

// Rota GET para listar todos os contatos no banco de dados
app.get("/contacts", (req, res) => {
  // Executa a query SQL para pegar todos os contatos
  db.query("SELECT * FROM contatos", (err, results) => {
    if (err) {
      console.error(err) // Exibe erro no console se houver falha na query
      return res.status(500).send("Erro ao buscar contatos") // Retorna erro de servidor
    }
    res.json(results) // Retorna a lista de contatos no formato JSON
  })
})

// Rota GET para buscar um contato específico pelo ID
app.get("/contact/:id", (req, res) => {
  db.query("SELECT * FROM contatos WHERE id = ?", [req.params.id], (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).send("Erro ao buscar contato")
    }

    if (results.length === 0) {
      return res.status(404).send("Contato não encontrado")
    }

    res.json(results[0])
  })
})

// Rota PUT para atualizar um contato existente
app.put("/update/:id", (req, res) => {
  const { name, email, phone } = req.body
  const contactId = req.params.id

  // Verifica se já existe outro contato com o mesmo email ou telefone (excluindo o contato atual)
  db.query(
    "SELECT * FROM contatos WHERE (email = ? OR phone = ?) AND id != ?",
    [email, phone, contactId],
    (err, results) => {
      if (err) {
        console.error(err)
        return res.status(500).send("Erro ao verificar duplicidade")
      }

      // Se encontrou algum resultado, significa que já existe outro contato com esse email ou telefone
      if (results.length > 0) {
        const duplicateField = results[0].email === email ? "email" : "telefone"
        return res.status(400).send(`Já existe um contato com este ${duplicateField} cadastrado!`)
      }

      // Se não encontrou duplicidade, atualiza o contato
      db.query(
        "UPDATE contatos SET name = ?, email = ?, phone = ? WHERE id = ?",
        [name, email, phone, contactId],
        (err) => {
          if (err) {
            console.error(err)
            return res.status(500).send("Erro ao atualizar contato")
          }
          res.send("Contato atualizado com sucesso!")
        },
      )
    },
  )
})

// Rota DELETE para remover um contato do banco de dados pelo ID
app.delete("/delete/:id", (req, res) => {
  // Executa a query SQL para deletar o contato pelo ID
  db.query("DELETE FROM contatos WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.error(err) // Exibe erro no console se houver falha na query
      return res.status(500).send("Erro ao remover contato") // Retorna erro de servidor
    }
    res.send("Contato removido!") // Retorna sucesso ao remover o contato
  })
})

// Inicia o servidor na porta 3000 e exibe mensagem no console
app.listen(3000, () => console.log("Servidor rodando na porta 3000"))
