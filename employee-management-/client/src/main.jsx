// Import React
import React from "react";

// Import ReactDOM, which renders React into the HTML page
import ReactDOM from "react-dom/client";

// Import the main App component
import App from "./App.jsx";

/*
  Find the HTML element with id="root" in index.html,
  then render the React App inside it.
*/
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);