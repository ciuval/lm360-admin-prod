import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App";
import { BrowserRouter, HashRouter } from "react-router-dom";

const isDev = import.meta.env.DEV;
const Router = isDev ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
