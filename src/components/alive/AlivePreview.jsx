/**
 * LoveMatch360 Alive — anteprima delle quattro microinterazioni.
 * Puramente locale/presentazionale: nessun like, match, messaggio,
 * dato personale, accesso Supabase o chiamata di rete.
 * La Home può mostrarla SOLO con VITE_LM360_ALIVE_PREVIEW=true.
 */
import React, { useState } from "react";
import { Heart, Smile, MessageCircleHeart, Sparkles } from "lucide-react";
import "./AlivePreview.css";

const MOMENTS = [
  {
    id: "heart",
    label: "Cuore",
    caption: "Un battito di coraggio",
    message: "Un piccolo battito, solo per sorridere. Nessun like è stato inviato.",
    Icon: Heart,
  },
  {
    id: "smile",
    label: "Sorriso",
    caption: "La gioia fa un salto",
    message: "Un occhiolino gentile: le cose belle possono iniziare con leggerezza.",
    Icon: Smile,
  },
  {
    id: "chat",
    label: "Messaggio",
    caption: "Tre puntini di curiosità",
    message: "Questi puntini sono un gioco grafico. Non indicano che una persona stia scrivendo.",
    Icon: MessageCircleHeart,
  },
  {
    id: "sparkle",
    label: "Scintilla",
    caption: "Un po' di meraviglia",
    message: "Una piccola scintilla. La magia, qui, non prende decisioni al posto tuo.",
    Icon: Sparkles,
  },
];

export default function AlivePreview() {
  const [selected, setSelected] = useState(null);
  const current = MOMENTS.find((moment) => moment.id === selected);

  return (
    <section className="lm360-alive-preview" aria-labelledby="lm360-alive-title">
      <header className="lm360-alive-header">
        <p className="lm360-alive-eyebrow">LoveMatch360 Alive · Anteprima creativa</p>
        <h2 id="lm360-alive-title">Le emozioni hanno anche un lato divertente.</h2>
        <p>
          Quattro piccoli gesti, fatti per sorridere. Provali con un clic,
          un tocco o la tastiera: non inviano like né messaggi.
        </p>
      </header>

      <div className="lm360-alive-grid" role="group" aria-label="Quattro icone da provare">
        {MOMENTS.map(({ id, label, caption, Icon }) => (
          <button
            key={id}
            type="button"
            className={"lm360-alive-card lm360-alive-card--" + id + (selected === id ? " is-selected" : "")}
            aria-pressed={selected === id}
            onClick={() => setSelected((previous) => previous === id ? null : id)}
          >
            <span className="lm360-alive-mark" aria-hidden="true">
              <Icon focusable="false" strokeWidth={1.85} />
              {id === "chat" && (
                <span className="lm360-alive-dots" aria-hidden="true">
                  <i /><i /><i />
                </span>
              )}
            </span>
            <span className="lm360-alive-label">{label}</span>
            <span className="lm360-alive-caption">{caption}</span>
          </button>
        ))}
      </div>

      <p className="lm360-alive-feedback" aria-live="polite" aria-atomic="true">
        {current
          ? current.message
          : "Scegli un'icona per vederla prendere vita. Sono effetti illustrativi, non stati reali delle persone."}
      </p>
    </section>
  );
}
