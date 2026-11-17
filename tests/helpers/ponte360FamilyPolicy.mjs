/**
 * Solo simulazione di policy Ponte360 per due ADULTI sintetici.
 * Non è integrata in React/Supabase e non ha effetti sul mondo reale.
 * Nessun identificativo personale, accesso rete o storage.
 */
const PARENTS = new Set(["mamma", "papa"]);

export function newFamilyScenario() {
  return {
    invited: false,
    invitations: 0,
    consents: { mamma: false, papa: false },
    paused: false,
    stopped: false,
    safetyStop: false,
    blocked: false,
    closed: false,
    agreement: null,
    agreementBy: { mamma: false, papa: false },
  };
}

export function canOpenMediation(state) {
  return Boolean(
    state.invited &&
    state.consents.mamma &&
    state.consents.papa &&
    !state.paused &&
    !state.stopped &&
    !state.safetyStop &&
    !state.blocked &&
    !state.closed
  );
}

export function mayReadPrivateChat() {
  // La simulazione della stanza non concede mai accesso alla chat precedente.
  return false;
}

export function agreementReached(state) {
  return canOpenMediation(state) &&
    Boolean(state.agreement && state.agreementBy.mamma && state.agreementBy.papa);
}

export function actOnFamilyScenario(state, actor, action, value = null) {
  // Nessun minore, mediatore o terzo può eseguire azioni per i genitori.
  if (!PARENTS.has(actor)) return state;
  if (state.stopped || state.safetyStop || state.blocked || state.closed) return state;

  if (action === "stop-for-safety") {
    return { ...state, safetyStop: true, stopped: true };
  }
  if (action === "block") return { ...state, blocked: true, stopped: true };
  if (action === "close") return { ...state, closed: true, stopped: true };
  if (action === "decline" || action === "withdraw" || action === "end") {
    return { ...state, stopped: true };
  }
  if (action === "invite") {
    return state.invited
      ? state
      : { ...state, invited: true, invitations: 1 };
  }
  if (action === "accept" && state.invited && !state.paused) {
    return {
      ...state,
      consents: { ...state.consents, [actor]: true },
    };
  }
  if (action === "pause" && canOpenMediation(state)) {
    // Una pausa impedisce nuovi messaggi; per riaprire servirebbe un
    // ulteriore contratto di ripresa bilaterale, non presente in V1.
    return { ...state, paused: true };
  }
  if (action === "propose-agreement" && canOpenMediation(state) &&
      typeof value === "string" && value.length > 0 &&
      state.agreement === null) {
    return {
      ...state,
      agreement: value,
      agreementBy: { mamma: false, papa: false },
    };
  }
  if (action === "accept-agreement" && canOpenMediation(state) &&
      state.agreement !== null && value === state.agreement) {
    return {
      ...state,
      agreementBy: { ...state.agreementBy, [actor]: true },
    };
  }
  return state;
}
