import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import TestSupabase from "./pages/TestSupabase";

export default function App() {
  return (
    <div style={{ backgroundColor: "#121212", color: "white", minHeight: "100vh", fontFamily: "monospace" }}>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #444" }}>
        <Link to="/testsupabase" style={{ color: "#f08fc0", marginRight: "1rem" }}>
          Test Supabase
        </Link>
      </nav>
      <Routes>
        <Route path="/testsupabase" element={<TestSupabase />} />
      </Routes>
    </div>
  );
}
