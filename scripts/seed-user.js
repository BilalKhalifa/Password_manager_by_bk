import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT || 4000;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME || 'password_manager';
const defaultCaPath = path.join(process.cwd(), 'certs', 'ca-cert.pem');
const caPath = process.env.CA_CERT_PATH || defaultCaPath;

const username = process.env.SEED_USER || 'testuser';
const password = process.env.SEED_PASS || 'testpass';

async function main() {
  const poolConfig = {
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPass,
    database: dbName,
  };

  try {
    if (fs.existsSync(caPath)) {
      poolConfig.ssl = { ca: fs.readFileSync(caPath) };
      console.log('Using CA cert at', caPath);
    } else {
      console.warn('CA cert not found at', caPath, '- attempting connection without CA.');
    }
  } catch (err) {
    console.error('Error reading CA cert:', err.message);
  }

  const pool = mysql.createPool(poolConfig);

  try {
    // Create users table if it doesn't exist (simple schema)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      ) ENGINE=InnoDB;
    `);

    // Insert the user if not exists
    const [existing] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      console.log(`User '${username}' already exists with id ${existing[0].id}`);
    } else {
      const [result] = await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
      console.log(`Inserted user '${username}' with id ${result.insertId}`);
    }

    await pool.end();
    process.exit(0);
  } catch (err) {
    // Print full error details for debugging (including non-enumerable properties)
    try {
      console.error('Error while seeding user:');
      console.error('name:', err.name);
      console.error('message:', err.message);
      console.error('stack:', err.stack);
      // Print all own properties (including sqlMessage, errno, code)
      console.error('full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    } catch (e) {
      console.error('Failed to stringify error, raw:', err);
    }
    process.exit(2);
  }
}

main();
