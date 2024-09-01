# Projeto CRUD com Node.js, Sequelize e PostgreSQL

## Visão Geral

Este guia descreve como configurar um projeto CRUD básico usando Node.js, Sequelize como ORM e PostgreSQL como banco de dados. O projeto é integrado com Docker para facilitar o desenvolvimento e a implantação.

## Estrutura do Projeto

```
my-crud-app/
│
├── config/
│   └── config.js            # Configurações do Sequelize
│
├── migrations/
│   └── ...                  # Arquivos de migração gerados pelo Sequelize CLI
│
├── models/
│   ├── index.js             # Arquivo para configurar e exportar modelos Sequelize
│   └── user.js              # Modelo do usuário
│
├── seeders/
│   └── ...                  # Arquivos de seeders para dados iniciais
│
├── routes/
│   └── userRoutes.js        # Arquivo de rotas para operações CRUD de usuário
│
├── .env                     # Variáveis de ambiente (configuração de banco de dados, etc.)
├── .gitignore               # Arquivos e diretórios a serem ignorados pelo Git
├── .sequelizerc             # Arquivo de configuração do Sequelize CLI
├── Dockerfile               # Dockerfile para construir a imagem Docker
├── docker-compose.yml       # Arquivo Docker Compose para orquestrar serviços
├── package.json             # Lista de dependências do projeto e scripts npm
├── package-lock.json        # Arquivo de bloqueio de dependências do npm
└── server.js                # Arquivo principal do servidor Express
```

## 1. Configuração Inicial do Projeto

### 1.1. Criar um Novo Projeto e Inicializar o Node.js

```bash
mkdir my-crud-app
cd my-crud-app
npm init -y
```

### 1.2. Instalar Dependências

```bash
npm install express sequelize pg pg-hstore dotenv
npm install --save-dev sequelize-cli
```

### 1.3. Configurar o Sequelize CLI

Crie um arquivo `.sequelizerc` na raiz do projeto:

```javascript
const path = require('path');

module.exports = {
  config: path.resolve('config', 'config.js'),
  'models-path': path.resolve('models'),
  'migrations-path': path.resolve('migrations'),
  'seeders-path': path.resolve('seeders')
};
```

## 2. Configuração do Banco de Dados

### 2.1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```plaintext
POSTGRES_USER=postgres
POSTGRES_PASSWORD=admin
POSTGRES_DB=mydatabase
DB_HOST=db
DB_PORT=5432
NODE_ENV=development
PORT=3000
```

### 2.2. Configurar o Sequelize

Crie um diretório `config` e dentro dele, um arquivo `config.js`:

```javascript
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
  test: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
  },
};
```

## 3. Inicializar o Sequelize e Criar um Modelo

### 3.1. Inicializar o Sequelize

```bash
npx sequelize-cli init
```

### 3.2. Criar um Modelo e Migração

```bash
npx sequelize-cli model:generate --name User --attributes name:string,email:string,password:string
```

### 3.3. Executar Migrações

```bash
npx sequelize-cli db:migrate
```

## 4. Configuração do Servidor Express

### 4.1. Criar o Servidor Express

Crie um arquivo `server.js` na raiz do projeto:

```javascript
require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => console.log('Error: ' + err));
```

## 5. Implementar Rotas CRUD

### 5.1. Criar Arquivo de Rotas

Crie um arquivo `routes/userRoutes.js` para definir as rotas do CRUD:

```javascript
const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Create a new user
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a user by ID
router.put('/users/:id', async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedUser = await User.findByPk(req.params.id);
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
```

## 6. Configuração do Docker

### 6.1. Criar Dockerfile

Crie um arquivo `Dockerfile` na raiz do projeto:

```Dockerfile
# Usar uma imagem base do Node.js
FROM node:18

# Definir diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todos os arquivos para o contêiner
COPY . .

# Expor a porta que o aplicativo Node.js usará
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
```

### 6.2. Criar docker-compose.yml

Crie um arquivo `docker-compose.yml` na raiz do projeto:

```yaml
version: '3.9'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=admin
      - POSTGRES_DB=mydatabase
      - DB_HOST=db
      - DB_PORT=5432
      - NODE_ENV=development
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: admin
      POSTGRES_DB=mydatabase
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### 6.3. Inicializar Contêineres

Use os seguintes comandos para construir e iniciar os contêineres:

```bash
docker-compose up --build
```

Para parar e remover os contêineres:

```bash
docker-compose down
```

## 7. Testar o CRUD

Agora, você pode usar ferramentas como Postman, Insomnia, ou até mesmo cURL para testar suas rotas CRUD:



- **Criar Usuário:** `POST /api/users` com um corpo JSON contendo `name`, `email`, `password`.
- **Listar Usuários:** `GET /api/users`
- **Obter Usuário por ID:** `GET /api/users/:id`
- **Atualizar Usuário por ID:** `PUT /api/users/:id` com o corpo JSON contendo os campos a serem atualizados.
- **Deletar Usuário por ID:** `DELETE /api/users/:id`

## Conclusão

Este projeto é uma base sólida para criar um CRUD usando Node.js, Sequelize e PostgreSQL, todos integrados via Docker. Com essa configuração, é possivel facilmente desenvolver, testar e implantar sua aplicação de maneira eficiente e escalável. O uso de Docker facilita a replicação do ambiente de desenvolvimento e implantação em diferentes plataformas, garantindo consistência e minimizando problemas de configuração. A partir dessa base, fica facil, expandir a aplicação para incluir funcionalidades mais avançadas, como autenticação e controle de acesso.








--- 
