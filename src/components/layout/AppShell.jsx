import React from "react";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function AppShell({ children }) {
  return (
    <div className="app-shell" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
// vercel rebuild marker

