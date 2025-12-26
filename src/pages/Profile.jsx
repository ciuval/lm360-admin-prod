import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let alive = true;

    const sync = async () => {
      setLoading(true);

      // warm up session
      await supabase.auth.getSession();
      const { data: { user } } = await supabase.auth.getUser();

      if (!alive) return;

      setUser(user ?? null);
      setLoading(false);

      // ✅ se c'è destinazione post-login, vai lì
      if (user) {
        try {
          const go = localStorage.getItem("lm360_after_login");
          if (go) {
            localStorage.removeItem("lm360_after_login");
            // go è tipo "/premium?cs=..."
            window.location.assign("/#" + go);
          }
        } catch {}
      }
    };

    sync();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      sync();
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const signIn = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!email || !password) {
      setMsg("Inserisci email e password.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMsg("Login non riuscito. Controlla i dati.");
      return;
    }

    setMsg("Login effettuato.");
    // redirect gestito dall’effetto (legge lm360_after_login)
  };

  const signOut = async () => {
    setMsg("");
    await supabase.auth.signOut();
    setUser(null);
    setMsg("Logout effettuato.");
  };

  return (
    <main id="main" className="section">
      <div className="card card-pad">
        <h1 style={{ margin: 0 }}>Profilo</h1>

        {loading && (
          <p className="lead" style={{ marginTop: 10 }}>Caricamento…</p>
        )}

        {!loading && user && (
          <>
            <p className="lead" style={{ marginTop: 10 }}>
              Sei loggato. Ora Premium può attivarsi e mostrarsi correttamente.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              <a className="btn" href="/#/premium">Vai a Premium</a>
              <button className="btn" type="button" onClick={signOut}>Esci</button>
            </div>

            {msg && <p className="lead" style={{ marginTop: 12 }}>{msg}</p>}
          </>
        )}

        {!loading && !user && (
          <>
            <p className="lead" style={{ marginTop: 10 }}>
              Login richiesto. (Se sei tornato da Stripe, dopo login ti riporto su Premium automaticamente.)
            </p>

            <form onSubmit={signIn} style={{ marginTop: 14, display: "grid", gap: 10, maxWidth: 520 }}>
              <label>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Email</div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  className="btn"
                  style={{ width: "100%", textAlign: "left" }}
                />
              </label>

              <label>
                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>Password</div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
                  className="btn"
                  style={{ width: "100%", textAlign: "left" }}
                />
              </label>

              <button className="btn primary" type="submit">Login</button>
            </form>

            {msg && <p className="lead" style={{ marginTop: 12 }}>{msg}</p>}
          </>
        )}
      </div>
    </main>
  );
}
