import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();
app.use(express.json());
// Accept URL-encoded form submissions from the browser (for compatibility)
app.use(express.urlencoded({ extended: true }));

// Create MySQL connection pool (supports TiDB Cloud with TLS CA)
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

// Allow overriding CA path via env; default to ./certs/ca-cert.pem
const defaultCaPath = path.join(process.cwd(), "certs", "ca-cert.pem");
const caPath = process.env.CA_CERT_PATH || defaultCaPath;

let poolConfig = {
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPass,
  database: dbName,
};

try {
  if (fs.existsSync(caPath)) {
    const ca = fs.readFileSync(caPath);
    poolConfig.ssl = { ca };
    console.log(`Using DB CA certificate at ${caPath}`);
  } else {
    // If no CA found, warn — TiDB Cloud normally requires the CA for TLS
    console.warn(`DB CA certificate not found at ${caPath}. Attempting connection without CA.`);
    // Note: connecting without the CA to TiDB Cloud may fail; set CA_CERT_PATH env var or add the cert at certs/ca-cert.pem
  }
} catch (err) {
  console.error('Error while reading DB CA certificate:', err.message);
}

const pool = mysql.createPool(poolConfig);

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "Missing token" });
  const token = auth.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// 🧩 Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [existing] = await pool.query("SELECT id FROM users WHERE username = ?", [username]);
    if (existing.length > 0) return res.status(400).json({ error: "User already exists" });

    const [result] = await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
    const userId = result.insertId;
    const token = generateToken({ id: userId, username });
    res.json({ success: true, message: "User registered successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔐 Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT id FROM users WHERE username = ? AND password = ?", [username, password]);
    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const token = generateToken({ id: user.id, username });
    res.json({ success: true, message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch passwords for authenticated user
app.get("/passwords", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await pool.query("SELECT id, website_url, site_username, site_password FROM passwords WHERE user_id = ?", [userId]);
    res.json({ success: true, passwords: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Add password
app.post("/passwords", authMiddleware, async (req, res) => {
  const { website, username, password } = req.body;
  if (!website || !username || !password) return res.status(400).json({ error: "Missing fields" });
  try {
    const userId = req.user.id;
    await pool.query("INSERT INTO passwords (user_id, website_url, site_username, site_password) VALUES (?, ?, ?, ?)", [userId, website, username, password]);
    res.json({ success: true, message: "Password added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete password
app.delete("/passwords/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);
    await pool.query("DELETE FROM passwords WHERE id = ? AND user_id = ?", [id, userId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🧠 Default route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

export default app;
