// src/pages/VisitatoriPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function VisitatoriPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // prendo l’utente loggato
        const { data: s } = await supabase.auth.getSession();
        const uid = s?.session?.user?.id;
        if (!uid) {
          if (alive) setRows([]);
          return;
        }

        // 1) provo l'RPC se presente
        const { data, error } = await supabase.rpc("visitatori_recenti", {
          p_user_id: uid,
          p_hours: 48,
        });

        if (!error && Array.isArray(data)) {
          if (alive) setRows(data);
          return;
        }

        // 2) fallback: lettura diretta tabella "visite"
        const { data: fallback } = await supabase
          .from("visite")
          .select("id, profilo_visitante, created_at")
          .eq("profilo_visitato", uid)
          .order("created_at", { ascending: false })
          .limit(50);

        if (alive) setRows(fallback || []);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-pink-300 font-semibold mb-3">Chi ti ha visitato</h2>
        <div>Carico…</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-pink-300 font-semibold mb-3">Chi ti ha visitato</h2>

      {rows.length === 0 && (
        <div className="opacity-70">Nessuna visita trovata.</div>
      )}

      <ul className="space-y-2">
        {rows.map((v) => {
          const visitatoreId = v.visitatore_id || v.profilo_visitante || null;
          const when = v.visita_at || v.created_at;
          return (
            <li
              key={v.id}
              className="rounded-md border border-zinc-700 bg-zinc-800 p-3 flex items-center justify-between"
            >
              <div>
                <div className="text-sm opacity-70">
                  {when ? new Date(when).toLocaleString() : "—"}
                </div>
                <div className="font-medium">
                  Visitatore: {visitatoreId ? visitatoreId : "anonimo"}
                </div>
              </div>
              {visitatoreId && (
                <Link
                  className="px-3 py-1 rounded bg-pink-600 text-white"
                  to={`/profilo/${visitatoreId}`}
                >
                  Vedi
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

