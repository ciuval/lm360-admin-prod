import ErrorBoundary from "./components/ErrorBoundary";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom"; // ✅ Usiamo HashRouter

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
      <App />
    </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
