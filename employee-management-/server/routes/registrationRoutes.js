// Import Express so we can create API routes
import express from "express";

// Import Node's built-in crypto module
import crypto from "crypto";

// Create an Express router
const router = express.Router();

/*
  IMPORTANT:
  This array is acting like a fake database.

  When the backend server restarts, this array becomes empty again.
*/
const registrationTokens = [];

/*
  Helper function: validate email format.

  This is a simple email check:
  - Must have something before @
  - Must have @
  - Must have a domain after @
*/
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/*
  Helper function: calculate status of one registration link.

  Possible statuses:
  1. Submitted
     - Employee has already used this registration link.

  2. Expired
     - Current time is later than expiresAt.

  3. Not Submitted
     - Link is still valid and employee has not submitted registration yet.
*/
function getTokenStatus(tokenRecord) {
  if (tokenRecord.submittedAt) {
    return "Submitted";
  }

  if (new Date() > new Date(tokenRecord.expiresAt)) {
    return "Expired";
  }

  return "Not Submitted";
}

/*
  POST /api/registration-tokens

  Purpose:
  HR enters employee name and email.
  Backend generates a registration token.
  Backend creates a registration link.
  Backend sets expiration time to 3 hours later.
  Backend returns the link to frontend.

  Example request body:
  {
    "employeeName": "A C",
    "employeeEmail": "ac@example.com"
  }
*/
router.post("/registration-tokens", (req, res) => {
  const { employeeName, employeeEmail } = req.body;

  // Validate name
  if (!employeeName || employeeName.trim() === "") {
    return res.status(400).json({
      message: "Employee name is required.",
    });
  }

  // Validate email
  if (!employeeEmail || employeeEmail.trim() === "") {
    return res.status(400).json({
      message: "Employee email is required.",
    });
  }

  // Validate email format
  if (!isValidEmail(employeeEmail)) {
    return res.status(400).json({
      message: "Please enter a valid email address.",
    });
  }

  /*
    Generate a random token.

    crypto.randomBytes(32) creates 32 random bytes.
    .toString("hex") converts it into a long string.

    Example:
    9f12a8c3e5...
  */
  const token = crypto.randomBytes(32).toString("hex");

  /*
    Token expires in 3 hours.

    3 hours
    = 3 * 60 minutes
    = 3 * 60 * 60 seconds
    = 3 * 60 * 60 * 1000 milliseconds
  */
  const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

  /*
    This is the frontend registration URL.

    In a real project, this would be sent by email.

    For this local demo, the backend simply returns it,
    and the HR frontend table displays it.
  */
  const registrationLink = `http://localhost:5173/register/${token}`;

  /*
    Create a fake database record.
  */
  const newTokenRecord = {
    id: crypto.randomUUID(),
    employeeName: employeeName.trim(),
    employeeEmail: employeeEmail.trim().toLowerCase(),
    token,
    registrationLink,
    expiresAt,
    submittedAt: null,
    createdAt: new Date(),
  };

  /*
    Save the record in memory.
  */
  registrationTokens.unshift(newTokenRecord);

  /*
    Print the generated link in the backend terminal.

    This satisfies your requirement:
    "the backend just need to show the link it generates"
  */
  console.log("Generated registration link:");
  console.log(registrationLink);

  /*
    Send response back to frontend.
  */
  res.status(201).json({
    message: "Registration token generated successfully.",
    data: {
      ...newTokenRecord,
      status: getTokenStatus(newTokenRecord),
    },
  });
});

/*
  GET /api/registration-tokens

  Purpose:
  HR frontend calls this route to get all generated links.

  The frontend will display them in a table.
*/
router.get("/registration-tokens", (req, res) => {
  const tokensWithStatus = registrationTokens.map((tokenRecord) => {
    return {
      ...tokenRecord,
      status: getTokenStatus(tokenRecord),
    };
  });

  res.json({
    data: tokensWithStatus,
  });
});

/*
  GET /api/registration-tokens/validate/:token

  Purpose:
  When employee opens the registration link,
  frontend extracts token from the URL and asks backend:

  Is this token valid?
  Is it expired?
  Has it already been submitted?
*/
router.get("/registration-tokens/validate/:token", (req, res) => {
  const { token } = req.params;

  // Find the token record from fake in-memory database
  const tokenRecord = registrationTokens.find((item) => item.token === token);

  // Token does not exist
  if (!tokenRecord) {
    return res.status(404).json({
      valid: false,
      message: "Registration token does not exist.",
    });
  }

  // Token was already used
  if (tokenRecord.submittedAt) {
    return res.status(400).json({
      valid: false,
      message: "This registration link has already been used.",
      data: {
        ...tokenRecord,
        status: getTokenStatus(tokenRecord),
      },
    });
  }

  // Token expired
  if (new Date() > new Date(tokenRecord.expiresAt)) {
    return res.status(400).json({
      valid: false,
      message: "This registration link has expired.",
      data: {
        ...tokenRecord,
        status: getTokenStatus(tokenRecord),
      },
    });
  }

  // Token is valid
  res.json({
    valid: true,
    message: "Registration token is valid.",
    data: {
      ...tokenRecord,
      status: getTokenStatus(tokenRecord),
    },
  });
});

/*
  POST /api/register/:token

  Purpose:
  This is a simple demo employee registration submit route.

  In the real project, this should:
  - create employee account
  - save username
  - hash password
  - save user into database

  For now, it only marks the token as submitted.
*/
router.post("/register/:token", (req, res) => {
  const { token } = req.params;
  const { username, password } = req.body;

  // Validate username
  if (!username || username.trim() === "") {
    return res.status(400).json({
      message: "Username is required.",
    });
  }

  // Validate password
  if (!password || password.trim() === "") {
    return res.status(400).json({
      message: "Password is required.",
    });
  }

  // Find token record
  const tokenRecord = registrationTokens.find((item) => item.token === token);

  // Token does not exist
  if (!tokenRecord) {
    return res.status(404).json({
      message: "Registration token does not exist.",
    });
  }

  // Token already used
  if (tokenRecord.submittedAt) {
    return res.status(400).json({
      message: "This registration link has already been used.",
    });
  }

  // Token expired
  if (new Date() > new Date(tokenRecord.expiresAt)) {
    return res.status(400).json({
      message: "This registration link has expired.",
    });
  }

  /*
    Mark token as submitted.

    this demo does not use a database yet.
  */
  tokenRecord.submittedAt = new Date();

  res.json({
    message: "Registration completed successfully.",
    data: {
      ...tokenRecord,
      status: getTokenStatus(tokenRecord),
    },
  });
});

export default router;