# TaskFlow OS (Sistema de Gestão de Ordens de Serviço e Tarefas)

Uma aplicação web fullstack moderna e elegante para pequenas empresas gerenciarem clientes, projetos, tarefas e ordens de serviço.

## Pré-requisitos

- Node.js instalado na máquina (versão 18+ recomendada)
- NPM (Node Package Manager)

## Instalação

A instalação do projeto é extremamente simples, com configuração automatizada.

1. Navegue até a raiz do projeto.
2. Execute o comando:
   ```bash
   npm install
   ```
   Este comando instalará a dependência raiz (concurrently) e, usando um script `postinstall`, instalará as dependências do `backend` e `frontend` automaticamente.

## Como rodar o projeto

1. Na raiz do projeto, execute:
   ```bash
   npm run dev
   ```
   Isso iniciará simultaneamente o servidor Backend (Node.js/Express) e a aplicação Frontend (Vue 3/Vite).
2. Acesse a aplicação frontend no seu navegador (geralmente em http://localhost:5173).
3. O backend roda em http://localhost:3000.

## Guia do Designer: Mapeamento de Imagens e Fundos

Para personalizar o visual da aplicação e substituir as imagens de fundo provisórias, consulte o arquivo detalhado de mapeamento de assets:

👉 **[Consulte o arquivo `assets_map.md` na raiz do projeto para ver todos os caminhos exatos das imagens e SVGs.](./assets_map.md)**

Nele você encontrará as orientações para os arquivos base localizados em:
`frontend/public/images/backgrounds/`

> **Nota:** Caso alguma imagem seja removida ou não carregue, a aplicação possui fallbacks elegantes usando classes de gradientes e efeitos de desfoque (backdrop-blur) implementados com Tailwind CSS.

## Arquitetura e Tecnologias

- **Backend:** Node.js, Express.js.
- **Banco de Dados:** SQLite (usando a biblioteca `better-sqlite3`).
- **Autenticação:** JWT (JSON Web Tokens) com senhas encriptadas via `bcryptjs`.
- **Frontend:** Vue.js 3 (Composition API), Vite, Pinia (Gerenciamento de Estado) e Vue Router.
- **Estilização:** Tailwind CSS focado na estética Glassmorphism, com transições fluídas e responsividade.