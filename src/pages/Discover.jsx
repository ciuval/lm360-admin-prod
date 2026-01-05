import React from "react";

const mods = import.meta.glob(
  ["./PublicProfilesPage.jsx","./DiscoverPage.jsx","./VisitatoriPage.jsx","./GuidesIndex.jsx"],
  { eager: true }
);

const mod =
  mods["./PublicProfilesPage.jsx"] ||
  mods["./DiscoverPage.jsx"] ||
  mods["./VisitatoriPage.jsx"] ||
  mods["./GuidesIndex.jsx"] ||
  Object.values(mods)[0];

const Discover = (mod && mod.default) || function DiscoverFallback() {
  return (
    <section style={{ padding: 24 }}>
      <h1>Scopri</h1>
      <p>Pagina non disponibile in questa build.</p>
    </section>
  );
};

export default Discover;