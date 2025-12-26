// src/pages/Diagnosi.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabaseClient";

/* ---------------------- DOMANDE (semplificate e accessibili) ---------------------- */
const QUESTIONS = [
  {
    id: "q1",
    title: "Cosa vuoi migliorare prima?",
    options: [
      { v: "relazioni", label: "Relazioni & vita sociale" },
      { v: "performance", label: "Lavoro, studio o business" },
      { v: "entrambi", label: "Entrambi" },
    ],
  },
  {
    id: "q2",
    title: "Quanto sei disposto/a a seguire un percorso strutturato?",
    options: [
      { v: "molto", label: "Molto: piano settimanale" },
      { v: "medio", label: "Medio: piccoli step giornalieri" },
      { v: "poco", label: "Poco: consigli veloci" },
    ],
  },
  {
    id: "q3",
    title: "Quanto ti pesa il giudizio altrui?",
    options: [
      { v: "alto", label: "Molto" },
      { v: "medio", label: "Un po’" },
      { v: "basso", label: "Poco" },
    ],
  },
];

/* ---------------------- Heuristica semplice → track suggerita ---------------------- */
function suggestTrack(ans) {
  // Default
  let base = "starter";

  // Preferenza area
  const area =
    ans.q1 === "relazioni"
      ? "rel"
      : ans.q1 === "performance"
      ? "biz"
      : "focus";

  // Struttura del piano
  const level =
    ans.q2 === "molto" ? "pro" : ans.q2 === "medio" ? "light" : "quick";

  // Sensibilità al giudizio (potrebbe orientare su mindset)
  const mindset = ans.q3 === "alto" ? "mindset" : null;

  // Composizione chiave
  const key = mindset ? `${area}-${level}-${mindset}` : `${area}-${level}`;
  return key || base;
}

/* ---------------------- UI helper ---------------------- */
function Question({ id, title, options, value, onChange }) {
  return (
    <div style={card}>
      <h3 style={qTitle}>{title}</h3>
      <div role="radiogroup" aria-labelledby={`${id}-label`}>
        {options.map((op) => (
          <label key={op.v} style={optRow}>
            <input
              type="radio"
              name={id}
              value={op.v}
              checked={value === op.v}
              onChange={(e) => onChange(id, e.target.value)}
              style={{ marginRight: 8 }}
            />
            {op.label}
          </label>
        ))}
      </div>
    </div>
  );
}

/* ---------------------- Pagina Diagnosi ---------------------- */
export default function Diagnosi() {
  const navigate = useNavigate();

  // risposte
  const [answers, setAnswers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("diagnosi-answers") || "{}");
    } catch {
      return {};
    }
  });

  // persistenza locale per UX
  useEffect(() => {
    try {
      localStorage.setItem("diagnosi-answers", JSON.stringify(answers));
    } catch {}
  }, [answers]);

  const handleSet = (id, v) => setAnswers((a) => ({ ...a, [id]: v }));

  const trackKey = useMemo(() => suggestTrack(answers), [answers]);

  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    // valida risposte minime
    const missing = QUESTIONS.filter((q) => !answers[q.id]).map((q) => q.id);
    if (missing.length) {
      toast.error("Completa le domande prima di continuare.");
      return;
    }

    setSaving(true);
    try {
      // prova a salvare (se non loggato, andiamo comunque avanti)
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth?.user?.id ?? null;

      if (uid) {
        const payload = {
          user_id: uid,
          answers,
          track_key: trackKey,       // colonna presente nello schema che hai mostrato
          recommended: trackKey,     // testo descrittivo/slug
          premium: false,
        };

        const { error } = await supabase.from("diagnosi").insert(payload);
        if (error) {
          console.warn("[Diagnosi] insert skip (RLS o schema):", error?.message);
        }
      }

      // naviga SEMPRE alla libreria con la track pre-selezionata
      navigate(`/guide?track=${encodeURIComponent(trackKey)}`);
      toast.success("Percorso consigliato pronto!");
    } catch (e) {
      console.error("[Diagnosi] errore submit:", e?.message);
      // anche in caso di errore, prova comunque a navigare
      navigate(`/guide?track=${encodeURIComponent(trackKey)}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={page}>
      <h2 style={title}>Diagnosi Rapida</h2>
      <p style={sub}>Rispondi in 60s: ti suggeriamo il percorso più adatto.</p>

      {QUESTIONS.map((q) => (
        <Question
          key={q.id}
          id={q.id}
          title={q.title}
          options={q.options}
          value={answers[q.id] || ""}
          onChange={handleSet}
        />
      ))}

      <div style={{ marginTop: 16, opacity: 0.8 }}>
        <small>
          Suggerimento corrente: <code>{trackKey}</code>
        </small>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={saving}
        style={{ ...cta, opacity: saving ? 0.7 : 1 }}
        aria-label="Vedi percorso consigliato"
      >
        {saving ? "Calcolo in corso…" : "Vedi percorso consigliato"}
      </button>

      <p style={{ marginTop: 12, opacity: 0.65 }}>
        Puoi cambiare le risposte in qualsiasi momento.
      </p>
    </div>
  );
}

/* ---------------------- Stili inline (dark) ---------------------- */
const page = { maxWidth: 700, margin: "0 auto", padding: "1rem" };
const title = { color: "#f08fc0", textShadow: "0 0 8px #f08fc0" };
const sub = { opacity: 0.8, marginBottom: 12 };
const card = {
  background: "#1c1c1c",
  border: "1px solid #2b2b2b",
  borderRadius: 10,
  padding: "12px 14px",
  margin: "10px 0",
};
const qTitle = { margin: "0 0 8px", fontSize: "1.05rem" };
const optRow = { display: "block", padding: "6px 0" };
const cta = {
  marginTop: 18,
  padding: "12px 18px",
  borderRadius: 8,
  border: "none",
  background: "#1e88e5",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
