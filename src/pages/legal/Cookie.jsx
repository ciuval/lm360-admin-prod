import React from "react";

const mods = import.meta.glob(
  ["../Legal/Cookie.jsx","../Legal/Cookie.tsx","../Legal/CookiePage.jsx","../Legal/CookiePage.tsx"],
  { eager: true }
);

const mod = Object.values(mods)[0];

const Cookie = (mod && mod.default) || function CookieFallback() {
  return (
    <section style={{ padding: 24 }}>
      <h1>Cookie</h1>
      <p>Contenuto non disponibile in questa build.</p>
    </section>
  );
};

export default Cookie;