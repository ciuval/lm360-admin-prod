// src/pages/PublicProfilesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Toaster, toast } from "react-hot-toast";

const AVATAR = "/avatar.svg";
const PAGE_SIZE = 24;

export default function PublicProfilesPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) setUserId(data?.session?.user?.id ?? null);
      } catch {
        // nessun blocco: ok anche da anonimi
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function fetchPage(p) {
    // prova: profili_public (view consigliata)
    try {
      const from = p * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from("profili_public")
        .select("id,nome,ruolo,foto_url")
        .range(from, to);

      if (error) throw error;
      const safe = Array.isArray(data) ? data : [];
      safe.sort((a, b) => (a?.nome || "").localeCompare(b?.nome || ""));
      return { list: safe, usedView: true };
    } catch {
      // fallback: profili (solo campi sicuri)
      const { data: d2, error: e2 } = await supabase
        .from("profili")
        .select("id,nome,ruolo")
        .range(p * PAGE_SIZE, p * PAGE_SIZE + PAGE_SIZE - 1);
      if (e2) throw e2;
      const safe = (Array.isArray(d2) ? d2 : []).map(r => ({ ...r, foto_url: null }));
      safe.sort((a, b) => (a?.nome || "").localeCompare(b?.nome || ""));
      return { list: safe, usedView: false };
    }
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { list } = await fetchPage(0);
        if (!alive) return;
        setRows(list);
        setPage(0);
        setHasMore(list.length === PAGE_SIZE);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Impossibile caricare i profili.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  async function loadMore() {
    try {
      const next = page + 1;
      const { list } = await fetchPage(next);
      setRows(prev => [...prev, ...list]);
      setPage(next);
      setHasMore(list.length === PAGE_SIZE);
    } catch (e) {
      toast.error("Impossibile caricare altri profili");
    }
  }

  // ricerca solo su "nome" (campo certo)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => (r?.nome || "").toLowerCase().includes(q));
  }, [rows, query]);

  async function registraVisita(profiloVisitato) {
    if (!userId || userId === profiloVisitato) return;
    try {
      // best-effort; se la tabella non c'è, ignora
      await supabase.from("visite").insert([{ visitatore_id: userId, profilo_visitato: profiloVisitato }]);
    } catch {}
  }

  return (
    <div style={wrap}>
      <Toaster position="top-right" />
      <h2 style={title}>🌐 Profili Pubblici</h2>

      <input
        type="text"
        placeholder="Cerca per nome…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={search}
        aria-label="Cerca profili per nome"
      />

      {loading && <p style={{ opacity: 0.8 }}>Caricamento…</p>}
      {err && (
        <div style={errBox}>
          <p>Impossibile caricare i profili.</p>
          <small style={{ opacity: 0.7 }}>{String(err)}</small>
        </div>
      )}

      {!loading && !err && (
        <>
          {filtered.length === 0 ? (
            <p style={{ opacity: 0.8 }}>Nessun profilo trovato.</p>
          ) : (
            <ul style={grid}>
              {filtered.map((p) => (
                <li key={p.id} style={card}>
                  <Link
                    to={`/profilo/${encodeURIComponent(p.id)}`}
                    onClick={() => registraVisita(p.id)}
                    style={link}
                    aria-label={`Apri profilo di ${p?.nome || "utente"}`}
                  >
                    <img
                      src={p?.foto_url || AVATAR}
                      alt={p?.nome || "Avatar"}
                      onError={(e) => { e.currentTarget.src = AVATAR; }}
                      style={avatar}
                    />
                    <div>
                      <div style={name}>{p?.nome || "Senza nome"}</div>
                      <div style={role}>{(p?.ruolo || "free").toUpperCase()}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {hasMore && (
            <button type="button" onClick={loadMore} style={moreBtn}>
              Carica altri
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ---- Stili ---- */
const wrap = { padding: "1rem", background: "#121212", color: "#fff", minHeight: "100vh" };
const title = { color: "#f08fc0", textShadow: "0 0 8px #f08fc0", marginBottom: 10 };
const search = {
  width: "100%", maxWidth: 420, padding: "10px 12px", borderRadius: 8,
  background: "#1e1e1e", border: "1px solid #2b2b2b", color: "#fff", marginBottom: 12
};
const errBox = { background: "#2a1a1a", border: "1px solid #552", padding: 12, borderRadius: 8, marginTop: 8 };
const grid = {
  listStyle: "none", padding: 0, margin: 0,
  display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12
};
const card = { background: "#1c1c1c", border: "1px solid #2b2b2b", borderRadius: 10, overflow: "hidden" };
const link = { display: "flex", gap: 10, padding: 12, color: "inherit", textDecoration: "none", alignItems: "center" };
const avatar = { width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0 };
const name = { fontWeight: 600, marginBottom: 4 };
const role = { fontSize: 12, opacity: 0.75 };
const moreBtn = {
  marginTop: 16, padding: "10px 14px", borderRadius: 8, border: "none",
  background: "#1e88e5", fontWeight: 700, color: "#fff", cursor: "pointer"
};
