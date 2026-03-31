import React, { useEffect, useState } from "react";
import HeroAB from "../components/HeroAB";
import { loadCurrentAccountTier } from "../lib/accountTier";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);

        const result = await loadCurrentAccountTier();

        if (!alive) return;

        setIsAuthed(Boolean(result?.isAuthed));
        setUserId(result?.user?.id || null);
      } catch {
        if (!alive) return;

        setIsAuthed(false);
        setUserId(null);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <HeroAB userId={userId} />

      <div style={{ padding: "2rem" }}>
        <h1 style={{ color: "#f08fc0" }}>🏠 💘 🧭 Benvenuto nell sito "Love Match 360"!</h1>

        <p style={{ marginTop: "1rem", color: "#ccc" }}>
          {loading
            ? "Caricamento stato account..."
            : isAuthed
              ? "Bentornato. Il tuo account è attivo."
              : "Non sei loggato."}
        </p>
      </div>
    </>
  );
}