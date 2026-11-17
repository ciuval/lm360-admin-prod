/** 
 * Ponte360 / Andrea Test e Bianca Test: stato di prova senza rete né account.
 * Non considera la proposta come consenso; non importa chat o dati personali.
 */
export const PERSONS = Object.freeze(["andrea", "bianca"]);
export const ACTORS = Object.freeze(["andrea", "bianca", "ponte360"]);

export const newConflict = () => ({
  privateChatPaused: false,
  pausedBy: null,
  outreachUsed: false,
  proposedBy: null,
  consent: { andrea: false, bianca: false },
  stopped: false,
  block: false,
  unsafe: false,
  closed: false,
  promptIndex: 0,
});

const isParent = (person) => PERSONS.includes(person);
const other = (person) => person === "andrea" ? "bianca" : "andrea";
const halted = (s) => s.stopped || s.block || s.unsafe || s.closed;

export function roomAllowed(s) {
  return s.privateChatPaused && Boolean(s.proposedBy) &&
    s.consent.andrea && s.consent.bianca && !halted(s);
}

export const mediatorCanReadOldChat = () => false;
export const mediatorCanReadMatchingProfile = () => false;

export function act(s, actor, action) {
  if (actor === "demo" && action === "reset") return newConflict();
  if (!isParent(actor) && actor !== "ponte360") return s;

  // Il mediatore è totalmente inattivo prima del consenso di entrambi.
  if (actor === "ponte360") {
    if (action !== "next-prompt" || !roomAllowed(s) || s.promptIndex >= 2) return s;
    return { ...s, promptIndex: s.promptIndex + 1 };
  }

  if (halted(s)) return s;

  // Blocco, paura, rifiuto e uscita sono sempre terminali.
  if (action === "block") return { ...s, block: true, stopped: true };
  if (action === "unsafe") return { ...s, unsafe: true, stopped: true };
  if (action === "close") return { ...s, closed: true, stopped: true };
  if (action === "decline" || action === "withdraw") {
    if (action === "decline" && !s.proposedBy) return s;
    return { ...s, stopped: true };
  }

  // Una persona deve prima mettere in pausa la chat privata.
  if (action === "pause-chat" && !s.privateChatPaused) {
    return { ...s, privateChatPaused: true, pausedBy: actor };
  }

  // Solo l'altra persona può usare un singolo gesto per proporre Ponte360.
  // Un invito, una scusa o un 😔 non possono essere inviati in sequenza.
  if (action === "propose" && s.privateChatPaused &&
      actor === other(s.pausedBy) && !s.outreachUsed && !s.proposedBy) {
    return { ...s, outreachUsed: true, proposedBy: actor };
  }

  if (action === "accept" && s.proposedBy) {
    return { ...s, consent: { ...s.consent, [actor]: true } };
  }

  return s;
}

export function statusFor(s, actor) {
  if (!ACTORS.includes(actor)) return "Ruolo non previsto.";
  if (actor === "ponte360") {
    if (halted(s)) return "Mediazione terminata. Nessun accesso o nuovo invito.";
    return roomAllowed(s)
      ? "Demo: entrambi hanno acconsentito. Ora puoi leggere solo gli spunti della nuova stanza."
      : "Nessun accesso: Ponte360 non può osservare il litigio né leggere la vecchia chat.";
  }
  if (halted(s)) return "Percorso interrotto. Nessun nuovo invito, accesso o sollecito.";
  if (!s.privateChatPaused) return "La chat non è in pausa. Il litigio non viene riconosciuto automaticamente.";
  if (!s.proposedBy) return s.pausedBy === actor
    ? "Hai messo in pausa la chat privata. Non puoi essere raggiunto da solleciti ripetuti."
    : "La chat privata è in pausa. Puoi usare un solo gesto facoltativo: proporre Ponte360.";
  if (roomAllowed(s)) return "Entrambi avete accettato una stanza nuova. La chat privata resta separata.";
  return s.consent[actor]
    ? "Hai accettato. La nuova stanza rimane chiusa senza un secondo consenso."
    : "Invito facoltativo a Ponte360. Puoi accettare o rifiutare, senza conseguenze sul profilo.";
}
