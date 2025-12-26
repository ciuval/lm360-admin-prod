import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabaseClient";

export default function ResetPasswordPage() {
  const nav = useNavigate();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [busy, setBusy] = useState(false);

  // Quando arrivi dal link email, Supabase ti ha già loggato in "recovery".
  useEffect(() => {
    // Scaldo lo stato auth; con v2 basta fare una getSession
    supabase.auth.getSession();
  }, []);

  async function submit(e) {
    e.preventDefault();
    if (p1.length < 8 || !/[A-Za-z]/.test(p1) || !/\d/.test(p1)) {
      toast.error("Password debole: min 8, lettere e numeri.");
      return;
    }
    if (p1 !== p2) { toast.error("Le password non coincidono"); return; }

    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: p1 });
    setBusy(false);

    if (error) { toast.error(error.message || "Errore salvataggio"); return; }
    toast.success("Password aggiornata. Ora puoi accedere.");
    nav("/login", { replace: true });
  }

  return (
    <section className="lm-page">
      <div className="lm-wrap">
        <div className="lm-card" style={{ maxWidth: 520 }}>
          <div className="lm-title"><span>🔑</span><span>Imposta nuova password</span></div>
          <form onSubmit={submit} className="space-y-3">
            <input className="lm-input" type="password" placeholder="Nuova password" value={p1} onChange={e=>setP1(e.target.value)} />
            <input className="lm-input" type="password" placeholder="Ripeti password" value={p2} onChange={e=>setP2(e.target.value)} />
            <button className="lm-btn-primary" disabled={busy}>{busy ? "Aggiorno..." : "Aggiorna password"}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
