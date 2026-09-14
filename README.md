# Projeto Semestral

## Integrantes

- Ricardo Silva Godoi
- Renan Stella Gonçalves
- Caia Braga Castilho
- Luis Felipe
- Matheus Cappi

## Tecnologias

- Frontend: React (Create React App)
- Backend: Laravel 13 + Sanctum
- Banco: MySQL 8

## Pré-requisitos

- Node.js v20+
- PHP 8.5
- Composer 2
- MySQL 8 rodando

## Como rodar o backend

```bash
cd backend
composer install
cp .env.example .env
# Edite com suas credenciais MySQL
php artisan key:generate
php artisan migrate
php artisan serve
```

## Como rodar o frontend

```bash
cd frontend
npm install
npm start
```

