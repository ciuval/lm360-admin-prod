import { useEffect, useState } from "react";
import notifySound from "../assets/notify.mp3";

export default function BadgeRichiestePremium({ onClick }) {
  const [attivo, setAttivo] = useState(false);

  useEffect(() => {
    const audio = new Audio(notifySound);
    if (attivo) {
      audio.play().catch(() => {});
    }
  }, [attivo]);

  return (
    <button
      onClick={() => {
        setAttivo(true);
        onClick && onClick();
      }}
      style={{
        backgroundColor: "#f08fc0",
        color: "#000",
        padding: "0.2rem 0.6rem",
        borderRadius: "999px",
        marginLeft: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
        border: "none",
      }}
    >
      ⚡️ Richieste
    </button>
  );
}

