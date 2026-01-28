const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./mfa.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS multi_factor_auth (
      auth_id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      username TEXT NOT NULL,
      email TEXT NOT NULL,
      phone_number TEXT,
      auth_method TEXT NOT NULL,
      otp_code TEXT,
      otp_expires_at DATETIME,
      verification_status TEXT DEFAULT 'Pending',
      ip_address TEXT,
      device_info TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
