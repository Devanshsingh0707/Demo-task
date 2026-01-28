const express = require("express");
const db = require("../db");
const { generateOTP, getExpiry } = require("../utils/otp");

const router = express.Router(); // ✅ THIS WAS MISSING

// ======================
// Generate OTP
// ======================
router.post("/generate", (req, res) => {
  let { user_id, username, email, phone_number, auth_method } = req.body;

  user_id = parseInt(user_id, 10);
  if (isNaN(user_id)) {
    return res.status(400).json({ error: "user_id must be a number" });
  }

  const otp = generateOTP();
  const expiresAt = getExpiry();

  console.log("OTP GENERATED:", otp);

  db.run(
    `INSERT INTO multi_factor_auth
     (user_id, username, email, phone_number, auth_method, otp_code, otp_expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      user_id,
      username,
      email,
      phone_number,
      auth_method,
      otp,
      expiresAt,
    ],
    function (err) {
      if (err) {
        console.error("SQL ERROR:", err.message);
        return res.status(500).json({ error: err.message });
      }

      res.json({ success: true });
    }
  );
});

// ======================
// Get Logs
// ======================
router.get("/logs", (req, res) => {
  db.all(
    `SELECT * FROM multi_factor_auth ORDER BY auth_id DESC`,
    [],
    (err, rows) => res.json(rows)
  );
});

// ======================
// Verify OTP
// ======================
router.post("/verify", (req, res) => {
  const { auth_id, otp } = req.body;

  db.get(
    `SELECT * FROM multi_factor_auth WHERE auth_id = ?`,
    [auth_id],
    (err, row) => {
      if (!row) return res.status(404).json({ error: "Not found" });

      if (new Date() > new Date(row.otp_expires_at)) {
        db.run(
          `UPDATE multi_factor_auth SET verification_status='Expired' WHERE auth_id=?`,
          [auth_id]
        );
        return res.json({ status: "Expired" });
      }

      if (row.otp_code === otp) {
        db.run(
          `UPDATE multi_factor_auth SET verification_status='Verified' WHERE auth_id=?`,
          [auth_id]
        );
        return res.json({ status: "Verified" });
      }

      db.run(
        `UPDATE multi_factor_auth SET verification_status='Failed' WHERE auth_id=?`,
        [auth_id]
      );
      res.json({ status: "Failed" });
    }
  );
});

module.exports = router;
