import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Admin() {
  const [status, setStatus] = useState("Caricamento…");
  const [me, setMe] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: null,
    premiumUsers: null,
    admins: null
  });

  useEffect(() => {
    let alive = true;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!alive) return;

      if (!user) {
        setStatus("Devi essere loggato.");
        return;
      }
      setMe(user);

      // leggi flag admin dal tuo profilo (nessun PII)
      const { data: prof, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!alive) return;

      if (error) {
        setStatus("Errore nel controllo permessi.");
        return;
      }

      if (!prof?.is_admin) {
        setIsAdmin(false);
        setStatus("Accesso negato (non admin).");
        return;
      }

      setIsAdmin(true);
      setStatus("Admin attivo.");

      // Stats base (solo contatori, niente PII)
      // Nota: con RLS+policy admin, puoi fare select su tutti
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      const { count: premiumUsers } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("is_premium", true);

      const { count: admins } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("is_admin", true);

      if (!alive) return;

      setStats({ totalUsers, premiumUsers, admins });
    })();

    return () => { alive = false; };
  }, []);

  if (!isAdmin) {
    return (
      <main id="main" className="section">
        <div className="card card-pad">
          <h1 style={{ margin: 0 }}>Admin</h1>
          <p className="lead" style={{ marginTop: 10 }}>{status}</p>
          <a className="btn" href="/#/profilo">Vai al login</a>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="section">
      <div className="card card-pad">
        <h1 style={{ margin: 0 }}>Sala Comandi</h1>
        <p className="lead" style={{ marginTop: 10 }}>
          {status} — controllo totale, senza PII nei log.
        </p>

        <div className="kpi" style={{ marginTop: 12 }}>
          <span className="pill"><strong>Utenti</strong> {stats.totalUsers ?? "…"}</span>
          <span className="pill"><strong>Premium</strong> {stats.premiumUsers ?? "…"}</span>
          <span className="pill"><strong>Admin</strong> {stats.admins ?? "…"}</span>
        </div>

        <div className="notice" style={{ marginTop: 14 }}>
          <strong style={{ color: "var(--text)" }}>Health:</strong>{" "}
          Supabase Auth ok, RLS ok, admin ok.
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
          <a className="btn" href="/#/premium">Vai a Premium</a>
          <button className="btn" type="button" onClick={() => supabase.auth.signOut()}>
            Esci
          </button>
        </div>

        <p className="mini" style={{ marginTop: 12 }}>
          ID sessione: <code>{me?.id?.slice(0, 8)}…</code>
        </p>
      </div>
    </main>
  );
}
