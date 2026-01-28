import { useState } from "react";
import api from "../api";

export default function GenerateOTPModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    user_id: "",
    username: "",
    email: "",
    phone_number: "",
    auth_method: "Email OTP",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // 🔴 HARD VALIDATION
    if (
      !form.user_id.trim() ||
      !form.username.trim() ||
      !form.email.trim()
    ) {
      alert("user_id, username and email are required");
      return;
    }

    await api.post("/mfa/generate", {
      ...form,
      user_id: Number(form.user_id), // critical
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="modal">
      <h3>Generate OTP</h3>

      <input
        name="user_id"
        placeholder="User ID (number)"
        onChange={handleChange}
      />

      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <input
        name="phone_number"
        placeholder="Phone (optional)"
        onChange={handleChange}
      />

      <select name="auth_method" onChange={handleChange}>
        <option>Email OTP</option>
        <option>SMS OTP</option>
      </select>

      <button onClick={handleSubmit}>Generate</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
