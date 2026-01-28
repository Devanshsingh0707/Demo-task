import { timeRemaining } from "../utils/time";

export default function MFATable({ logs, onVerify }) {
  return (
    <table>
      <thead>
        <tr>
          <th>User</th>
          <th>Method</th>
          <th>Status</th>
          <th>Time Left</th>
          <th>Verify</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((l) => (
          <tr key={l.auth_id}>
            <td>{l.username}</td>
            <td>{l.auth_method}</td>
            <td>{l.verification_status}</td>
            <td>{timeRemaining(l.otp_expires_at)}</td>
            <td>
              {l.verification_status === "Pending" && (
                <button onClick={() => onVerify(l.auth_id)}>
                  Verify
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
