// useEffect runs code when the page loads
// useState stores changing data in this component
import { useEffect, useState } from "react";

// Import API functions
import {
  createRegistrationToken,
  getRegistrationTokens,
} from "../api/registrationApi.js";

/*
  Helper function: format date.

  Backend returns date as ISO string.
  Example:
  2026-04-26T19:30:00.000Z

  This function converts it into local readable format.
*/
function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

export default function HiringManagement() {
  /*
    formData stores the values typed by HR.

    employeeName connects to the name input.
    employeeEmail connects to the email input.
  */
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeEmail: "",
  });

  /*
    tokens stores all generated registration links.

    Example:
    [
      {
        id: "...",
        employeeName: "Alice Chen",
        employeeEmail: "alice@example.com",
        registrationLink: "http://localhost:5173/register/...",
        expiresAt: "...",
        status: "Not Submitted"
      }
    ]
  */
  const [tokens, setTokens] = useState([]);

  // message stores success messages
  const [message, setMessage] = useState("");

  // error stores error messages
  const [error, setError] = useState("");

  // loading controls button text while request is running
  const [loading, setLoading] = useState(false);

  /*
    loadTokens gets all registration links from backend.
    It is used:
    1. when the page first loads
    2. after HR generates a new token
  */
  async function loadTokens() {
    try {
      const result = await getRegistrationTokens();
      setTokens(result.data);
    } catch (err) {
      setError("Failed to load registration links.");
    }
  }

  /*
    useEffect with empty dependency array [] runs only once,
    when this page first appears.

    This loads the existing token history.
  */
  useEffect(() => {
    loadTokens();
  }, []);

  /*
    handleSubmit runs when HR submits the form.

    Steps:
    1. Prevent page refresh
    2. Clear old messages
    3. Send employeeName and employeeEmail to backend
    4. Backend generates registration token/link
    5. Reload table
  */
  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await createRegistrationToken(formData);

      setMessage(result.message);

      // Clear form after successful generation
      setFormData({
        employeeName: "",
        employeeEmail: "",
      });

      // Refresh registration link table
      await loadTokens();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to generate registration token."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
    handleCopy copies registration link to clipboard.
  */
  function handleCopy(link) {
    navigator.clipboard.writeText(link);
    setMessage("Registration link copied to clipboard.");
  }

  return (
    <div>
      <h1>HR Hiring Management</h1>

      <p>
        HR can enter a new employee's name and email. The backend will generate
        a registration token that expires in 3 hours.
      </p>

      <hr />

      <h2>Generate Registration Link</h2>

      {/* Show success message */}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Show error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* HR input form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee Name: </label>
          <input
            type="text"
            value={formData.employeeName}
            placeholder="Alice Chen"
            onChange={(event) =>
              setFormData({
                ...formData,
                employeeName: event.target.value,
              })
            }
          />
        </div>

        <br />

        <div>
          <label>Employee Email: </label>
          <input
            type="text"
            value={formData.employeeEmail}
            placeholder="alice@example.com"
            onChange={(event) =>
              setFormData({
                ...formData,
                employeeEmail: event.target.value,
              })
            }
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Token"}
        </button>
      </form>

      <hr />

      <h2>Registration Link History</h2>

      <button onClick={loadTokens}>Refresh Table</button>

      <br />
      <br />

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Email</th>
            <th>Registration Link</th>
            <th>Expires At</th>
            <th>Status</th>
            <th>Copy</th>
          </tr>
        </thead>

        <tbody>
          {tokens.length === 0 ? (
            <tr>
              <td colSpan="6">No registration links generated yet.</td>
            </tr>
          ) : (
            tokens.map((item) => (
              <tr key={item.id}>
                <td>{item.employeeName}</td>
                <td>{item.employeeEmail}</td>

                <td>
                  <a
                    href={item.registrationLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Registration Link
                  </a>
                </td>

                <td>{formatDate(item.expiresAt)}</td>

                <td>{item.status}</td>

                <td>
                  <button onClick={() => handleCopy(item.registrationLink)}>
                    Copy Link
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}