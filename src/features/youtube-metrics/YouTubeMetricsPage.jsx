
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./brand-dark.css";

const ideas = [
  {
    id: "red-flags",
    title: "Red flags nelle relazioni",
    theme: "relazioni",
    type: "Short",
    status: "hot",
    statusLabel: "Idea calda",
    result: "Prossimo passo: crea uno Short oggi.",
    reason: "Tema chiaro, facile da capire e utile per attirare attenzione senza promettere miracoli.",
    numbers: "18.400 viste esempio - interesse alto",
  },
  {
    id: "profilo-umano",
    title: "Profilo piu umano, meno caos",
    theme: "LoveMatch360",
    type: "Video lungo",
    status: "hot",
    statusLabel: "Idea calda",
    result: "Prossimo passo: prepara un video di 6 minuti.",
    reason: "Collega direttamente il progetto al bisogno reale del visitatore: capire e fidarsi.",
    numbers: "9.400 viste esempio - interesse buono",
  },
  {
    id: "checklist",
    title: "Checklist che fa tornare le persone",
    theme: "lead magnet",
    type: "Short",
    status: "hot",
    statusLabel: "Idea calda",
    result: "Prossimo passo: trasformala in PDF semplice.",
    reason: "Una checklist puo diventare motivo per iscriversi senza forzare pagamenti.",
    numbers: "7.800 viste esempio - ritorno possibile",
  },
  {
    id: "libro",
    title: "Dal libro al sito reale",
    theme: "libro",
    type: "Video lungo",
    status: "watch",
    statusLabel: "Da osservare",
    result: "Prossimo passo: tenerla come contenuto stabile.",
    reason: "Tema forte per fiducia, ma non va spinto come vendita aggressiva.",
    numbers: "6.100 viste esempio - interesse stabile",
  },
  {
    id: "hook",
    title: "I primi 5 secondi decidono tutto",
    theme: "YouTube",
    type: "Short",
    status: "improve",
    statusLabel: "Da migliorare",
    result: "Prossimo passo: prova un titolo piu umano.",
    reason: "Il tema attira, ma deve promettere un beneficio piu chiaro.",
    numbers: "13.100 viste esempio - apertura da correggere",
  },
  {
    id: "rumore",
    title: "Troppo rumore, poco valore",
    theme: "contenuti",
    type: "Short",
    status: "later",
    statusLabel: "Non ora",
    result: "Prossimo passo: non pubblicare adesso.",
    reason: "Non porta abbastanza motivo per restare. Meglio usare energie su idee piu forti.",
    numbers: "1.100 viste esempio - energia bassa",
  },
];

const filters = [
  { id: "all", label: "Tutte le idee" },
  { id: "hot", label: "Idee calde" },
  { id: "watch", label: "Da osservare" },
  { id: "improve", label: "Da migliorare" },
  { id: "later", label: "Non ora" },
];

const statusClass = {
  hot: "ytm-hot",
  watch: "ytm-watch",
  improve: "ytm-improve",
  later: "ytm-later",
};

function csvValue(value) {
  return '"' + String(value ?? "").replaceAll('"', '""') + '"';
}

function downloadDemoCsv(rows) {
  const header = ["titolo", "tema", "formato", "stato", "prossimo_passo", "nota"];
  const body = rows.map((row) =>
    [row.title, row.theme, row.type, row.statusLabel, row.result, row.reason].map(csvValue).join(";")
  );

  const blob = new Blob([[header.join(";"), ...body].join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "lovematch360-youtube-metrics-anteprima.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function YouTubeMetricsPage() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return ideas.filter((idea) => {
      const statusOk = filter === "all" || idea.status === filter;
      const queryOk = !q || (idea.title + " " + idea.theme + " " + idea.statusLabel).toLowerCase().includes(q);
      return statusOk && queryOk;
    });
  }, [filter, query]);

  const hotCount = ideas.filter((idea) => idea.status === "hot").length;
  const watchCount = ideas.filter((idea) => idea.status === "watch").length;
  const improveCount = ideas.filter((idea) => idea.status === "improve").length;
  const laterCount = ideas.filter((idea) => idea.status === "later").length;

  return (
    <main className="ytm-page" aria-labelledby="metrics-title">
      <div className="ytm-wrap">
        <section className="ytm-hero">
          <p className="ytm-eyebrow">LoveMatch360 - Come scegliamo</p>
          <h1 id="metrics-title" className="ytm-title">Come scegliamo i temi?</h1>
          <p className="ytm-lead">
            Una anteprima chiara per scegliere idee, contenuti e prossime mosse senza leggere una tabella tecnica.
          </p>

          <div className="ytm-actions">
            <Link className="ytm-btn ytm-primary" to="/youtube-news">YouTube News</Link>
            <Link className="ytm-btn ytm-soft" to="/playbook">Metodo</Link>
            <Link className="ytm-btn ytm-ghost" to="/membri">Membri</Link>
            <button type="button" className="ytm-btn ytm-ghost" onClick={() => downloadDemoCsv(filtered)}>
              Scarica CSV
            </button>
          </div>

          <div className="ytm-notice">
            Dati dimostrativi. I dati reali YouTube non sono ancora collegati. Questa pagina serve a vedere il percorso, non a promettere risultati.
          </div>

          <div className="ytm-summary-strip" aria-label="Risposte pratiche immediate">
            <span><strong>{hotCount}</strong> Idee calde</span>
            <span><strong>{watchCount}</strong> Da osservare</span>
            <span><strong>{improveCount}</strong> Da migliorare</span>
            <span><strong>{laterCount}</strong> Non ora</span>
          </div>
        </section>
<section className="ytm-panel">
          <p className="ytm-eyebrow">Scegli vista</p>
          <h2 className="ytm-h2">Mostrami solo quello che serve.</h2>

          <div className="ytm-filters">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                className={filter === item.id ? "ytm-btn ytm-primary" : "ytm-btn"}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}

            <input
              className="ytm-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cerca idea o tema..."
            />
          </div>
        </section>

        <section className="ytm-panel">
          <p className="ytm-eyebrow">Idee di oggi</p>
          <h2 className="ytm-h2">Ogni idea ha un prossimo passo.</h2>

          <div className="ytm-ideas">
            {filtered.map((idea) => (
              <article className="ytm-idea" key={idea.id}>
                <div>
                  <span className={"ytm-badge " + statusClass[idea.status]}>{idea.statusLabel}</span>
                  <h3>{idea.title}</h3>
                  <p>{idea.reason}</p>
                  <p><strong>{idea.type}</strong> - {idea.theme} - {idea.numbers}</p>
                </div>

                <div className="ytm-next">
                  <strong>{idea.result}</strong>
                  <span>Questo non avvia pubblicazioni automatiche. Serve solo a decidere meglio.</span>
                </div>
              </article>
            ))}

            {!filtered.length ? (
              <div className="ytm-empty">Nessuna idea con questi filtri.</div>
            ) : null}
          </div>
        </section>

        <section className="ytm-panel ytm-note">
          <p>Nota: questa pagina non legge YouTube reale, non avvia upload, non vende nulla e non garantisce guadagni. Prima valore, poi eventuale monetizzazione.</p>
        </section>
      </div>
    </main>
  );
}

export default YouTubeMetricsPage;
