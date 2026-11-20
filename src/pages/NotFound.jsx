import React from "react";
import { Link } from "react-router-dom";

const mods = import.meta.glob(
  ["./NotFoundPage.jsx","./PageNotFound.jsx","./FourOhFour.jsx"],
  { eager: true }
);

const mod =
  mods["./NotFoundPage.jsx"] ||
  mods["./PageNotFound.jsx"] ||
  mods["./FourOhFour.jsx"] ||
  Object.values(mods)[0];

const NotFound = (mod && mod.default) || function NotFoundFallback() {
  return (
    <section style={{ padding: 24 }}>
      <h1>Pagina non trovata</h1>
      <p>Questa pagina non esiste oppure il collegamento è cambiato.</p>
      <Link to="/" style={{ color: "#ffd6ea", fontWeight: 800 }}>Torna alla Home</Link>
    </section>
  );
};

export default NotFound;