import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Billing() {
  const [msg, setMsg] = useState("Caricamento…");
  const [me, setMe] = useState(null);
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    let alive = true;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!alive) return;

      if (!user) {
        setMsg("Devi essere loggato.");
        return;
      }
      setMe(user);

      const { data: prof } = await supabase
        .from("profiles")
        .select("is_premium,premium_until,stripe_customer_id,stripe_subscription_id")
        .eq("id", user.id)
        .single();

      const { data: ev } = await supabase
        .from("billing_events")
        .select("created_at,stripe_event_type,amount,currency,status,stripe_invoice_id,stripe_payment_intent_id")
        .order("created_at", { ascending: false })
        .limit(50);

      const { data: rr } = await supabase
        .from("refund_requests")
        .select("created_at,status,mode,reason,amount,currency")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!alive) return;

      setProfile(prof || null);
      setEvents(ev || []);
      setRefunds(rr || []);
      setMsg("");
    })();

    return () => { alive = false; };
  }, []);

  const openPortal = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) {
      alert("Devi essere loggato.");
      return;
    }

    const res = await fetch("/api/stripe-portal", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      alert("Portal non disponibile.");
      return;
    }

    const json = await res.json();
    if (json?.url) window.location.assign(json.url);
  };

  const requestRefund = async () => {
    if (!me) return;

    // richiesta MANUALE (owner-friendly): crea record pending (lo gestisci tu o cron se vuoi)
    const { error } = await supabase.from("refund_requests").insert({
      user_id: me.id,
      mode: "manual",
      status: "pending",
      reason: "user_requested"
    });

    if (error) alert("Impossibile inviare richiesta.");
    else alert("Richiesta inviata.");
  };

  const premiumLabel = (() => {
    const until = profile?.premium_until ? new Date(profile.premium_until).getTime() : 0;
    const valid = until && until > Date.now();
    if (profile?.is_premium || valid) return "Premium attivo";
    return "Premium non attivo";
  })();

  return (
    <main id="main" className="section">
      <div className="card card-pad">
        <h1 style={{ margin: 0 }}>Billing</h1>
        {msg && <p className="lead" style={{ marginTop: 10 }}>{msg}</p>}

        {!msg && (
          <>
            <div className="kpi" style={{ marginTop: 12 }}>
              <span className="pill"><strong>Stato</strong> {premiumLabel}</span>
              <span className="pill"><strong>Premium until</strong> {profile?.premium_until ? new Date(profile.premium_until).toLocaleString() : "—"}</span>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <button className="btn primary" type="button" onClick={openPortal}>
                Gestisci abbonamento
              </button>
              <button className="btn" type="button" onClick={requestRefund}>
                Richiedi rimborso
              </button>
            </div>

            <h2 style={{ marginTop: 18 }}>Storico eventi</h2>
            <div className="notice" style={{ marginTop: 10 }}>
              {events.length === 0 ? "Nessun evento." : (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {events.map((e, idx) => (
                    <li key={idx}>
                      <strong>{new Date(e.created_at).toLocaleString()}</strong>{" "}
                      — {e.stripe_event_type} — {e.status || "—"}{" "}
                      {typeof e.amount === "number" ? `— ${(e.amount / 100).toFixed(2)} ${String(e.currency || "").toUpperCase()}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <h2 style={{ marginTop: 18 }}>Rimborsi</h2>
            <div className="notice" style={{ marginTop: 10 }}>
              {refunds.length === 0 ? "Nessuna richiesta." : (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {refunds.map((r, idx) => (
                    <li key={idx}>
                      <strong>{new Date(r.created_at).toLocaleString()}</strong>{" "}
                      — {r.mode} — {r.status} — {r.reason || "—"}{" "}
                      {typeof r.amount === "number" ? `— ${(r.amount / 100).toFixed(2)} ${String(r.currency || "").toUpperCase()}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
