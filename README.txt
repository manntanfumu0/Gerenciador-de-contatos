Executando o Sistema

1. Iniciar o Servidor
Para iniciar o servidor Node.js, abra um terminal na pasta do projeto e execute: "node server.js"
Você deverá ver a mensagem: "Servidor rodando na porta 3000" e "Banco de dados conectado!"

**IMPORTANTE**: Mantenha esta janela do terminal aberta enquanto estiver usando o sistema.

### 2. Acessar o Sistema

Após iniciar o servidor, você pode acessar o sistema de duas maneiras:

- **Opção 1**: Abra o arquivo `index.html` diretamente no seu navegador
- **Opção 2**: Acesse `http://localhost:3000` no seu navegador (se você configurou o servidor para servir os arquivos estáticos)

## Funcionalidades

### Cadastro de Contatos

1. Na página inicial, clique em "Seus Contatos"
2. Clique em "Cadastrar Novo Contatos"
3. Preencha os campos de nome, email e telefone
4. Clique em "Cadastrar"

O sistema verificará automaticamente se já existe um contato com o mesmo email ou telefone.

### Edição de Contatos

1. Na página de contatos, localize o contato que deseja editar
2. Clique no botão "Editar" ao lado do contato
3. Modifique os campos desejados no modal que aparece
4. Clique em "Salvar" para confirmar as alterações

### Remoção de Contatos

1. Na página de contatos, localize o contato que deseja remover
2. Clique no botão "Remover" ao lado do contato
3. Confirme a remoção na caixa de diálogo que aparece

### Busca de Contatos

- Na página de contatos, digite o termo de busca no campo de pesquisa
- Os resultados serão filtrados automaticamente conforme você digita

## Solução de Problemas

### O servidor não inicia

- Verifique se o Node.js está instalado corretamente (execute `node --version` no terminal)
- Verifique se o arquivo `.env` está na pasta raiz do projeto
- Verifique se as credenciais do banco de dados no arquivo `.env` estão corretas

### Erro de conexão com o banco de dados

- Verifique sua conexão com a internet
- Verifique se o servidor de banco de dados online está acessível
- Verifique se as credenciais no arquivo `.env` estão corretas

### Erro ao cadastrar ou editar contatos

- Verifique se o email ou telefone já não estão cadastrados para outro contato
- Verifique se todos os campos obrigatórios foram preenchidos

## Encerrando o Servidor

Para encerrar o servidor Node.js, pressione `Ctrl+C` no terminal onde ele está sendo executado.

## Suporte

Em caso de problemas ou dúvidas, entre em contato com a equipe de suporte da Almanaque.