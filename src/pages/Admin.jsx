import React from "react";

const mods = import.meta.glob(
  ["./AdminPage.jsx","./AdminPanel.jsx","./DashboardAdmin.jsx"],
  { eager: true }
);

const mod =
  mods["./AdminPage.jsx"] ||
  mods["./AdminPanel.jsx"] ||
  mods["./DashboardAdmin.jsx"] ||
  Object.values(mods)[0];

const Admin = (mod && mod.default) || function AdminFallback() {
  return (
    <section style={{ padding: 24 }}>
      <h1>Admin</h1>
      <p>Pagina admin non disponibile in questa build.</p>
    </section>
  );
};

export default Admin;