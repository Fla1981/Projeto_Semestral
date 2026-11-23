# Cadastro e Lista de Recados

Projeto semestral de Laboratório de Desenvolvimento Web: um sistema full-stack de recados pessoais, com autenticação, anexos (imagem ou PDF), papéis de usuário (usuário comum e administrador) e um painel de moderação.

## Tecnologias

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Laravel 13 + Laravel Sanctum
- **Banco de dados:** SQLite (execução com Docker) ou MySQL 8 (execução manual), sempre com Eloquent e migrations versionadas
- **Armazenamento de arquivos:** Laravel Storage (disco privado)
- **Infraestrutura:** Docker e Docker Compose
- **API externa:** PokéAPI (https://pokeapi.co)

## Funcionalidades

- Cadastro de usuário (nome, e-mail e senha), login e logout
- Rotas protegidas: a página de recados só abre com o usuário logado
- Lista de recados do usuário logado (título, texto e data)
- Adicionar, editar e excluir recados, com a lista atualizada sem recarregar a página
- Anexo opcional por recado (imagem ou PDF, até 5 MB), com download protegido
- Papéis de usuário: usuário comum e administrador
- Painel de moderação do administrador: lista os recados de todos os usuários, baixa anexos e exclui recados
- Gerenciamento de usuários pelo administrador: cadastrar (comum ou administrador), editar e excluir
- Consulta à API pública PokéAPI na tela de recados

## Como rodar

### Com Docker (recomendado)

Pré-requisito: Docker com Docker Compose.

```bash
docker compose up --build
```

Na subida, o back-end cria sozinho o `.env` (a partir do `.env.example`), gera a chave da aplicação, aplica as migrations e cria o usuário administrador. Depois:

- **Front-end:** http://localhost:5173
- **API:** http://localhost:8000

O banco do Docker é um arquivo SQLite (`backend/database/database.sqlite`), criado do zero na primeira subida. Para começar com o banco vazio de novo:

```bash
docker compose down
# apague o arquivo backend/database/database.sqlite
docker compose up --build
```

Os comandos do Laravel devem ser executados **dentro do container**, e não no computador:

```bash
docker compose exec backend php artisan migrate:status
docker compose exec backend php artisan db:seed --class=AdminSeeder
docker compose logs -f backend
```

### Usuário administrador

O administrador é criado por um seeder (`AdminSeeder`), a partir de duas variáveis do `backend/.env`:

```env
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
```

Os valores padrão para desenvolvimento estão em `backend/.env.example`. No Docker o seeder roda sozinho a cada subida (não duplica o usuário, porque a busca é pelo e-mail). Entre no sistema com esse e-mail e senha: o botão **Painel Admin** aparece no cabeçalho da tela de recados. Se `ADMIN_PASSWORD` não estiver definido, o seeder avisa e não cria o usuário.

### Sem Docker

Pré-requisitos: Node.js 20+, PHP 8.4+ (testado com 8.5) com as extensões `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `curl` e `zip` ativas, Composer 2 e MySQL 8 rodando.

**1. Banco de dados**

```sql
CREATE DATABASE recados CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**2. Backend**

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
php artisan db:seed --class=AdminSeeder
php artisan serve
```

A API fica em `http://localhost:8000`. Para aceitar anexos de até 5 MB, o `php.ini` precisa de `upload_max_filesize = 10M` e `post_max_size = 12M` (o padrão do PHP é 2 MB).

**3. Frontend** (em outro terminal)

```bash
cd frontend
npm install
npm run dev
```

O app abre em `http://localhost:5173`. Não rode o front manualmente enquanto o front do Docker estiver no ar: as duas execuções disputam a mesma porta.

## Como a autenticação funciona

O projeto usa o modo **SPA do Laravel Sanctum**, com sessão em cookie:

- No login, o back-end valida as credenciais e cria a sessão. O navegador recebe o cookie `laravel_session`, marcado como **HttpOnly**, então o JavaScript não consegue ler a credencial. Nada é guardado em `localStorage`.
- No logout, o back-end invalida a sessão e gera um novo token CSRF.
- O cookie `XSRF-TOKEN` fica legível de propósito: o Axios o lê e o envia no cabeçalho `X-XSRF-TOKEN`, que é a proteção contra CSRF. Ele não é uma credencial de login.
- O front não consegue ver o cookie de sessão, então a proteção de rotas pergunta ao back-end (`GET /api/user`) se existe sessão válida. Se a resposta for 401, o usuário volta para o login.
- As senhas são guardadas com hash (bcrypt, padrão do Laravel). Os segredos (`APP_KEY`, credenciais do banco, senha do administrador) ficam no `.env`, fora do código-fonte.

## Papéis de usuário (RBAC)

O papel fica na coluna `role` da tabela `users`: `user` (padrão de todo cadastro) ou `admin`.

- **Usuário comum:** só vê, edita e exclui os próprios recados. Todas as consultas filtram por `user_id`; o recado de outro usuário responde `404`.
- **Administrador:**
  - acessa o painel de moderação (`/admin`), que lista os recados de todos os usuários, com o autor;
  - baixa o anexo de qualquer recado e exclui o recado de qualquer usuário;
  - gerencia usuários na tela `/admin/usuarios`: cadastra (comum ou administrador), edita (a senha é opcional na edição) e exclui. Ao excluir um usuário, os recados e os anexos dele também são apagados.
- **Travas de segurança:** o administrador não pode excluir a própria conta nem remover o próprio papel de administrador (`422`), então o sistema nunca fica sem administrador.
- **Sem autopromoção:** o cadastro público sempre cria `user`. O `role` fica fora do `$fillable` do model e só é definido de forma explícita pelo `UserController` e pelo seeder.
- **Proteção no servidor:** as rotas `/api/admin/*` usam o Gate `admin` (`can:admin`). Sem login retornam `401`, e usuário comum retorna `403`. A checagem no front-end (`AdminRoute`) serve só para a navegação.

## Anexos

- **Upload:** um anexo opcional por recado, enviado só pelo dono. Tipos aceitos: JPG, PNG, WEBP e PDF. Tamanho máximo: 5 MB. A validação é feita no back-end por um Form Request (`UploadAnexoRequest`), que confere o tipo pelo conteúdo do arquivo e não só pela extensão. Enviar um novo anexo substitui o anterior.
- **Armazenamento:** o arquivo é salvo no disco privado do Laravel (`storage/app/private/anexos`), com nome aleatório. Não é acessível por URL pública; **não rode `php artisan storage:link`** para estes arquivos.
- **Download:** só o dono do recado ou um administrador pode baixar o anexo (controle por `RecadoPolicy`). Quem não tem permissão recebe `403`; sem login, `401`.
- **Exclusão:** ao excluir um recado (pelo dono ou pelo administrador), ou ao excluir um usuário, os arquivos anexados também são apagados do Storage.

## API

Todas as rotas ficam sob `http://localhost:8000/api`. Antes de `login` e `register`, o front chama `GET /sanctum/csrf-cookie` para receber o cookie CSRF.

| Método | Rota | Autenticação | Descrição |
|---|---|---|---|
| POST | `/api/register` | não | Cria a conta (papel `user`). Corpo: `name`, `email`, `password`, `password_confirmation`. Retorna `201` com o usuário. |
| POST | `/api/login` | não | Autentica e cria a sessão. Corpo: `email`, `password`. Retorna o usuário, ou `401` se as credenciais forem inválidas. |
| POST | `/api/logout` | sim | Encerra a sessão. |
| GET | `/api/user` | sim | Retorna `id`, `name`, `email` e `role` do usuário logado. |
| GET | `/api/recados` | sim | Lista os recados do usuário logado. |
| POST | `/api/recados` | sim | Cria um recado. Corpo: `titulo`, `texto`. Retorna `201`. |
| GET | `/api/recados/{id}` | sim | Mostra um recado do usuário logado. |
| PUT | `/api/recados/{id}` | sim | Edita um recado do usuário logado. Corpo: `titulo`, `texto`. |
| DELETE | `/api/recados/{id}` | sim | Exclui um recado do usuário logado e o anexo dele. |
| POST | `/api/recados/{id}/anexo` | sim (dono) | Envia o anexo (`multipart/form-data`, campo `anexo`; JPG, PNG, WEBP ou PDF, até 5 MB). Retorna `201`; `422` se o arquivo for inválido; `403` se o recado não for do usuário. |
| GET | `/api/recados/{id}/anexo` | sim (dono ou admin) | Baixa o anexo. `403` sem permissão; `404` se o recado não tiver anexo. |
| GET | `/api/admin/recados` | sim (admin) | Lista os recados de todos os usuários, com o autor. |
| DELETE | `/api/admin/recados/{id}` | sim (admin) | Exclui o recado de qualquer usuário e o anexo dele. |
| GET | `/api/admin/users` | sim (admin) | Lista os usuários (`id`, `name`, `email`, `role`). |
| POST | `/api/admin/users` | sim (admin) | Cadastra um usuário. Corpo: `name`, `email`, `password` (mínimo 8 caracteres), `role` (`user` ou `admin`). Retorna `201`; `422` se o e-mail já existir. |
| GET | `/api/admin/users/{id}` | sim (admin) | Mostra um usuário. |
| PUT | `/api/admin/users/{id}` | sim (admin) | Edita um usuário. Corpo: `name`, `email`, `role` e `password` (opcional: em branco mantém a atual). `422` ao tentar remover o próprio papel de administrador. |
| DELETE | `/api/admin/users/{id}` | sim (admin) | Exclui um usuário, os recados e os anexos dele. `422` ao tentar excluir a própria conta. |

Erros de validação retornam `422` com as mensagens por campo. Rotas protegidas sem sessão retornam `401`, e rotas de administrador acessadas por usuário comum retornam `403`.

## API externa: PokéAPI

Na tela de recados há o campo **Buscar Pokémon**. O usuário digita o nome (por exemplo, `pikachu`) e a tela mostra a imagem, o tipo, a altura e o peso, vindos de `https://pokeapi.co/api/v2/pokemon/{nome}`.

**Justificativa:** a PokéAPI é pública, gratuita, não exige chave de API e devolve JSON simples e bem documentado. Isso permitiu demonstrar o consumo de uma API externa pelo front-end sem expor segredos nem depender de cadastro.

## Estrutura do repositório

```
Projeto_Semestral/
├── docker-compose.yml               # orquestra front-end e back-end
├── backend/                         # Laravel 13 (API)
│   ├── Dockerfile
│   ├── app/Http/Controllers         # AuthController, RecadoController (recados, anexos e moderação), UserController
│   ├── app/Http/Requests            # UploadAnexoRequest, StoreUserRequest, UpdateUserRequest
│   ├── app/Policies                 # RecadoPolicy (quem acessa o anexo)
│   ├── routes/api.php               # rotas da API
│   └── database/
│       ├── migrations               # migrations versionadas
│       └── seeders                  # AdminSeeder (cria o usuário administrador)
├── frontend/                        # React (Vite)
│   ├── Dockerfile
│   └── src/
│       ├── Paginas/                 # Login, Registro, Recados, Admin, AdminUsuarios
│       ├── Components/              # PrivateRoute, AdminRoute
│       └── Servicos/                # Api, AuthService, RecadosService, AdminService, PokemonService
└── README.md
```

## Problemas comuns

- **O front abre em outra porta (5174) e o navegador mostra erro de CORS:** a 5173 está ocupada por outro processo, em geral um `npm run dev` rodando fora do Docker. Feche esse terminal e use só `http://localhost:5173`.
- **`php artisan` no computador falha com `Access denied` ou `Database file ... does not exist`:** com Docker, os comandos do Laravel rodam dentro do container (`docker compose exec backend php artisan ...`).
- **Erro 500 em `/sanctum/csrf-cookie`:** veja a causa em `docker compose logs backend` (ou em `backend/storage/logs/laravel.log`). Na execução manual, confira se o MySQL está ligado e se as migrations foram aplicadas (a sessão fica na tabela `sessions`).
- **`No application encryption key has been specified`:** rode `php artisan key:generate` e reinicie o servidor.
- **`could not find driver` (execução manual):** ative a extensão `pdo_mysql` no `php.ini`.
- **`Unknown column 'anexo_path'` ou `'role'`:** falta aplicar as migrations. Rode `php artisan migrate`.
- **Upload recusado sem mensagem de validação:** o limite de upload do PHP (`upload_max_filesize` e `post_max_size`) está abaixo de 5 MB.
- **Login retorna 419 ou 401 mesmo com a senha certa:** confira se o front está na porta listada em `SANCTUM_STATEFUL_DOMAINS` e se a origem consta em `config/cors.php`.
- **O botão "Painel Admin" não aparece, ou `/admin` volta para a tela de recados:** o usuário não é administrador. Entre com o `ADMIN_EMAIL` e a `ADMIN_PASSWORD` do `.env`, ou rode `php artisan db:seed --class=AdminSeeder`.

## Equipe

- Ricardo Silva Godoi
- Renan Stella Gouvêa
- Caia Braga Castilho
- Luis Felipe
- Matheus Cappi

## Convenção de commits

Mensagens no padrão `feat:`, `fix:`, `style:`, `docs:`, `test:`.
