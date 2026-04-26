// BrowserRouter enables frontend routing in React
// Routes contains all route definitions
// Route defines one page route
// Navigate redirects one path to another path
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// HR page where HR generates registration links
import HiringManagement from "./pages/HiringManagement.jsx";

// Employee registration page opened from generated link
import Register from "./pages/Register.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 
          Default route.

          When user visits:
          http://localhost:5173

          Redirect to:
          http://localhost:5173/hr/hiring
        */}
        <Route path="/" element={<Navigate to="/hr/hiring" />} />

        {/* 
          HR Hiring Management page.

          HR can:
          - input employee name
          - input employee email
          - generate token
          - see all generated links
        */}
        <Route path="/hr/hiring" element={<HiringManagement />} />

        {/* 
          Employee Registration page.

          Example:
          http://localhost:5173/register/abc123token

          The :token part is dynamic.
          React Router will read that token from the URL.
        */}
        <Route path="/register/:token" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}