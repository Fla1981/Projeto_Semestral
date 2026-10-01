# Cadastro e Lista de Recados

Projeto semestral de Laboratório de Desenvolvimento Web: um sistema full-stack de recados pessoais, com autenticação e gerenciamento de recados por usuário.

## Tecnologias

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Laravel 13 + Laravel Sanctum
- **Banco de dados:** MySQL 8 (Eloquent + migrations)
- **API externa:** PokéAPI (https://pokeapi.co)

## Funcionalidades (Entrega Parcial)

- Cadastro de usuário (nome, e-mail e senha)
- Login e logout
- Rotas protegidas: a página de recados só abre com o usuário logado
- Lista de recados do usuário logado (título, texto e data)
- Adicionar, editar e excluir recados, com a lista atualizada sem recarregar a página
- Consulta à API pública PokéAPI na tela de recados

## Como a autenticação funciona

O projeto usa o modo **SPA do Laravel Sanctum**, com sessão em cookie:

- No login, o back-end valida as credenciais e cria a sessão. O navegador recebe o cookie `laravel_session`, marcado como **HttpOnly**, então o JavaScript não consegue ler a credencial. Nada é guardado em `localStorage`.
- No logout, o back-end invalida a sessão e gera um novo token CSRF.
- O cookie `XSRF-TOKEN` fica legível de propósito: o Axios o lê e o envia no cabeçalho `X-XSRF-TOKEN`, que é a proteção contra CSRF. Ele não é uma credencial de login.
- O front não consegue ver o cookie de sessão, então a proteção de rotas pergunta ao back-end (`GET /api/user`) se existe sessão válida. Se a resposta for 401, o usuário volta para o login.

## Pré-requisitos

- Node.js 20+
- PHP 8.5+ (testado com 8.5), com as extensões `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `curl` e `zip` ativas
- Composer 2
- MySQL 8 rodando

## Como rodar

### 1. Banco de dados

Crie um banco vazio:

```sql
CREATE DATABASE recados CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
composer install
cp .env.example .env      # no Windows (cmd): copy .env.example .env
```

Edite o `.env` com as credenciais do seu MySQL e confira estas variáveis:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=recados
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
SESSION_DOMAIN=localhost
SESSION_SAME_SITE=lax
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

Depois:

```bash
php artisan key:generate
php artisan migrate
php artisan serve
```

A API fica em `http://localhost:8000`.

### 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O app abre em `http://localhost:5173`.

## API

Todas as rotas ficam sob `http://localhost:8000/api`. Antes de `login` e `register`, o front chama `GET /sanctum/csrf-cookie` para receber o cookie CSRF.

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/api/register` | não | Cria a conta. Corpo: `name`, `email`, `password`, `password_confirmation`. Retorna `201` com o usuário. |
| POST | `/api/login` | não | Autentica e cria a sessão. Corpo: `email`, `password`. Retorna o usuário, ou `401` se as credenciais forem inválidas. |
| POST | `/api/logout` | sim | Encerra a sessão. |
| GET | `/api/user` | sim | Retorna `id`, `name` e `email` do usuário logado. |
| GET | `/api/recados` | sim | Lista os recados do usuário logado. |
| POST | `/api/recados` | sim | Cria um recado. Corpo: `titulo`, `texto`. |
| GET | `/api/recados/{id}` | sim | Mostra um recado. |
| PUT | `/api/recados/{id}` | sim | Edita um recado. Corpo: `titulo`, `texto`. |
| DELETE | `/api/recados/{id}` | sim | Exclui um recado. |

Erros de validação retornam `422` com as mensagens por campo. Rotas protegidas sem sessão retornam `401`.

## API externa: PokéAPI

Na tela de recados há o campo **Buscar Pokémon**. O usuário digita o nome (por exemplo, `pikachu`) e a tela mostra a imagem, o tipo, a altura e o peso, vindos de `https://pokeapi.co/api/v2/pokemon/{nome}`.

**Justificativa:** a PokéAPI é pública, gratuita, não exige chave de API e devolve JSON simples e bem documentado. Isso permitiu demonstrar o consumo de uma API externa pelo front-end sem expor segredos nem depender de cadastro.

## Estrutura do repositório

```
Projeto_Semestral/
├── backend/                 # Laravel 13 (API)
│   ├── app/Http/Controllers # AuthController, RecadoController
│   ├── routes/api.php       # rotas da API
│   └── database/migrations  # migrations versionadas
├── frontend/                # React (Vite)
│   └── src/
│       ├── Paginas/         # Login, Registro, Recados
│       ├── Components/      # PrivateRoute
│       └── Servicos/        # Api, AuthService, RecadosService, PokemonService
└── README.md
```

## Problemas comuns

- **`No application encryption key has been specified`:** rode `php artisan key:generate` e reinicie o `php artisan serve`.
- **`Access denied for user 'root'`:** confira `DB_USERNAME` e `DB_PASSWORD` no `.env` e rode `php artisan config:clear`.
- **`could not find driver`:** ative a extensão `pdo_mysql` no `php.ini`.
- **Login retorna 419 ou 401 mesmo com a senha certa:** confira se o front está na porta listada em `SANCTUM_STATEFUL_DOMAINS` e se a origem consta em `config/cors.php`.

## Equipe

- [Ricardo Silva Godoi]
- [Matheus Cappi]
- [Luis Felipe]
- [Renan Stella]
- [Caia Braga]

## Convenção de commits

Mensagens no padrão `feat:`, `fix:`, `style:`, `docs:`, `test:`.
