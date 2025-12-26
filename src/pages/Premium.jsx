import React from "react";

const mods = import.meta.glob(
  ["./AttivaPremium.jsx","./PremiumPage.jsx","./PremiumPage.tsx","./UpgradePrompt.jsx"],
  { eager: true }
);

const mod =
  mods["./AttivaPremium.jsx"] ||
  mods["./PremiumPage.jsx"] ||
  mods["./PremiumPage.tsx"] ||
  mods["./UpgradePrompt.jsx"] ||
  Object.values(mods)[0];

const Premium = (mod && mod.default) || function PremiumFallback() {
  return (
    <section style={{ padding: 24 }}>
      <h1>Premium</h1>
      <p>Pagina non disponibile in questa build.</p>
    </section>
  );
};

export default Premium;