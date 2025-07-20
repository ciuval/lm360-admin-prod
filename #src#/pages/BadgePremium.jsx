import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import notificationSound from "../assets/notify.mp3"; // 🔔 aggiungi file audio in /assets

export default function BadgeRichiestePremium({ onClick }) {
  const [conteggio, setConteggio] = useState(0);
  const [audio] = useState(typeof Audio !== "undefined" ? new Audio(notificationSound) : null);

  useEffect(() => {
    const fetchConteggio = async () => {
      const { count, error } = await supabase
        .from("profili")
        .select("id", { count: "exact", head: true })
        .eq("stato_premium", "in_attesa");

      if (!error) setConteggio(count);
    };

    fetchConteggio();

    const channel = supabase
      .channel("badge_richieste")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "profili",
        },
        () => {
          fetchConteggio();
          if (audio) audio.play();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profili",
          filter: "stato_premium=eq.in_attesa",
        },
        () => fetchConteggio()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [audio]);

  if (conteggio === 0) return null;

  return (
    <button
      onClick={onClick}
      className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse hover:scale-105 transition-transform"
    >
      {conteggio} richieste
    </button>
  );
}
