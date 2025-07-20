import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function TesterPage() {
  const [session, setSession] = useState(null);
  const [profilo, setProfilo] = useState(null);
  const [log, setLog] = useState(null);
  const [messaggi, setMessaggi] = useState([]);
  const [output, setOutput] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      supabase
        .from("profili")
        .select("*")
        .eq("id", session.user.id)
        .single()
        .then(({ data }) => setProfilo(data));

      supabase
        .from("log_attivita")
        .select("*")
        .limit(5)
        .then(({ data }) => setLog(data));

      supabase
        .from("messaggi")
        .select("*")
        .or(`mittente_id.eq.${session.user.id},destinatario_id.eq.${session.user.id}`)
        .then(({ data }) => setMessaggi(data));
    }
  }, [session]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return setOutput(`❌ Logout fallito: ${error.message}`);
    setOutput("✅ Logout effettuato");
    setSession(null);
    setTimeout(() => window.location.reload(), 1000);
  };

  const generaMatch = async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth?.user) return setOutput("⚠️ Devi essere loggato per generare match.");

    const { data: me } = await supabase
      .from("profili")
      .select("*")
      .eq("id", auth.user.id)
      .single();

    const { data: altri } = await supabase
      .from("profili")
      .select("*")
      .neq("id", auth.user.id);

    const risultati = altri.map((altro) => {
      const interessiA = (me.interessi || "").toLowerCase().split(",");
      const interessiB = (altro.interessi || "").toLowerCase().split(",");
      const match = interessiA.filter((i) => interessiB.includes(i.trim())).length;
      const score = Math.round((match / Math.max(interessiA.length, 1)) * 100);
      return {
        user_id: me.id,
        matched_user_id: altro.id,
        score,
      };
    });

    const { error } = await supabase.from("match_scores").upsert(risultati, {
      onConflict: ["user_id", "matched_user_id"]
    });

    if (error) return setOutput(`❌ Errore inserimento match: ${error.message}`);
    setOutput("✅ Match generati correttamente!");
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#121212", color: "#fff", minHeight: "100vh" }}>
      <h2 style={{ color: "#f08fc0" }}>🧪 Tester Supabase + RLS</h2>

      {!session && <p>⚠️ Nessuna sessione trovata. Effettua il login su /debug.</p>}

      {session && (
        <>
          <h3>👤 Sessione attiva</h3>
          <p><b>ID:</b> {session.user.id}</p>
          <p><b>Email:</b> {session.user.email}</p>

          <button onClick={generaMatch} style={buttonStyle}>🧠 Genera Match</button>
          <button onClick={handleLogout} style={logoutBtn}>🔓 Logout</button>
          <pre>{output}</pre>

          <h3>📘 Profilo</h3>
          <pre>{JSON.stringify(profilo, null, 2)}</pre>

          <h3>📝 Log attività visibili</h3>
          <pre>{JSON.stringify(log, null, 2)}</pre>

          <h3>💬 Messaggi tuoi</h3>
          <pre>{JSON.stringify(messaggi, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

const buttonStyle = {
  margin: "1rem 1rem 1rem 0",
  backgroundColor: "#2196f3",
  color: "#fff",
  padding: "0.5rem 1rem",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};

const logoutBtn = {
  ...buttonStyle,
  backgroundColor: "#f44336"
};

