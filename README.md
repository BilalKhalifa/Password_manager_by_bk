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
  - Add the `certs/ca-cert.pem` file to the repository (not recommended), or
  - Store the certificate contents in an environment variable (e.g., `DB_CA`) and write it to `certs/ca-cert.pem` at startup — request help if you want this automated.
- Ensure TiDB Cloud allows connections from Vercel's outbound IPs or use an appropriate networking solution.

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
