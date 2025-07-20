import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import TesterPage from "./pages/TesterPage";
import NewsletterPage from "./pages/NewsletterPage";
import TestSupabase from "./pages/TestSupabase";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePublicCard from "./pages/ProfilePublicCard";
import ChatBox from "./pages/ChatBox";
import DebugPage from "./pages/DebugPage";

export default function App() {
  return (
    <div
      style={{
        backgroundColor: "#121212",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <Toaster position="top-right" />

      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          padding: "1rem",
          backgroundColor: "#1e1e1e",
          boxShadow: "0 0 10px #f08fc0",
        }}
      >
        <Link to="/" style={link}>🏠 Home</Link>
        <Link to="/profilo" style={link}>👤 Profilo</Link>
        <Link to="/admin" style={link}>🛠️ Admin</Link>
        <Link to="/debug" style={link}>🧪 Debug</Link>
        <Link to="/tester" style={link}>🧬 Tester</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profilo" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profilo/:id" element={<ProfilePublicCard />} />
        <Route path="/tester" element={<TesterPage />} />
        <Route path="/chat/:id" element={<ChatBox />} />
        <Route path="/debug" element={<DebugPage />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="/testsupabase" element={<TestSupabase />} />
      </Routes>
    </div>
  );
}

function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ color: "#f08fc0" }}>💘 Benvenuto su LoveMatch360 💘</h1>
      <p>Questa è la homepage iniziale del progetto.</p>
    </main>
  );
}

const link = {
  color: "#f08fc0",
  textDecoration: "none",
  fontWeight: "bold",
};

