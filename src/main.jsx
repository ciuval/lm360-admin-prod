import "./styles/tokens.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
        <Analytics />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4500,
          }}
        />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);