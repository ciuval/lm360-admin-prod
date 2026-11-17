import {
  newFamilyLab,
  ROLES,
  transition,
  isRoomOpen,
  isSharedAgreement,
  mayReadParentPrivateConversation,
  summaryFor,
} from "./policy.mjs";

let state = newFamilyLab();
let selectedRole = "figlio-adulto";

const roles = document.querySelector("#roles");
const status = document.querySelector("#status");
const stage = document.querySelector("#stage");
const reset = document.querySelector("#reset");

if (!roles || !status || !stage || !reset) {
  throw new Error("FAMILY_LAB_UI_MISSING");
}

function element(tag, text = "", className = "") {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function addText(parent, tag, text, className = "") {
  const node = element(tag, text, className);
  parent.append(node);
  return node;
}
function actionButton(parent, text, action, kind = "") {
  const button = element("button", text, kind);
  button.type = "button";
  button.addEventListener("click", () => {
    state = transition(state, selectedRole, action);
    render();
    status.focus({ preventScroll: true });
  });
  parent.append(button);
  return button;
}
function actions(parent) {
  const node = element("div", "", "actions");
  parent.append(node);
  return node;
}
function exitChoices(parent) {
  const row = actions(parent);
  actionButton(row, "Termina la mediazione", "end");
  actionButton(row, "Blocca ulteriori contatti", "block", "warning");
  actionButton(row, "Non mi sento al sicuro", "safety-stop", "warning");
}
function renderAdultSon(parent) {
  addText(parent, "h3", "Il tuo desiderio conta. La decisione non è tua da prendere.");
  addText(parent, "p",
    "Puoi proporre un unico confronto senza aggiungere messaggi personali, " +
    "senza coinvolgere bambini e senza ottenere le risposte private dei genitori.",
    "muted");
  if (!state.suggested) {
    actionButton(actions(parent), "Proponi una volta un dialogo facoltativo", "suggest", "primary");
  } else {
    addText(parent, "p",
      "Proposta registrata nella demo. Non riceverai informazioni su chi accetta, " +
      "rifiuta, blocca o chiede aiuto. Non puoi mandare nuovi inviti.", "hint");
  }
  addText(parent, "p",
    "Tu non entri nella stanza. Nessuno dovrebbe chiederti di scegliere tra mamma e papà.",
    "small muted");
}

function renderParent(parent) {
  const who = selectedRole === "mamma" ? "Mamma" : "Papà";
  addText(parent, "h3", who + " — la tua scelta è libera");
  if (state.ended) {
    addText(parent, "p",
      "Il percorso è terminato. Un rifiuto o una decisione di sicurezza " +
      "non può essere aggirato da un altro invito.", "hint");
    return;
  }
  if (!state.suggested) {
    addText(parent, "p", "Nessuna proposta nella simulazione. Puoi tornare al ruolo del figlio.", "muted");
    return;
  }
  if (state.paused) {
    addText(parent, "p",
      "La stanza è in pausa. Non si riprende automaticamente; serve un nuovo " +
      "percorso di consenso, che questa demo non implementa.", "hint");
    exitChoices(parent);
    return;
  }
  if (!state.consent[selectedRole]) {
    addText(parent, "p",
      "Ti viene proposta una conversazione facoltativa, separata dalle vecchie chat. " +
      "Qui non c'è un mediatore umano reale e non ci sono messaggi da importare.");
    const row = actions(parent);
    actionButton(row, "Accetto di partecipare", "accept", "primary");
    actionButton(row, "Non desidero partecipare", "decline");
    exitChoices(parent);
    return;
  }
  if (!isRoomOpen(state)) {
    addText(parent, "p",
      "Hai accettato. La stanza resta chiusa finché entrambi non hanno scelto " +
      "personalmente di partecipare. Non conosci la scelta dell'altro.", "hint");
    exitChoices(parent);
    return;
  }

  addText(parent, "div", "Confronto simulato aperto — solo esempio inventato", "number");
  const scenario = element("div", "", "step");
  addText(scenario, "h3", "Ponte360 propone una domanda");
  addText(scenario, "p",
    "«Qual è un impegno piccolo che potrebbe rendere il dialogo più sereno, " +
    "senza obbligare nessuno a tornare insieme?»");
  addText(scenario, "p",
    "Esempio: dedicare 15 minuti alla settimana a organizzare gli impegni familiari.",
    "small muted");
  parent.append(scenario);

  addText(parent, "p",
    "Il piccolo passo sarà considerato condiviso solo se mamma e papà " +
    "lo approvano separatamente.");
  const agreed = state.agreed[selectedRole];
  if (!agreed) {
    actionButton(actions(parent), "Accetto questo piccolo passo", "agree-small-step", "primary");
  } else {
    addText(parent, "p", "Hai approvato la proposta. Non significa accettazione dell'altro.", "hint");
  }
  if (isSharedAgreement(state)) {
    addText(parent, "p",
      "Entrambi avete approvato lo stesso piccolo passo. Potete anche decidere " +
      "di non riconciliarvi come coppia.", "hint");
  }

  const row = actions(parent);
  actionButton(row, "Metti in pausa", "pause");
  exitChoices(parent);
}

function render() {
  for (const button of roles.querySelectorAll("[data-role]")) {
    const active = button.dataset.role === selectedRole;
    button.setAttribute("aria-pressed", String(active));
  }
  status.textContent = summaryFor(state, selectedRole);
  stage.replaceChildren();
  if (selectedRole === "figlio-adulto") renderAdultSon(stage);
  else renderParent(stage);

  // Invariante UX: non è mai previsto un accesso del figlio a una chat privata.
  if (mayReadParentPrivateConversation()) {
    throw new Error("FAMILY_LAB_PRIVACY_INVARIANT");
  }
}
for (const button of roles.querySelectorAll("[data-role]")) {
  if (!ROLES.some((role) => role.id === button.dataset.role)) continue;
  button.addEventListener("click", () => {
    selectedRole = button.dataset.role;
    render();
    status.focus({ preventScroll: true });
  });
}
status.tabIndex = -1;
reset.addEventListener("click", () => {
  state = transition(state, "demo", "reset");
  selectedRole = "figlio-adulto";
  render();
  status.focus({ preventScroll: true });
});
render();
