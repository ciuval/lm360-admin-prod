// src/pages/Home.jsx
import React from "react";
import HeroAB from "../components/HeroAB";

export default function Home({ sessionUserId }) {
  return (
    <>
      <HeroAB userId={sessionUserId} />
      <div style={{ padding: "2rem" }}>
        <h1 style={{ color: "#f08fc0" }}>🏠💘🧭 Benvenuto in LoveMatch360!</h1>
        <p style={{ marginTop: "1rem", color: "#ccc" }}>
          {sessionUserId ? `Sei loggato come: ${sessionUserId}` : "Non sei loggato."}
        </p>
      </div>
    </>
  );
}

