// Import Express to create the backend server
import express from "express";

// Import CORS so the React frontend can call this backend
import cors from "cors";

// Import the registration routes
import registrationRoutes from "./routes/registrationRoutes.js";

// Create the Express application
const app = express();

// Define the backend port
const PORT = 5001;

// Allow requests from the frontend
//Vite React app usually runs on http://localhost:5173
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Allow Express to read JSON request bodies
app.use(express.json());

// Simple test route
// Visit http://localhost:5001 to check if backend is running
app.get("/", (req, res) => {
  res.send("Employee Management backend is running.");
});

// Use all registration-related routes under /api
// Example full route: POST http://localhost:5001/api/registration-tokens
app.use("/api", registrationRoutes);

// Start the backend server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});