import React from "react";

const mods = import.meta.glob(
  ["./ProfilePage.jsx","./ProfilePage.tsx","./SetupMFA.jsx"],
  { eager: true }
);

const mod =
  mods["./ProfilePage.jsx"] ||
  mods["./ProfilePage.tsx"] ||
  mods["./SetupMFA.jsx"] ||
  Object.values(mods)[0];

const Profile = (mod && mod.default) || function ProfileFallback() {
  return (
    <section style={{ padding: 24 }}>
      <h1>Profilo</h1>
      <p>Pagina non disponibile in questa build.</p>
    </section>
  );
};

export default Profile;