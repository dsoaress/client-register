# Client Register

## 📌 Sobre o projeto

Este é um projeto de demonstração para cadastro de clientes, desenvolvido com Node.js e integrado a diversas tecnologias modernas. Ele simula um ambiente de produção com banco de dados, cache e mensageria, além de incluir testes automatizados.

A aplicação utiliza o framework **Express** e implementa uma arquitetura em camadas baseada nos princípios da **Clean Architecture**.

## 🚀 Tecnologias utilizadas

- **Node.js** (v22+)
- **Express**
- **MongoDB** com **Mongoose**
- **Redis**
- **Kafka**
- **Vitest** (testes unitários e de integração)
- **Supertest** (testes de API)

## 🐳 Como rodar localmente (modo rápido com Docker)

Se você já possui o Docker instalado, basta executar:

```bash
docker-compose up --build
```

Após isso:

- A aplicação estará disponível em:  
  [http://localhost:3000](http://localhost:3000)

- A documentação da API (Swagger) estará em:  
  [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 🛠️ Como rodar localmente (modo manual / completo)

### Pré-requisitos

- Node.js (versão 22 ou superior)
- PNPM (versão 10 ou superior)
- Docker + Docker Compose

### Passos

1. Instale as dependências do projeto:

```bash
pnpm install
```

2. Suba os containers das dependências (MongoDB, Redis e Kafka):

```bash
pnpm compose:up
```

3. Inicie a aplicação:

```bash
pnpm dev
```

4. Acesse:

- Aplicação: [http://localhost:3000](http://localhost:3000)
- Swagger (API Docs): [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## ✅ Executando os testes

Para rodar os testes:

```bash
pnpm test

# ou para modo watch:
pnpm test:watch

# ou usando a interface interativa:
pnpm test:ui
```

## 🏗️ Arquitetura do projeto

O projeto segue os princípios da **Clean Architecture**, separando bem as responsabilidades entre as camadas. Estrutura principal:

- **Domain (`src/domain/`)**  
  Contém as **entidades** e **regras de negócio** puras, sem dependências externas.

- **Application (`src/app/`)**  
  Contém os **casos de uso** e a **orquestração da lógica de aplicação**.

- **Infrastructure (`src/infra/`)**  
  Responsável pelas integrações externas, como:
  - Banco de dados
  - Cache
  - Mensageria
  - Servidor HTTP (Express)
  - Controllers e Repositórios concretos
