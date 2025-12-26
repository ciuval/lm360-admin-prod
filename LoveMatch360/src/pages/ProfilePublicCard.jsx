// src/pages/ProfilePublicCard.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const AVATAR = "/avatar.svg";

export default function ProfilePublicCard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [profilo, setProfilo] = useState(null);
  const [isMatch, setIsMatch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { data: session } = await supabase.auth.getSession();
        if (alive) setMe(session?.session?.user?.id ?? null);

        // 1) View ricca
        try {
          const { data, error } = await supabase
            .from("profili_public")
            .select("id,nome,ruolo,foto_url,bio,interessi")
            .eq("id", id)
            .maybeSingle();
          if (error) throw error;
          if (data) {
            if (alive) setProfilo(data);
          } else {
            throw new Error("not-found");
          }
        } catch {
          // 2) Fallback basico
          const { data: d2, error: e2 } = await supabase
            .from("profili")
            .select("id,nome,ruolo")
            .eq("id", id)
            .maybeSingle();
          if (e2) throw e2;
          if (!d2) throw new Error("Profilo non trovato.");
          if (alive) setProfilo({ ...d2, foto_url: null });
        }

        // Match reciproco (best-effort)
        if (me && id) {
          let matched = false;
          try {
            // preferita: view flat
            const { data: f1 } = await supabase
              .from("match_scores_flat")
              .select("id")
              .eq("user_id", me)
              .eq("matched_user_id", id)
              .eq("score", 100)
              .maybeSingle();
            const { data: f2 } = await supabase
              .from("match_scores_flat")
              .select("id")
              .eq("user_id", id)
              .eq("matched_user_id", me)
              .eq("score", 100)
              .maybeSingle();
            matched = !!(f1 && f2);
          } catch {
            // fallback simmetrico “classico”
            try {
              const { data: m1 } = await supabase
                .from("match_scores")
                .select("id")
                .eq("user_id", me)
                .eq("matched_user_id", id)
                .eq("score", 100)
                .maybeSingle();
              const { data: m2 } = await supabase
                .from("match_scores")
                .select("id")
                .eq("user_id", id)
                .eq("matched_user_id", me)
                .eq("score", 100)
                .maybeSingle();
              matched = !!(m1 && m2);
            } catch {
              matched = false;
            }
          }
          if (alive) setIsMatch(matched);
        }
      } catch (e) {
        if (alive) setErr(e?.message || "Impossibile caricare il profilo.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  if (loading) {
    return (
      <div style={wrap}>
        <button onClick={() => navigate(-1)} style={backBtn}>← Indietro</button>
        <p style={{ opacity: 0.8 }}>Caricamento…</p>
      </div>
    );
  }
  if (err || !profilo) {
    return (
      <div style={wrap}>
        <button onClick={() => navigate(-1)} style={backBtn}>← Indietro</button>
        <p style={{ color: "#f88" }}>Impossibile caricare il profilo.</p>
        {err && <small style={{ opacity: 0.7 }}>{String(err)}</small>}
      </div>
    );
  }

  return (
    <div style={wrap}>
      <button onClick={() => navigate(-1)} style={backBtn}>← Indietro</button>

      <div style={card}>
        <img
          src={profilo?.foto_url || AVATAR}
          alt={profilo?.nome || "Avatar"}
          onError={(e) => { e.currentTarget.src = AVATAR; }}
          style={hero}
        />
        <h2 style={title}>{profilo?.nome || "Senza nome"} {isMatch && <span style={badge}>💘 Match</span>}</h2>
        <div style={role}>{(profilo?.ruolo || "free").toUpperCase()}</div>

        {profilo?.bio && (
          <>
            <h3 style={h3}>Bio</h3>
            <p style={text}>{profilo.bio}</p>
          </>
        )}
        {profilo?.interessi && (
          <>
            <h3 style={h3}>Interessi</h3>
            <p style={text}>
              {Array.isArray(profilo.interessi) ? profilo.interessi.join(", ") : String(profilo.interessi)}
            </p>
          </>
        )}

        {isMatch && me && (
          <button
            type="button"
            onClick={() => navigate(`/chat/${encodeURIComponent(id)}`)}
            style={chatBtn}
            aria-label="Apri chat"
          >
            💬 Chatta ora
          </button>
        )}
      </div>
    </div>
  );
}

/* ---- Stili ---- */
const wrap = { padding: "1rem", maxWidth: 760, margin: "0 auto", color: "#fff" };
const backBtn = { border: "1px solid #2b2b2b", background: "transparent", color: "#fff", padding: "6px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 12 };
const card = { background: "#1c1c1c", border: "1px solid #2b2b2b", borderRadius: 12, padding: 16 };
const hero = { width: "100%", maxHeight: 280, objectFit: "cover", borderRadius: 10, background: "#0f0f0f" };
const title = { color: "#f08fc0", textShadow: "0 0 8px #f08fc0", margin: "10px 0" };
const role = { opacity: 0.8, marginBottom: 10 };
const badge = { marginLeft: 8, padding: "2px 6px", borderRadius: 6, background: "#f08fc0", color: "#fff", fontSize: 12, fontWeight: 700 };
const h3 = { marginTop: 12, marginBottom: 6 };
const text = { opacity: 0.92, lineHeight: 1.55 };
const chatBtn = { marginTop: 12, padding: "10px 14px", border: "none", borderRadius: 8, background: "#1e88e5", color: "#fff", fontWeight: 700, cursor: "pointer" };
