# Polaroid Web

A Laravel web application using Laravel, Vite, and SQLite.

## Requirements

Before setting up the project, make sure you have the following installed:

- **PHP** 8.2 or newer
- **Composer**
- **Node.js** 18+ 
- **npm**
- **Git**
- **SQLite**

You can check your installed versions with:

```bash
php -v
composer -V
node -v
npm -v
git --version
```

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd polaroid-web
```

### 2. Install PHP dependencies

```bash
composer install
```

This installs Laravel and the project's PHP dependencies into the `vendor/` directory.

### 3. Install Node.js dependencies

```bash
npm install
```

This installs the frontend dependencies into the `node_modules/` directory.

### 4. Set up the environment file

Copy the example environment file:

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

### 5. Set up the SQLite database

Create the SQLite database file:

```bash
touch database/database.sqlite
```

Make sure `.env` is configured to use SQLite:

```env
DB_CONNECTION=sqlite
```

If the project has other database settings such as `DB_HOST`, `DB_PORT`, `DB_DATABASE`, etc., they can generally be left empty when using SQLite.

### 6. Run database migrations

```bash
php artisan migrate
```

This creates the required database tables.

## Running the Project

You need to run the Laravel backend and Vite development server.

### Terminal 1 — Laravel

```bash
php artisan serve
```

Laravel will normally be available at:

```text
http://127.0.0.1:8000
```

### Terminal 2 — Vite

```bash
npm run dev
```

Vite will start the frontend development server.

Keep both terminals running while developing.

## Quick Setup

After cloning the repository, the basic setup is:

```bash
composer install
npm install

cp .env.example .env
php artisan key:generate

touch database/database.sqlite
php artisan migrate

php artisan serve
```

Then, in another terminal:

```bash
npm run dev
```

## Dependencies

### Backend

- PHP
- Composer
- Laravel
- SQLite
- PHP SQLite extension (`pdo_sqlite`)

### Frontend

- Node.js
- npm
- Vite
- Project-specific npm dependencies

The frontend dependencies are defined in:

```text
package.json
```

The PHP dependencies are defined in:

```text
composer.json
```

## Troubleshooting

### `vendor/autoload.php` does not exist

Run:

```bash
composer install
```

### `database/database.sqlite does not exist`

Create the database file:

```bash
touch database/database.sqlite
```

Then run:

```bash
php artisan migrate
```

### Database SQLite driver not found

Make sure PHP's SQLite extension is installed and enabled.

Check with:

```bash
php -m | grep -i sqlite
```

You should see something similar to:

```text
pdo_sqlite
sqlite3
```

### Vite / Wayfinder error

If you see an error involving:

```text
php artisan wayfinder:generate
```

make sure you have already run:

```bash
composer install
```

and that the Laravel application is properly configured.

## Development

When developing, keep these two commands running:

```bash
php artisan serve
```

and:

```bash
npm run dev
```

If the project requires additional services or environment variables, check the `.env.example` file for the required configuration.
