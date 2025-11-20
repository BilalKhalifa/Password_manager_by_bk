# Password Manager

This project is a simple password manager with a Node.js backend (Express) and a static frontend.

## Features

- User register & login (JWT)
- Store, list and delete saved passwords for logged-in users
- Uses TiDB (MySQL-compatible) as the database

## Quick start (local)

1. Copy `.env.example` to `.env` and fill values (do not commit `.env`):

   DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, CA_CERT_PATH, JWT_SECRET

2. Install dependencies:

```powershell
npm install
```

3. Seed a test user (reads `.env`):

```powershell
npm run seed
```

4. Start the server:

```powershell
npm start
```

5. Open the frontend `public/index.html` (or serve it with a static server). For testing the dashboard locally open `public/dashboard.html` and set the JWT in localStorage (see below).

## API endpoints

- POST /register { username, password }
- POST /login { username, password } -> returns { token }
- GET /passwords (Authorization: Bearer <token>)
- POST /passwords (Authorization: Bearer <token>) { website, username, password }
- DELETE /passwords/:id (Authorization: Bearer <token>)

## Deploying to Vercel

- Add the environment variables in your Vercel project settings: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`.
- For the TiDB CA certificate, either:

## Deploying to Vercel

- Add the environment variables in your Vercel project settings: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`.
- CA certificate handling on Vercel:
  - Vercel's runtime is ephemeral and you can't reliably commit files at runtime. The project supports providing the TiDB CA certificate via an environment variable named `DB_CA` (the raw PEM contents).
  - When `DB_CA` is set, the server writes that value to a temporary file at startup and uses it for TLS connections. This is the recommended approach for Vercel.
  - Alternatively you can commit `certs/ca-cert.pem` to the repo (not recommended).
- TiDB Cloud IP allowlist: Vercel uses many dynamic outbound IP addresses. If your TiDB Cloud instance requires IP allowlisting, you have three options:
  1. Use a hosting provider for the Node API that provides a stable outbound IP (e.g., a small VM, Render, DigitalOcean) and whitelist that IP in TiDB Cloud.
  2. Use a stable proxy/tunnel with a fixed IP that forwards requests to your API.
  3. If your TiDB Cloud plan allows it, add the Vercel IP ranges (not generally recommended due to dynamic ranges).

Note: serverless functions and connection pools

- Serverless functions (like Vercel) create short-lived containers. The code attempts to reuse a connection pool across warm invocations, but you should still configure your TiDB instance to allow an appropriate number of connections. Monitor connection usage and set pool parameters as needed.

## Security notes (important)

- Passwords for user accounts are stored in plain text in this demo. Before production:
  - Hash user passwords using `bcrypt`.
  - Consider encrypting stored site passwords.
  - Use strong `JWT_SECRET` and store it as an env var.

## Next steps / TODO

- Replace plain-text password storage with `bcrypt` hashing and migration script.
- Add client-side token refresh or expiry handling.
- Improve frontend UX and add validations/tests.

If you want, I can implement bcrypt password hashing and add a migration to convert existing users.
