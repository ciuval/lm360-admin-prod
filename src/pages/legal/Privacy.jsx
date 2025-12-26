import React from "react";

const mods = import.meta.glob(
  ["../Legal/Privacy.jsx","../Legal/Privacy.tsx","../Legal/PrivacyPage.jsx","../Legal/PrivacyPage.tsx"],
  { eager: true }
);

const mod = Object.values(mods)[0];

const Privacy = (mod && mod.default) || function PrivacyFallback() {
  return (
    <section style={{ padding: 24 }}>
      <h1>Privacy</h1>
      <p>Contenuto non disponibile in questa build.</p>
    </section>
  );
};

export default Privacy;