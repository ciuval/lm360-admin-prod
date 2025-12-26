// src/pages/Paywall.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Paywall() {
  const navigate = useNavigate();

  const checkout = async () => {
    alert("🔐 Simulazione: verrai reindirizzato a Stripe per il pagamento premium");
    navigate("/profilo");
  };

  return (
    <motion.div
      style={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2 style={titleStyle} initial={{ y: -20 }} animate={{ y: 0 }}>🌟 Passa a LoveMatch360 Premium</motion.h2>
      <motion.p style={descStyle} initial={{ y: -10 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
        Sblocca tutte le funzionalità esclusive:
      </motion.p>
      <motion.ul style={listStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <li>💘 Chatta senza limiti</li>
        <li>🌐 Visibilità prioritaria nei risultati</li>
        <li>👀 Scopri chi ha visitato il tuo profilo</li>
        <li>🎯 Match consigliati in tempo reale</li>
      </motion.ul>
      <motion.button
        style={ctaBtn}
        onClick={checkout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        💎 Attiva Premium a 9.99€/mese
      </motion.button>
    </motion.div>
  );
}

const containerStyle = {
  padding: "2rem",
  backgroundColor: "#121212",
  color: "#fff",
  textAlign: "center",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', sans-serif",
};

const titleStyle = {
  fontSize: "2rem",
  color: "#f08fc0",
  marginBottom: "1rem",
};

const descStyle = {
  fontSize: "1.2rem",
  marginBottom: "1rem",
};

const listStyle = {
  textAlign: "left",
  maxWidth: "400px",
  margin: "0 auto 2rem auto",
  listStyle: "none",
  padding: 0,
  lineHeight: "1.8",
  fontSize: "1.1rem",
};

const ctaBtn = {
  padding: "1rem 2rem",
  fontSize: "1.1rem",
  backgroundColor: "#f08fc0",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  boxShadow: "0 0 10px #f08fc0",
};

