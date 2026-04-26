// Import axios
// Axios helps frontend send HTTP requests to backend
import axios from "axios";

/*
  Create an axios instance.

  baseURL means every API request starts with:
  http://localhost:5001/api

  Example:
  api.get("/registration-tokens")

  Actually sends request to:
  http://localhost:5001/api/registration-tokens
*/
const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

/*
  Function: createRegistrationToken

  Used by:
  HiringManagement.jsx

  Purpose:
  HR submits employee name and email.
  Frontend sends this data to backend.
  Backend generates a token and registration link.

  formData example:
  {
    employeeName: "Alice Chen",
    employeeEmail: "alice@example.com"
  }

  Backend route:
  POST /api/registration-tokens
*/
export async function createRegistrationToken(formData) {
  const response = await api.post("/registration-tokens", formData);

  /*
    response.data usually looks like:
    {
      message: "Registration token generated successfully.",
      data: {
        id,
        employeeName,
        employeeEmail,
        token,
        registrationLink,
        expiresAt,
        submittedAt,
        createdAt,
        status
      }
    }
  */
  return response.data;
}

/*
  Function: getRegistrationTokens

  Used by:
  HiringManagement.jsx

  Purpose:
  Get all generated registration links.

  Backend route:
  GET /api/registration-tokens
*/
export async function getRegistrationTokens() {
  const response = await api.get("/registration-tokens");

  /*
    response.data usually looks like:
    {
      data: [
        {
          id,
          employeeName,
          employeeEmail,
          registrationLink,
          expiresAt,
          status
        }
      ]
    }
  */
  return response.data;
}

/*
  Function: validateRegistrationToken

  Used by:
  Register.jsx

  Purpose:
  When employee opens a registration link,
  frontend checks whether the token is valid.

  Backend route:
  GET /api/registration-tokens/validate/:token

  Example:
  validateRegistrationToken("abc123")
  sends request to:
  http://localhost:5001/api/registration-tokens/validate/abc123
*/
export async function validateRegistrationToken(token) {
  const response = await api.get(`/registration-tokens/validate/${token}`);
  return response.data;
}

/*
  Function: submitRegistration

  Used by:
  Register.jsx

  Purpose:
  Employee submits username and password.

  In this simplified demo:
  Backend does not create a real account.
  Backend only marks the token as submitted.

  Backend route:
  POST /api/register/:token

  formData example:
  {
    username: "alice",
    password: "123456"
  }
*/
export async function submitRegistration(token, formData) {
  const response = await api.post(`/register/${token}`, formData);
  return response.data;
}