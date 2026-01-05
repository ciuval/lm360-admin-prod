import "./styles/tokens.css";
import ErrorBoundary from "./components/ErrorBoundary";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom"; // ✅ Usiamo HashRouter
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
); 

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
      <Analytics />   {/* componente di Vercel */}
    </HashRouter>
  </React.StrictMode>
);