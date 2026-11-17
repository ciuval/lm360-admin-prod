/**
 * Ponte360 — simulazione offline del caso "figlio maggiorenne / mamma / papà".
 * È solo logica di prototipo, NON autorizzazione, identità o consenso reale.
 * Zero rete, storage, account, analytics o cronologia privata.
 */
const PARENTS = new Set(["mamma", "papa"]);

export const ROLES = Object.freeze([
  { id: "figlio-adulto", label: "Figlio maggiorenne" },
  { id: "mamma", label: "Mamma" },
  { id: "papa", label: "Papà" },
]);

export function newFamilyLab() {
  return {
    suggested: false,
    invitations: 0,
    consent: { mamma: false, papa: false },
    paused: false,
    ended: false,
    reason: null,
    agreed: { mamma: false, papa: false },
  };
}

export function isRoomOpen(state) {
  return Boolean(
    state.suggested &&
    state.consent.mamma &&
    state.consent.papa &&
    !state.paused &&
    !state.ended
  );
}

export function isSharedAgreement(state) {
  return isRoomOpen(state) && state.agreed.mamma && state.agreed.papa;
}

// Non esiste importazione della chat o accesso del figlio ai contenuti.
export function mayReadParentPrivateConversation() {
  return false;
}

export function transition(state, actor, action) {
  if (action === "reset" && actor === "demo") return newFamilyLab();

  // Un minorenne non riceve mai poteri di intermediazione.
  if (actor === "figlio-adulto") {
    if (action === "suggest" && !state.suggested && !state.ended) {
      return { ...state, suggested: true, invitations: 1 };
    }
    return state;
  }

  // Né il mediatore, né un minore, né un estraneo decidono per un genitore.
  if (!PARENTS.has(actor) || state.ended) return state;

  // Fermarsi non richiede consenso dell'altro. Nessun secondo invito.
  if (action === "safety-stop" || action === "block" ||
      action === "decline" || action === "withdraw" || action === "end") {
    return { ...state, ended: true, reason: action };
  }

  if (!state.suggested) return state;

  if (action === "accept" && !state.paused) {
    return { ...state, consent: { ...state.consent, [actor]: true } };
  }

  if (action === "pause" && isRoomOpen(state)) {
    return { ...state, paused: true };
  }

  if (action === "agree-small-step" && isRoomOpen(state)) {
    return { ...state, agreed: { ...state.agreed, [actor]: true } };
  }

  return state;
}

/**
 * Visibilità simulata: al figlio NON si rivela se uno dei genitori ha
 * accettato, rifiutato, bloccato o richiesto aiuto.
 */
export function summaryFor(state, actor) {
  if (actor === "figlio-adulto") {
    if (!state.suggested) return "Puoi proporre una volta un confronto. Non puoi partecipare, leggere o scegliere per i genitori.";
    return "La tua proposta è stata registrata solo in questa demo. Le scelte dei genitori rimangono riservate.";
  }
  if (!PARENTS.has(actor)) return "Accesso non previsto.";
  if (state.ended) return "Il percorso è terminato. Nessun nuovo invito o sollecito.";
  if (!state.suggested) return "Non c'è ancora una proposta di confronto.";
  if (state.paused) return "La mediazione è in pausa. Nessun nuovo contenuto viene condiviso.";
  if (isRoomOpen(state)) return "Entrambi avete accettato. È possibile valutare un piccolo passo insieme, senza obblighi.";
  if (state.consent[actor]) return "Hai accettato. Il confronto non si apre senza un secondo consenso libero.";
  return "La proposta è facoltativa. Puoi accettare, rifiutare o segnalare che non è sicuro.";
}
