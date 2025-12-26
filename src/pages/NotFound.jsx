import React from "react";

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
      <p>Qui non c’è niente. Ma puoi tornare a casa.</p>
    </section>
  );
};

export default NotFound;