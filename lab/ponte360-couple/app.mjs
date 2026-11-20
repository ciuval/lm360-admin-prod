import {
  newConflict, act, roomAllowed, statusFor, ACTORS,
  mediatorCanReadOldChat, mediatorCanReadMatchingProfile,
} from "./policy.mjs";

let state = newConflict();
let role = "andrea";
const status = document.querySelector("#status");
const stage = document.querySelector("#stage");
const roles = document.querySelector("#roles");
const reset = document.querySelector("#reset");

if (!status || !stage || !roles || !reset) throw new Error("PONTE360_COUPLE_UI_MISSING");
status.tabIndex = -1;

const el = (tag, text = "", className = "") => {
  const n = document.createElement(tag);
  n.textContent = text;
  if (className) n.className = className;
  return n;
};
const line = (parent, tag, text, className = "") => {
  const n = el(tag, text, className);
  parent.append(n);
  return n;
};
const buttons = (parent) => {
  const row = el("div", "", "actions");
  parent.append(row);
  return row;
};
const addAction = (row, label, action, cls = "") => {
  const b = el("button", label, cls);
  b.type = "button";
  b.addEventListener("click", () => {
    state = act(state, role, action);
    render();
    status.focus({ preventScroll: true });
  });
  row.append(b);
  return b;
};

function safetyActions(parent) {
  if (state.stopped) return;
  const row = buttons(parent);
  addAction(row, "Blocca i contatti", "block", "warning");
  addAction(row, "Non mi sento al sicuro", "unsafe", "warning");
  addAction(row, "Chiudi definitivamente", "close", "warning");
}

function renderPerson(parent) {
  line(parent, "h3", role === "andrea" ? "Andrea Test — decidi tu" : "Bianca Test — decidi tu");
  line(parent, "p", "La chat esistente rimane separata. Qui non vengono letti i messaggi né cercate automaticamente cause o colpe.", "muted");

  if (state.stopped) {
    line(parent, "p", "Il percorso è terminato. Nessuna nuova richiesta o riapertura.", "hint");
    return;
  }

  if (!state.privateChatPaused) {
    line(parent, "p", "Nessuna mediazione viene proposta automaticamente. Puoi simulare una pausa dopo un disaccordo, senza cancellare la cronologia.", "hint");
    addAction(buttons(parent), "Simula un litigio e metti in pausa la chat", "pause-chat", "primary");
    safetyActions(parent);
    return;
  }

  if (!state.proposedBy) {
    if (state.pausedBy === role) {
      line(parent, "p", "Hai chiesto una pausa. L'altra persona non può mandare una serie di solleciti.", "hint");
    } else {
      line(parent, "p", "Andrea e Bianca sono in pausa nella demo. Puoi usare una sola proposta: Ponte360, senza inviare scuse e inviti ripetuti.", "hint");
      addAction(buttons(parent), "Proponi Ponte360 (unico invito)", "propose", "primary");
    }
    safetyActions(parent);
    return;
  }

  if (!state.consent[role]) {
    line(parent, "p", "Ti viene proposto un confronto facoltativo con Ponte360 Test, terzo ruolo fittizio. La nuova stanza non importa le chat precedenti. Potrai interrompere in qualsiasi momento.");
    const row = buttons(parent);
    addAction(row, "Accetto Ponte360", "accept", "primary");
    addAction(row, "Non desidero partecipare", "decline");
    safetyActions(parent);
    return;
  }

  if (!roomAllowed(state)) {
    line(parent, "p", "Hai accettato. La stanza resta chiusa fino al consenso personale dell'altra persona. Nessun accesso per Ponte360.", "hint");
  } else {
    line(parent, "div", "NUOVA STANZA SIMULATA · DUE CONSENSI", "number");
    line(parent, "p", "Il confronto può cominciare solo qui. La chat privata resta in pausa. Nessuna riconciliazione è obbligatoria.", "hint");
    const example = el("div", "", "step");
    line(example, "h3", "Primo spunto neutrale");
    line(example, "p", "«Quale limite vi aiuterebbe a sentirvi ascoltati e rispettati prima di parlare del disaccordo?»");
    parent.append(example);
  }

  const row = buttons(parent);
  addAction(row, "Ritiro il consenso", "withdraw");
  safetyActions(parent);
}

const prompts = [
  "«Quale limite vi aiuterebbe a sentirvi ascoltati e rispettati prima di parlare del disaccordo?»",
  "«Qual è una cosa che desiderate sia compresa, senza attribuire colpe?»",
  "«C'è un piccolo passo concreto che entrambi volete valutare liberamente?»",
];

function renderMediator(parent) {
  line(parent, "h3", "Ponte360 Test — terza figura solo simulata");
  line(parent, "p", "Non sei una persona verificata e non sei un account reale. Non puoi leggere messaggi, immagini, profili riservati o motivi del litigio.", "muted");
  if (!roomAllowed(state)) {
    line(parent, "p", "Nessun accesso. Il ruolo esterno resta inattivo finché i due partecipanti non acconsentono.", "hint");
    return;
  }
  line(parent, "div", "STANZA DI MEDIAZIONE SEPARATA · DEMO", "number");
  const example = el("div", "", "step");
  line(example, "h3", "Un'atmosfera favorevole, senza pressione");
  line(example, "p", prompts[state.promptIndex]);
  line(example, "p", "Questo è uno spunto predefinito. Nessuna conversazione viene letta, analizzata o inviata.", "small muted");
  parent.append(example);
  if (state.promptIndex < prompts.length - 1) {
    addAction(buttons(parent), "Prossimo spunto neutrale", "next-prompt", "primary");
  }
  line(parent, "p", "Se uno dei due ritira il consenso, il terzo perde accesso immediatamente nella simulazione.", "small muted");
}

function render() {
  if (mediatorCanReadOldChat() || mediatorCanReadMatchingProfile()) {
    throw new Error("PONTE360_PRIVATE_DATA_ACCESS");
  }
  for (const b of roles.querySelectorAll("[data-role]")) {
    b.setAttribute("aria-pressed", String(b.dataset.role === role));
  }
  status.textContent = statusFor(state, role);
  stage.replaceChildren();
  if (role === "ponte360") renderMediator(stage);
  else renderPerson(stage);
}

for (const b of roles.querySelectorAll("[data-role]")) {
  if (!ACTORS.includes(b.dataset.role)) continue;
  b.addEventListener("click", () => {
    role = b.dataset.role;
    render();
    status.focus({ preventScroll: true });
  });
}

reset.addEventListener("click", () => {
  state = act(state, "demo", "reset");
  role = "andrea";
  render();
  status.focus({ preventScroll: true });
});
render();
