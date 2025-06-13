// This file initializes the PostgreSQL database connection and creates necessary tables.
// Ensure you have the 'pg' package installed: npm install pg dotenv
const { Pool } = require('pg');
require('dotenv').config(); // Load .env file

const pool = new Pool({
  user: process.env.DB_USER || 'psqldb_3io3_user',
  host: process.env.DB_HOST || 'dpg-d136uc3uibrs73fsj030-a',
  database: process.env.DB_NAME || 'psqldb_3io3',
  password: process.env.DB_PASSWORD || 'Z5PkDeRxcN1bgtzBakXI9p6Kvb34UH0C',
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        branch VARCHAR(50),
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS doubts (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        subject VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        branch VARCHAR(50),
        location VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
  CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    doubt_id INTEGER,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (doubt_id) REFERENCES doubts(id) ON DELETE CASCADE
  );
`);

await pool.query(`
  CREATE TABLE IF NOT EXISTS password_resets (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    token VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  );
`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS responses (
        id SERIAL PRIMARY KEY,
        doubt_id INTEGER NOT NULL,
        responder_id VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        contact_info VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doubt_id) REFERENCES doubts(id) ON DELETE CASCADE,
        FOREIGN KEY (responder_id) REFERENCES users(user_id) ON DELETE CASCADE
      );
    `);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization failed:', err);
    throw err;
  }
}

async function testConnection() {
  const res = await pool.query('SELECT NOW()');
  console.log('Database connection successful:', res.rows[0].now);
}

module.exports = { pool, initializeDatabase, testConnection };
