import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-hot-toast";

/**
 * Props:
 * - userId (uuid)
 * - featureKey (es. "stories")
 * - label (string)
 * - isPremium (bool) -> visibile solo ai premium
 * - checkPrereq?: async (userId) => { ok:boolean, reason?:string }
 * - onChange?: (enabled:boolean) => void
 * - loadCount?: async (userId, featureKey) => number
 * - countPollMs?: number (es. 5000)
 * - realtimeTable?: string (es. "posts")
 * - realtimeFilter?: (row) => boolean
 * - onRealtime?: (row) => void
 */
export default function FeatureToggle({
  userId,
  featureKey,
  label,
  isPremium,
  checkPrereq,
  onChange,
  loadCount,
  countPollMs = 0,
  realtimeTable,
  realtimeFilter,
  onRealtime,
}) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(null);

  // Carica stato attivazione (Supabase -> fallback localStorage)
  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!userId) { setEnabled(false); setLoading(false); return; }
      try {
        const { data, error } = await supabase
          .from("user_features")
          .select("enabled")
          .eq("user_id", userId)
          .eq("feature", featureKey)
          .maybeSingle();
        if (!ignore && !error && data) { setEnabled(!!data.enabled); setLoading(false); return; }
      } catch {}
      try {
        const v = localStorage.getItem(`uf:${userId}:${featureKey}`);
        if (!ignore) setEnabled(v === "1");
      } catch {}
      if (!ignore) setLoading(false);
    })();
    return () => { ignore = true; };
  }, [userId, featureKey]);

  // Conteggio (opzionale)
  useEffect(() => {
    let timer;
    let alive = true;
    async function doLoad() {
      if (!loadCount || !userId) return;
      try {
        const n = await loadCount(userId, featureKey);
        if (alive) setCount(Number.isFinite(n) ? n : null);
      } catch {}
    }
    doLoad();
    if (countPollMs > 0) timer = setInterval(doLoad, countPollMs);
    return () => { alive = false; if (timer) clearInterval(timer); };
  }, [userId, featureKey, loadCount, countPollMs]);

  // Realtime (opzionale)
  useEffect(() => {
    if (!realtimeTable) return;
    const ch = supabase
      .channel(`ft-${featureKey}`)
      .on("postgres_changes", { event: "*", schema: "public", table: realtimeTable }, (payload) => {
        const row = payload?.new ?? payload?.old ?? payload;
        if (!realtimeFilter || realtimeFilter(row)) {
          onRealtime?.(row);
          // se abbiamo un contatore, prova a ricaricarlo via loadCount
          if (loadCount && userId) {
            loadCount(userId, featureKey).then((n) => setCount(Number.isFinite(n) ? n : null)).catch(()=>{});
          }
        }
      })
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [realtimeTable, realtimeFilter, onRealtime, loadCount, userId, featureKey]);

  if (!isPremium) return null;

  const canActivate = !enabled && !loading;

  async function onActivate() {
    if (!userId) { toast.error("Devi accedere"); return; }
    if (checkPrereq) {
      const res = await checkPrereq(userId);
      if (!res.ok) { toast.error(res.reason || "Requisiti non soddisfatti"); return; }
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from("user_features")
        .upsert({ user_id: userId, feature: featureKey, enabled: true });
      if (error) throw error;
    } catch {
      try { localStorage.setItem(`uf:${userId}:${featureKey}`, "1"); } catch {}
    }
    setEnabled(true);
    setLoading(false);
    onChange?.(true);
    toast.success(`${label} attivata ✅`);
  }

  const style = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: enabled ? "var(--ok)" : "var(--err)",
    color: "#121212",
    borderRadius: 999,
    padding: "4px 10px",
    fontSize: 12,
    cursor: canActivate ? "pointer" : "default",
    opacity: loading ? 0.6 : 1,
    userSelect: "none",
    border: "none",
  };

  return (
    <span
      role="button"
      tabIndex={0}
      style={style}
      onClick={canActivate ? onActivate : undefined}
      onKeyDown={(e) => {
        if (e.key === "Enter" && canActivate) onActivate();
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(.96)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      aria-pressed={enabled}
      aria-label={`Attiva ${label}`}
    >
      {enabled ? "Attiva ✓" : "Attiva funzione"}{" "}
      <small style={{ opacity: 0.9 }}>({label})</small>
      {Number.isFinite(count) && (
        <span style={{ marginLeft: 6, background: "var(--elev)", color: "var(--txt)", borderRadius: 999, padding: "0 6px" }}>
          {count}
        </span>
      )}
    </span>
  );
}
