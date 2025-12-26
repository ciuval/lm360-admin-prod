import React from "react";

const mods = import.meta.glob(
  ["../Legal/Refunds.jsx","../Legal/Refunds.tsx","../Legal/RefundsPage.jsx","../Legal/RefundsPage.tsx"],
  { eager: true }
);

const mod = Object.values(mods)[0];

const Refunds = (mod && mod.default) || function RefundsFallback() {
  return (
    <section style={{ padding: 24 }}>
      <h1>Rimborsi</h1>
      <p>Contenuto non disponibile in questa build.</p>
    </section>
  );
};

export default Refunds;