// src/pages/ChatIndex.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-hot-toast";

/**
 * Elenco conversazioni dell'utente:
 * - legge gli ultimi messaggi (mittente/destinatario = userId)
 * - raggruppa per interlocutore
 * - conta i non letti
 * - realtime su INSERT
 */
export default function ChatIndex({ userId }) {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);      // messaggi grezzi
  const [profiles, setProfiles] = useState({}); // id -> profilo

  // Carica ultimi messaggi (uso select("*") per non sbattere con nomi colonne diversi)
  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("messaggi")
          .select("*")
          .or(`mittente_id.eq.${userId},destinatario_id.eq.${userId}`)
          .order("created_at", { ascending: false })
          .limit(300);
        if (error) throw error;
        if (!active) return;
        setRows(data || []);
      } catch (e) {
        console.error(e);
        toast.error("Impossibile caricare le conversazioni");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [userId]);

  // Carica i profili degli interlocutori
  useEffect(() => {
    if (!rows?.length) return;
    const peers = Array.from(
      new Set(
        rows.map(r => (r.mittente_id === userId ? r.destinatario_id : r.mittente_id))
      )
    ).filter(Boolean);
    if (!peers.length) return;

    (async () => {
      try {
        const { data } = await supabase
          .from("profili")
          .select("*")
          .in("id", peers);
        const map = {};
        (data || []).forEach(p => { map[p.id] = p; });
        setProfiles(map);
      } catch (e) {
        console.warn("profili lookup:", e);
      }
    })();
  }, [rows, userId]);

  // Realtime nuove entry in "messaggi"
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel("chat-index")
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "messaggi" },
        (payload) => {
          const m = payload?.new;
          if (!m) return;
          if (m.mittente_id !== userId && m.destinatario_id !== userId) return;
          setRows(prev => [m, ...prev]); // prepend ultimo messaggio
        }
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [userId]);

  // Raggruppa per interlocutore e calcola non letti
  const conv = useMemo(() => {
    const byPeer = new Map();
    for (const m of rows) {
      const peer = m.mittente_id === userId ? m.destinatario_id : m.mittente_id;
      if (!peer) continue;
      const entry = byPeer.get(peer) || { last: null, unread: 0, total: 0 };
      if (!entry.last) entry.last = m; // lista già desc → primo visto è l’ultimo
      entry.total++;
      // supporta 'letto' o 'read' come flag
      const isUnread = (m.destinatario_id === userId) && (m.letto === false || m.read === false);
      if (isUnread) entry.unread++;
      byPeer.set(peer, entry);
    }
    return Array.from(byPeer.entries()).map(([peerId, info]) => {
      const p = profiles[peerId] || {};
      const title = p.nome || p.username || p.email || (peerId?.slice(0, 6) + "…");
      const avatar = p.avatar_url || p.photo_url || null;

      // trova un testo anteprima tra varie possibili chiavi
      const last = info.last || {};
      const preview =
        last.testo ?? last.text ?? last.message ?? last.body ?? last.contenuto ?? "—";

      return { peerId, title, avatar, preview, unread: info.unread, total: info.total };
    });
  }, [rows, profiles, userId]);

  const openChat = (peerId, unread) => {
    // scala il badge header subito
    if (unread > 0) {
      try {
        window.dispatchEvent(new CustomEvent("unread-decrement", { detail: unread }));
      } catch {}
    }
    nav(`/chat/${peerId}`);
  };

  return (
    <section className="lm360-section">
      <h2>Le tue conversazioni</h2>

      {loading ? (
        <div className="muted" style={{ padding: 12 }}>Carico…</div>
      ) : conv.length === 0 ? (
        <div className="muted" style={{ padding: 12 }}>
          Nessuna chat ancora. Inizia dai <a href="#/match">Match</a> o esplora <a href="#/profili-pubblici">Persone</a>.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {conv.map(c => (
            <button
              key={c.peerId}
              onClick={() => openChat(c.peerId, c.unread)}
              className="btn"
              style={{
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderRadius: 12,
                background: "var(--card)",
                border: "1px solid var(--border)",
                padding: 12,
              }}
            >
              <div
                style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "#1f2230", flexShrink: 0,
                  backgroundImage: c.avatar ? `url(${c.avatar})` : "none",
                  backgroundSize: "cover", backgroundPosition: "center",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <strong style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.title}
                  </strong>
                  {c.unread > 0 && (
                    <span style={{
                      marginLeft: "auto", padding: "2px 8px",
                      borderRadius: 999, fontSize: 12,
                      background: "var(--accent)", color: "#101014", fontWeight: 700
                    }}>
                      {c.unread > 99 ? "99+" : c.unread}
                    </span>
                  )}
                </div>
                <div className="muted" style={{
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                }}>
                  {c.preview}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
