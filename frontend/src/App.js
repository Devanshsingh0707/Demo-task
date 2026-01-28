import { useEffect, useState } from "react";
import api from "./api";
import MFATable from "./components/MFATable";
import GenerateOTPModal from "./components/GenerateOTPModal";
import VerifyOTPModal from "./components/VerifyOTPModal";

export default function App() {
  const [logs, setLogs] = useState([]);
  const [showGen, setShowGen] = useState(false);
  const [verifyId, setVerifyId] = useState(null);

  const fetchLogs = async () => {
    const res = await api.get("/mfa/logs");
    setLogs(res.data);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <h2>MFA Verification Logs</h2>
      <button onClick={() => setShowGen(true)}>Generate OTP</button>

      <MFATable logs={logs} onVerify={setVerifyId} />

      {showGen && (
        <GenerateOTPModal
          onClose={() => setShowGen(false)}
          onSuccess={fetchLogs}
        />
      )}

      {verifyId && (
        <VerifyOTPModal
          authId={verifyId}
          onClose={() => setVerifyId(null)}
          onSuccess={fetchLogs}
        />
      )}
    </div>
  );
}
