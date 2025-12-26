// src/pages/PublicProfilesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

const svgPlaceholder =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">
      <rect width="100%" height="100%" fill="#222"/>
      <circle cx="48" cy="38" r="18" fill="#3a3a3a"/>
      <rect x="16" y="64" width="64" height="20" rx="10" fill="#333"/>
    </svg>`
  );

export default function PublicProfilesPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  // tenta selezioni progressive finché una non fallisce
  async function load() {
    setLoading(true);

    const tries = [
      // View consigliata se esiste
      { table: "profili_public", cols: "id,nome,ruolo,foto_url,avatar_url" },
      // Tabella profili con tutte le varianti
      { table: "profili", cols: "id,nome,ruolo,foto_url,avatar_url", filters: { pubblico: true } },
      { table: "profili", cols: "id,nome,ruolo,avatar_url", filters: { pubblico: true } },
      { table: "profili", cols: "id,nome,ruolo", filters: { pubblico: true } },
      // Ultimo fallback: nessun filtro pubblico
      { table: "profili", cols: "id,nome,ruolo,avatar_url" },
      { table: "profili", cols: "id,nome,ruolo" },
    ];

    let got = null;
    for (const t of tries) {
      try {
        let q = supabase.from(t.table).select(t.cols).order("nome", { ascending: true });

        // filtri robusti (se la colonna non esiste PostgREST dà 400 → catch)
        try {
          q = q.eq("status_account", "attivo");
        } catch {}
        if (t.filters?.pubblico) {
          try {
            q = q.eq("profilo_pubblico", true);
          } catch {}
        }

        const { data, error } = await q;
        if (error) throw error;
        got = data ?? [];
        break;
      } catch (e) {
        // tenta il prossimo
      }
    }

    setRows(Array.isArray(got) ? got : []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) => (r.nome || "").toLowerCase().includes(needle));
  }, [q, rows]);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "1rem" }}>
      <h2 style={{ color: "#f08fc0" }}>Profili pubblici</h2>

      <div style={{ display: "flex", gap: 8, margin: "12px 0 18px" }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca per nome…"
          aria-label="Cerca per nome"
          style={inputStyle}
        />
        <Link to="/match" style={buttonStyle}>Vai ai match</Link>
      </div>

      {loading ? (
        <p>Caricamento…</p>
      ) : filtered.length === 0 ? (
        <p>Nessun profilo trovato.</p>
      ) : (
        <ul style={gridStyle} aria-live="polite">
          {filtered.map((r) => (
            <li key={r.id} style={cardStyle}>
              <img
                src={r.foto_url || r.avatar_url || svgPlaceholder}
                alt={r.nome ? `Avatar di ${r.nome}` : "Avatar"}
                width={72}
                height={72}
                style={{ borderRadius: 12, objectFit: "cover" }}
                onError={(e) => (e.currentTarget.src = svgPlaceholder)}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{r.nome || "—"}</div>
                <div style={{ opacity: 0.7, fontSize: 13 }}>{r.ruolo || "free"}</div>
              </div>
              <Link to={`/profilo/${r.id}`} style={smallBtn}>Vedi profilo</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const inputStyle = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #333",
  background: "#1c1c1c",
  color: "#fff",
  outline: "none",
};

const buttonStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  background: "#2b6cb0",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 600,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 12,
  listStyle: "none",
  padding: 0,
};

const cardStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: 12,
  background: "#181818",
  border: "1px solid #2a2a2a",
  borderRadius: 10,
};

const smallBtn = {
  padding: "8px 10px",
  borderRadius: 8,
  background: "#444",
  color: "#fff",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 600,
};


