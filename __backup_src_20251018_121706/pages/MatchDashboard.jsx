// src/pages/MatchDashboard.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import LazyImage from "../components/LazyImage";

export default function MatchDashboard() {
  const [matchList, setMatchList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const id = session?.user?.id || "vale-test-id"; // fallback test
      setUserId(id);

      if (!id) {
        setLoading(false);
        return;
      }

      const { data: matches, error: matchErr } = await supabase
        .from("match_scores")
        .select("matched_user_id, score")
        .eq("user_id", id)
        .eq("score", 100)
        .order("score", { ascending: false });

      if (matchErr) {
        console.error("Errore caricamento match:", matchErr);
        setLoading(false);
        return;
      }

      if (!matches?.length) {
        setMatchList([]);
        setLoading(false);
        return;
      }

      const ids = matches.map((m) => m.matched_user_id);

      const { data: profili, error: profiliErr } = await supabase
        .from("profili")
        .select("id, nome, eta, bio, interessi, foto_url")
        .in("id", ids);

      if (profiliErr) {
        console.error("Errore caricamento profili:", profiliErr);
        setLoading(false);
        return;
      }

      const uniti = matches.map((m) => ({
        ...m,
        profilo: profili.find((p) => p.id === m.matched_user_id),
      }));

      setMatchList(uniti);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  return (
    <div className="p-6 bg-dark min-h-screen text-light font-sans">
      <h2 className="text-2xl font-bold text-primary mb-6">💘 Match Trovati</h2>

      {loading ? (
        <p>⏳ Caricamento...</p>
      ) : matchList.length === 0 ? (
        <p>Nessun match trovato. Inizia a lasciare qualche 💗!</p>
      ) : (
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {matchList.map(({ score, profilo }) => (
            <li
              key={profilo.id}
              className="bg-[#1e1e1e] rounded-xl p-4 flex flex-col gap-2 shadow-lg border border-primary/40"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <LazyImage
                    src={profilo.foto_url || "/default-avatar.png"}
                    alt={profilo.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <strong>{profilo.nome}, {profilo.eta}</strong>
                  <p className="text-gray-400 text-sm">
                    {profilo.bio?.slice(0, 60)}
                    {profilo.bio?.length > 60 ? "..." : ""}
                  </p>
                  <p className="text-gray-500 text-xs">🎯 {profilo.interessi}</p>
                </div>
              </div>

              <span className="text-primary font-semibold">
                💘 Match Score: {score}%
              </span>

              <div className="flex gap-2 mt-2">
                <Link
                  to={`/profilo/${profilo.id}`}
                  className="px-3 py-2 rounded-lg bg-dark border border-primary text-primary hover:bg-primary hover:text-white transition flex-1 text-center"
                >
                  Vedi Profilo
                </Link>
                <Link
                  to={`/chat/${profilo.id}`}
                  className="px-3 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-pink-600 transition flex-1 text-center"
                >
                  💬 Chatta
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
