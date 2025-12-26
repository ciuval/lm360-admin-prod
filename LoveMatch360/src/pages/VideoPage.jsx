import React, { useEffect, useState } from "react";
import FeatureToggle from "../components/FeatureToggle";
import { supabase } from "../lib/supabaseClient";

const shell = { display: "flex", gap: 16, padding: 16, maxWidth: 1200, margin: "0 auto" };
const left  = { width: 280, background: "#1e1e1e", borderRadius: 12, padding: 12 };
const main  = { flex: 1, minHeight: 400 };
const card  = { background: "#1e1e1e", borderRadius: 12, padding: 12 };

async function prereqAtLeastOnePost(userId) {
  try {
    const { count, error } = await supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);
    if (error) throw error;
    return { ok: (count || 0) >= 1, reason: "Serve almeno 1 📝 post" };
  } catch { return { ok: true }; }
}

export default function VideoPage({ userId }) {
  const [isPremium, setIsPremium] = useState(false);
  useEffect(() => {
    const FORCE = String(import.meta.env.VITE_FORCE_PREMIUM || "").toLowerCase() === "true";
    if (FORCE) { setIsPremium(true); return; }
    (async () => {
      if (!userId) { setIsPremium(false); return; }
      const { data } = await supabase
        .from("abbonamenti")
        .select("status").eq("user_id", userId).eq("status", "attivo").maybeSingle();
      setIsPremium(!!data);
    })();
  }, [userId]);

  return (
    <div style={shell}>
      <aside style={left}>
        <div style={{ fontWeight: 700, marginBottom: 10, color: "#f08fc0" }}>🎞️ Video</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
          <span>🔎</span>
          <input placeholder="Cerca video" style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid #333", background: "#121212", color: "#fff" }}/>
        </div>
        <div style={{ background: "#2a2a2a", borderRadius: 8, padding: 10, marginBottom: 8 }}>🏠 Home</div>
        <div style={{ background: "#2a2a2a", borderRadius: 8, padding: 10, marginBottom: 8 }}>🔴 In diretta</div>
        <div style={{ background: "#2a2a2a", borderRadius: 8, padding: 10, marginBottom: 8 }}>🎬 Reels</div>
        <div style={{ background: "#2a2a2a", borderRadius: 8, padding: 10, marginBottom: 8 }}>🧭 Esplora</div>
        <div style={{ background: "#2a2a2a", borderRadius: 8, padding: 10 }}>⭐ Salvati</div>
      </aside>

      <main style={main}>
        <div style={card}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <FeatureToggle userId={userId} featureKey="upload_video" label="Carica video" isPremium={isPremium} checkPrereq={prereqAtLeastOnePost}/>
            <FeatureToggle userId={userId} featureKey="reels"        label="Reels"        isPremium={isPremium} checkPrereq={prereqAtLeastOnePost}/>
            <FeatureToggle userId={userId} featureKey="live"         label="Live"         isPremium={isPremium} checkPrereq={prereqAtLeastOnePost}/>
          </div>
          <h3 style={{ margin: 0 }}>📺 Feed Video</h3>
          <p style={{ opacity: .8, marginTop: 8 }}>Segnaposto: qui aggiungeremo player, lista video, like/commenti.</p>
        </div>
      </main>
    </div>
  );
}

