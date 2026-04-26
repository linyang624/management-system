// useEffect runs code when this page loads
// useState stores page data
import { useEffect, useState } from "react";

// useParams reads dynamic values from the URL
// Example URL:
// /register/abc123
// token will be "abc123"
import { useParams } from "react-router-dom";

// Import API functions
import {
  validateRegistrationToken,
  submitRegistration,
} from "../api/registrationApi.js";

export default function Register() {
  /*
    Read token from URL.

    Example:
    http://localhost:5173/register/abc123

    token = "abc123"
  */
  const { token } = useParams();

  /*
    tokenData stores information about the registration link.

    Example:
    {
      employeeName: "Alice Chen",
      employeeEmail: "alice@example.com",
      expiresAt: "...",
      status: "Not Submitted"
    }
  */
  const [tokenData, setTokenData] = useState(null);

  // pageMessage shows loading or checking message
  const [pageMessage, setPageMessage] = useState("Checking registration link...");

  // error stores invalid/expired/already-used token messages
  const [error, setError] = useState("");

  // success stores successful registration message
  const [success, setSuccess] = useState("");

  /*
    formData stores employee registration form input.

    This demo only has username and password.

    In the full project, this registration page would create a user account.
  */
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  /*
    When page loads, validate the token.

    Steps:
    1. Get token from URL
    2. Ask backend if token is valid
    3. If valid, show registration form
    4. If invalid/expired/used, show error
  */
  useEffect(() => {
    async function checkToken() {
      try {
        const result = await validateRegistrationToken(token);

        setTokenData(result.data);
        setPageMessage("");
      } catch (err) {
        setError(err.response?.data?.message || "Invalid registration link.");
        setPageMessage("");
      }
    }

    checkToken();
  }, [token]);

  /*
    handleSubmit runs when employee submits registration form.

    In this simplified demo:
    - The backend does not create a real user.
    - It only marks the registration token as submitted.
  */
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    try {
      const result = await submitRegistration(token, formData);

      setSuccess(result.message);

      /*
        Hide the form after successful registration.
        Because this token should not be used again.
      */
      setTokenData(null);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  }

  return (
    <div>
      <h1>Employee Registration</h1>

      {/* Show checking message */}
      {pageMessage && <p>{pageMessage}</p>}

      {/* Show error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Show success message */}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* Show registration form only if token is valid */}
      {tokenData && (
        <div>
          <p>
            You are registering as: <strong>{tokenData.employeeName}</strong>
          </p>

          <p>Email: {tokenData.employeeEmail}</p>

          <p>Link expires at: {new Date(tokenData.expiresAt).toLocaleString()}</p>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Username: </label>
              <input
                type="text"
                value={formData.username}
                placeholder="Choose username"
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    username: event.target.value,
                  })
                }
              />
            </div>

            <br />

            <div>
              <label>Password: </label>
              <input
                type="password"
                value={formData.password}
                placeholder="Choose password"
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    password: event.target.value,
                  })
                }
              />
            </div>

            <br />

            <button type="submit">Create Account</button>
          </form>
        </div>
      )}
    </div>
  );
}