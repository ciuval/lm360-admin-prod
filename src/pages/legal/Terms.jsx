import React from "react";

const mods = import.meta.glob(
  ["../Legal/Terms.jsx","../Legal/Terms.tsx","../Legal/TermsPage.jsx","../Legal/TermsPage.tsx"],
  { eager: true }
);

const mod = Object.values(mods)[0];

const Terms = (mod && mod.default) || function TermsFallback() {
  return (
    <section style={{ padding: 24 }}>
      <h1>Termini</h1>
      <p>Contenuto non disponibile in questa build.</p>
    </section>
  );
};

export default Terms;