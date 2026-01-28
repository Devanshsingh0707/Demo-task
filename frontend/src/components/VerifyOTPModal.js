import { useState } from "react";
import api from "../api";

export default function VerifyOTPModal({ authId, onClose, onSuccess }) {
  const [otp, setOtp] = useState("");

  const verify = async () => {
    await api.post("/mfa/verify", { auth_id: authId, otp });
    onSuccess();
    onClose();
  };

  return (
    <div className="modal">
      <h3>Verify OTP</h3>
      <input placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
      <button onClick={verify}>Verify</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
