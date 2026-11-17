# LoveMatch360 — Piano maestro: dalla fiducia all'esperienza viva
**Versione:** 1.0 · **Data:** 16 novembre 2026 · **Stato:** piano operativo approvabile, non autorizza deploy

> **Visione:** «Prendiamo sul serio i sentimenti, non necessariamente ogni momento.»
>
> L'amore inizia dalla vera compatibilità. L'app deve guadagnare fiducia prima di chiedere denaro.
> Il prodotto unisce una relazione rispettosa a piccoli momenti di leggerezza, ironia e meraviglia.

## 1. Punto di partenza verificato — non ricominciare da zero

**Fatto nel laboratorio Docker, non sul database cloud:**

- Signup/login con account sintetici distinti; profili, foto sintetiche, consenso visibilità e discovery minima.
- Due like distinti → match 100 → Stanza 360 → chat persistente.
- Realtime bidirezionale confermato nel browser senza refresh (15/11/2026).
- Terzo account sintetico e anon: lettura globale/per ID/per coppia della chat negata; match e stanze private non visibili; invio non autorizzato negato; account C rimosso (16/11/2026).
- GitHub Actions sul commit `15b216a`: 189 test PASS, 0 FAIL; build Vite e check legali riusciti.
- PR #27 aperta e in bozza, non unita a `main`. Le PR #24/#25/#26 sono fonti integrate, anch'esse in bozza.

**Non ancora dimostrato:** sicurezza del database produzione, revoca match, sospensione/logout/token scaduto, Storage foto reale, typing, prova mobile e WCAG 2.2 AA. Il LAB è una baseline ridotta e non coincide con Supabase online.

**Fonti del progetto:**
- [Collaudo Fase 2](./collaudo-due-account-sintetici-fase2.md)
- [Sequenza di rilascio già definita](./release-sequence-dialogue-v1-2026-11-14.md)
- [Spunto relazionale V1](./relazione-ritmo-spunto-v1.md)
- [Audit sicurezza/contratti](./security-contract-gates-2026-11-10.md)

## 2. Regole di esecuzione

1. **Una modifica/una prova alla volta.** Mai pubblicare senza controllo e autorizzazione esplicita.
2. **Sicurezza prima degli effetti.** Non indebolire RLS né concedere SELECT sui messaggi ad anon.
3. **Solo dati sintetici nei test.** Non loggare PII, token, email, UUID e contenuti chat.
4. **Architettura invariata.** React/Vite/HashRouter; Vercel; Supabase Auth/Postgres/RLS/Storage/Realtime; Stripe congelato.
5. **Nessuna nuova colonna o tabella come scelta automatica.** Prima audit, progetto e consenso esplicito. La proposta JSONB in `relazione-ritmo-spunto-v1.md` resta una *proposta non approvata*.
6. **Nessun nuovo costo o fornitore** senza una misura concreta di utilità.
7. **Consentire il rifiuto:** animazioni, suoni, spunti, feedback e promemoria non devono trattenere né manipolare le persone.
8. **Qualità:** WCAG 2.2 AA, focus/tastiera, `prefers-reduced-motion`, Lighthouse mobile 90+ come obiettivo da misurare.

## 3. Fase 2 — Chiusura della base affidabile

| Gate | Lavoro in sequenza | Prova obbligatoria | Stato |
| --- | --- | --- | --- |
| 2.1 | Revoca volontaria di un like/match, blocco e separazione tra blocco e segnalazione | A/B sintetici *nuovi*: accesso chat e invio negati dopo revoca; C/anon negati; storico gestito senza cancellare prove di abusi | **PROSSIMO** |
| 2.2 | Logout, token scaduto/refresh, account sospeso, sessioni in più schede | Nessuna nuova lettura o scrittura di chat dopo revoca sessione/sospensione; chiusura canali Realtime | Da fare |
| 2.3 | `typing_status` / indicatore «sta scrivendo» | Indicatore con vero evento; scompare su stop/logout/disconnessione; nessuna simulazione di attività | Da fare |
| 2.4 | Storage foto reale, revoca consenso, errori API e rete | Owner/RLS file, foto primaria, revoca; nessun accesso privato non autorizzato | Da fare |
| 2.5 | UI mobile + accessibilità | 375px / 768px / desktop; tastiera, annunci ARIA essenziali, contrasto, target 44px, focus, riduzione movimento | Da fare |
| 2.6 | Parità schema e permessi Supabase cloud, **solo audit read-only**, poi staging isolato, migrazione/backup/restore | RPC `lm360_get_public_profiles`, trigger likes, policy sovrapposte, `match_scores`, messaggi, view legacy e GRANT confrontati con frontend; prova rollback in staging | Da fare |

### Decisioni di prodotto per 2.1: revoca e blocco

- **24 ore senza attività non revocano automaticamente un match.** Possono soltanto mostrare, se gradito, uno stato locale e scherzoso di «pausa». Non dedurre sentimenti dal silenzio.
- **Revoca match:** un partecipante può chiudere il rapporto in modo esplicito, senza dover giustificare la scelta. Prima conferma neutrale; backend nega nuovi invii e accesso attivo alla stanza. Stabilire in un mini-contratto se la cronologia è visibile o nascosta ai partecipanti dopo la revoca; **non eliminarla automaticamente**, per non cancellare eventuali prove di segnalazioni.
- **Blocca:** azione evidente ma non invasiva, efficace server-side, distinta da «Segnala»; chi blocca non deve ricevere nuovi messaggi. La motivazione è facoltativa e non viene mostrata all'altro. Prevedere un percorso di sblocco protetto, da definire.
- **Segnala:** percorso indipendente per comportamenti scorretti, con minima raccolta di dati e accesso riservato ai moderatori autorizzati.
- **Test:** non modificare la coppia sintetica Andrea/Bianca già usata come evidenza; generare coppie nuove ed eliminarle con cleanup in `finally`, senza `db reset`.

**Gate di uscita Fase 2 — LAB:** tutti i test 2.1–2.5 documentati, `npm test` e `npm run build` verdi, privacy fail-closed, nessuna regressione Realtime. **Gate di uscita per merge/deploy:** anche 2.6, staging, backup/restore e autorizzazione esplicita. Non confondere i due gate.

## 4. Fase 3 — LoveMatch360 Alive: microinterazioni con carattere

La Fase 3 è una *esperienza*, non un'altra architettura. Primi quattro simboli approvati come direzione visiva dall'utente, sulla base dell'immagine di riferimento: **cuore, sorriso, messaggio, scintilla**. La loro animazione va realizzata in componenti UI accessibili; l'anteprima GIF non è codice né asset produttivo già integrato.

| Icona | Gesto divertente | Quando appare | Guardrail |
| --- | --- | --- | --- |
| Cuore | Un battito elastico, breve bagliore caldo | Hover/focus o like realmente confermato | Non suggerire match reciproco se non esiste |
| Sorriso | Piccolo salto e occhiolino | Hover/focus o azione positiva | Mai prendere in giro rifiuti e difficoltà |
| Messaggio | Rimbalzo lieve e tre puntini | Hover/focus; «sta scrivendo» solo se il backend lo conferma | Mai inventare che l'altro stia scrivendo |
| Scintilla | Rotazione minima e luce breve | Apertura spunto o completamento reale | Non coprire il testo né ripetersi continuamente |

**Direzione estetica:** dark/glass coerente con l'app; forme leggere, microcolori riconoscibili, niente luci aggressive. Animazioni in risposta a interazioni, non una festa continua. Transizioni brevi (~180–350 ms), proprietà `transform` e `opacity` quando possibile, budget leggero su mobile, nessun layout shift. Fermo immagine e focus/accessibile equivalenti con `prefers-reduced-motion: reduce`. Nessuna animazione necessaria per capire un'azione.

### Linguaggio e piccoli scherzi, senza finzioni

- **«Sta scrivendo…»** = evento di typing reale, con scadenza automatica.
- **«Mi prendo un momento» / «Sto riflettendo»** = stato che l'utente può scegliere volontariamente, mai inferito.
- **«Sta pensando»** può essere una frase buffa riferita **al sistema stesso** in un'illustrazione decorativa, non un'affermazione sul partner.
- **«Decisione presa!»** = solo dopo un'azione confermata, senza timer o pressione.
- **«Sta vivendo la sua vita»**, avatar che si gratta la testa o guarda altrove = scena illustrativa o empty state dichiaratamente giocoso, non telemetria sulle persone.
- **30 secondi di inattività:** al massimo un *invito leggero* facoltativo e non ripetitivo («Le parole giuste stanno facendo un giro ☕»). Nessun conto alla rovescia alla chiusura, nessuna disconnessione o suono non richiesto.
- **Suono:** default spento; consenso e interruttore facilmente raggiungibile; rispettare mute e impostazioni di accessibilità.

### Ordine di implementazione Fase 3

**3.1 — Demo esclusivamente locale / feature flag OFF:** 4 icone animate in una singola superficie UI, con test accessibilità, dark mode e performance. Nessuna modifica DB.

**3.2 — Microstati chat reali:** indicatore typing già corretto nella Fase 2; stato «pausa» scelto volontariamente; microcopy di attesa senza falsi eventi.

**3.3 — «Parliamo del nostro ritmo»:** card facoltativa **solo dopo** conferma server che la chat sia autorizzata. «Apri lo spunto», «Non ora», «Chiudi»; nessun messaggio generato, nessun blocco del compositore. Il feedback privato al successivo ingresso rimane uno sviluppo **separato**, da avviare solo dopo scelta esplicita e audit dei privilegi. Non aggiungere ora i due campi JSONB proposti in precedenza.

**3.4 — Preview e test con persone:** mobile, screen reader, controllo animazioni e preferenze suoni; nessun tracking di contenuti personali; verificare che gli effetti migliorino la comprensione e non distraggano.

**Gate di uscita Fase 3:** esperienza divertente e facoltativa, zero invii automatici, zero errori di autorizzazione, test verdi, nessun peggioramento sensibile di Lighthouse. Solo dopo questi PASS valutare un pilota controllato.

## 5. Valore e KPI: niente promesse senza misure

- **Attivazione:** sign-up rate, profili completi, time-to-first-like.
- **Qualità relazione:** match reciproci/utente, messaggi/utente e quota di conversazioni che partono davvero (non sola quantità di notifiche).
- **Fiducia:** blocchi/segnalazioni verificati, zero accessi non autorizzati nei test negativi, tempo di risoluzione dei bug privacy.
- **Esperienza:** L7 retention, navigazione mobile e accessibilità, impressione di chiarezza del prodotto.
- **Spunto relazionale, solo in eventuale pilota autorizzato:** metrica 30 giorni già definita in `relazione-ritmo-spunto-v1.md`: almeno 30 riscontri validi e 60% «Sì, molto» + «Abbastanza» fra chi ne ha parlato; `not_yet` separato. Nessun giudizio sulla persona.
- Nessun KPI deve spingere gli utenti a scrivere o restare connessi controvoglia. Analytics aggregati, non PII.

## 6. Procedura operativa, una sola azione alla volta

1. **Partire dal gate 2.1.** Prima creare una *specifica testabile* della revoca: quali accessi cessano, gestione cronologia, blocco e sblocco. Leggere trigger/policy esistenti; non fare DDL senza revisione.
2. Eseguire test negativo con **nuova** coppia sintetica nel Docker LAB, isolamento loopback, cleanup e stato dei messaggi pre/post. Se FAIL: diagnosticare, non allentare permessi.
3. Solo dopo PASS procedere al 2.2 e così via; integrare test automatici, commit, verbale in `docs/`, GitHub CI e prova utente per ogni gate.
4. In parallelo alla documentazione (non al deploy), preparare il prototipo puramente visivo 3.1 con flag OFF, senza modifiche ai permessi.
5. A valle di ogni fase, registrare PASS/FAIL, prova, rischi residui e rollback. Fare merge solo con consenso esplicito.

### Definition of Done per ogni task

- Una storia utente e un criterio di accettazione osservabile.
- Modifiche limitate a file esistenti; eventuali nuovi componenti/test solo se realmente utili.
- Test positivo e negativo, comportamento senza rete, mobile/tastiera e `prefers-reduced-motion` quando pertinente.
- Nessun PII nei log; SQL compatibile con Supabase e RLS; nessuna chiave privata nel browser.
- `npm test` e `npm run build` verdi, descrizione PR e verbale aggiornati.
- Piano di rollback: prima del merge = revert del commit nel branch; per SQL soltanto staging con restore verificato; **mai reset del LAB con account A/B esistenti**.

## 7. Stato delle decisioni e rilascio

- **Approvati come direzione:** fiducia + ironia; quattro icone animate, chat viva ma onesta, libertà di revoca/blocco, spunto facoltativo.
- **Da definire prima di implementare:** semantica esatta della cronologia dopo revoca e del blocco, UX del consenso ai suoni, archiviazione privata del feedback dopo audit.
- **Esplicitamente esclusi ora:** countdown coercitivi, revoca automatica dopo 24 ore, fingere attività altrui, nuova monetizzazione, nuove colonne/tabelle senza decisione, raccolta di dati chat per analytics.
- **Stato tecnico al 16/11/2026:** PR #27 **draft**, `main` invariato, Supabase online e Stripe intatti. Il piano non autorizza deploy.

**Primo checkpoint di lavoro:** scrivere e collaudare il contratto **2.1 — revoca match, blocco e segnalazione**, partendo dallo schema effettivo del LAB e senza alterare la coppia Andrea/Bianca.


## 8. Checkpoint Fase 3.1 — Prima implementazione React (16/11/2026)

**Stato: codice realizzato nel branch di integrazione, test automatici PASS, prova visuale nel browser LAB ancora da eseguire.** Non è una funzionalità pubblicata.

### File effettivi

| File | Contenuto / responsabilità |
| --- | --- |
| src/components/alive/AlivePreview.jsx | Anteprima interattiva con quattro pulsanti Heart, Smile, MessageCircleHeart, Sparkles; clic seleziona/deseleziona, aria-pressed e feedback accessibile aria-live=polite; nessuna chiamata a Supabase, analytics o messaggi |
| src/components/alive/AlivePreview.css | Dark/glass; quattro animazioni heartbeat/wink/pop/twinkle; focus visibile, touch target ampi, layout a due colonne sotto 760px, prefers-reduced-motion |
| src/pages/Home.jsx | Mostra il componente solo con import.meta.env.DEV e VITE_LM360_ALIVE_PREVIEW=true; una build di produzione non lo mostra neppure se il flag è configurato |
| tests/alivePreview.test.js | Contratti di sicurezza flag, quattro icone, assenza backend, semantica pulsanti e movimento ridotto |

### Protocollo manuale sul PC Windows (un'azione per volta)

1. Docker Supabase LAB già attivo; evitare db reset e qualsiasi deploy.
2. Aggiornare soltanto il clone LAB:
   git -C 'I:\lm360-clean\LM360_FASE2_LAB' pull --ff-only
3. Chiudere l'eventuale server Vite su 5174 con Ctrl+C. Poi in PowerShell eseguire queste righe nell'ordine:

    $env:VITE_LM360_ALIVE_PREVIEW = 'true'
    try {
      & 'I:\lm360-clean\LM360_FASE2_LAB\scripts\local-only\start-fase2-browser.ps1'
    } finally {
      Remove-Item Env:\VITE_LM360_ALIVE_PREVIEW -ErrorAction SilentlyContinue
    }

4. Aprire http://127.0.0.1:5174/#/ e provare tutte le icone: clic/tocco, Tab + Enter/Space, descrizioni, vista mobile 375px/768px, preferenza movimento ridotto. L'anteprima compare dopo le card di esplorazione.
5. Fermare Vite con Ctrl+C; riavviare senza flag e verificare che l'anteprima non compaia.

**Gate visuale:** microanimazioni piacevoli e brevi, nessun evento chat/like, nessuna attività umana falsamente simulata, UI accessibile e stabile su mobile. Non confondere CI PASS con QA browser PASS.

**Rollback:** rimuovere il flag dall'ambiente per nascondere subito l'anteprima; revert mirato dei commit del branch per togliere il codice, se necessario. Nessuna migrazione SQL e nessun server remoto modificato.


### Check visivo Cuore — 16/11/2026

L'utente ha verificato la preview nel browser LAB: **pulsazione PASS**, **messaggio di feedback PASS**, ma **cambiamento cromatico FAIL** nella prima versione, perché l'icona era già rosa da inattiva e la selezione modificava solo il bordo con contrasto insufficiente.

**Correzione minima:** in `src/components/alive/AlivePreview.css` il cuore selezionato `.lm360-alive-card--heart.is-selected` ha fondo e bordo più evidenti; l'SVG ora passa da `fill:none` al riempimento `#ff81b9` e mantiene un bagliore rosa finché `aria-pressed=true`. Un secondo clic deseleziona. Nessun evento like o modifica backend. Il focus accessibile e la riduzione del movimento rimangono intatti.

**CI successiva:** 194 test PASS, 0 FAIL e build Vite riuscita sul commit `c6f940a`. **La resa cromatica sul browser dell'utente deve ancora essere riverificata dopo il pull**, quindi non dichiarare PASS visivo definitivo prima di quel controllo.


### Check visivo Cuore — PASS finale 17/11/2026

**Evidenza screenshot reale di Chrome nel LAB locale**, dopo aggiornamento al commit `c014ca7`: il pulsante Cuore è selezionato, l'icona SVG è **riempita di rosa**, il pannello ha **bordo e sfondo luminosi** e il testo di feedback appare sotto le quattro icone. La pulsazione era già stata confermata dall'utente nella prova precedente. **Cuore: 3/3 PASS**, composito fra conferma del movimento e verifica screenshot della versione corretta.

Prossimo controllo **ancora da eseguire**: pulsante Sorriso — salto/rotazione breve, feedback sotto le icone, selezione evidente. Non confondere il PASS del Cuore con il PASS dell'intera Fase 3.1; mobile, tastiera e movimento ridotto restano da provare.

Non sono stati registrati dati del profilo visibili nello screenshot. Nessuna modifica a Supabase, produzione o Stripe.


### Check Sorriso — feedback dell'utente 17/11/2026

**Prima prova visiva nel LAB**: salto confermato PASS; rotazione quasi invisibile; messaggio sotto le icone non visto. Il componente originale faceva partire l'animazione già su hover/focus, ma cambiava il messaggio soltanto al clic; i due gesti non erano sincronizzati.

**Correzione nel branch, ancora da validare nel browser**:
- `src/components/alive/AlivePreview.jsx`: stato di anteprima su mouse hover e focus da tastiera, ritorno allo stato selezionato su uscita; il clic resta un toggle persistente. Il messaggio dinamico ha etichetta esplicita («Sorriso: ...») e `aria-live=polite` già esistente.
- `src/components/alive/AlivePreview.css`: piccolo salto più alto, rotazione fino a -23°/+21° (prima ±8°), selezione con bordo/fondo dorato, messaggio con contrasto e sfondo evidenziati. Il blocco `prefers-reduced-motion` resta attivo e non ci sono animazioni infinite.
- `tests/alivePreview.test.js`: regressione di stato, testo, CSS e riduzione movimento.

**Prova successiva:** aggiornare la copia LAB e verificare sul sorriso (1) salto+rotazione visibile (2) messaggio già su hover/focus (3) colore dorato selezionato dopo clic. Nessun deploy o modifica database.


### Check Sorriso — conferma utente 17/11/2026

Dopo aggiornamento del clone LAB con la correzione a rotazione/feedback, l'utente conferma: «Sì, molto meglio, e anche la frase». **PASS osservato per movimento del Sorriso più riconoscibile e messaggio sotto le icone**. Lo stato cromatico giallo persistente non è stato confermato separatamente; non attribuire un PASS visivo a quel dettaglio senza prova. Nessuna modifica al database, alla produzione o a Stripe. Prossimo microcollaudo: icona Messaggio (piccolo rimbalzo, tre puntini grafici, testo esplicativo).


### Check Messaggio — conferma utente 17/11/2026

**Prova manuale nel browser LAB**: l'utente ha confermato **3/3 PASS** per l'icona Messaggio: piccolo rimbalzo visibile, tre puntini animati e comparsa della frase «Questi puntini sono un gioco grafico. Non indicano che una persona stia scrivendo.». La preview è soltanto illustrativa e non usa stati di digitazione reali, non invia messaggi, non modifica dati.

**Prossima verifica:** Scintilla — piccolo movimento/rotazione, effetto luce viola e frase sotto le icone. Dopo, QA mobile, tastiera e movimento ridotto. PR #27 resta draft; nessun deploy o intervento su Supabase cloud/Stripe.


### Check Scintilla — bagliore viola da verificare 17/11/2026

**Prova locale dell'utente:** (1) rotazione breve **PASS**; (2) bagliore **non osservato**; (3) frase «Una piccola scintilla. La magia, qui, non prende decisioni al posto tuo.» **PASS**. Il colore statico iniziale era già viola e l'animazione muoveva solo l'icona, senza un vero alone luminoso.

**Correzione mirata, ancora da collaudare visivamente:** in `src/components/alive/AlivePreview.css` aggiunto un alone radiale viola dietro la scintilla e un doppio bagliore SVG `drop-shadow` durante hover/focus/selezione; sul pulsante selezionato restano un bordo viola e un fondo luminoso persistenti. Nessuna animazione infinita o lampeggiante; `prefers-reduced-motion` mantiene il segnale statico. Nuovo test di regressione in `tests/alivePreview.test.js`.

**GitHub CI codice:** 196 test PASS, 0 falliti, build Vite riuscita sul commit `6a7164a`. **Scintilla ancora 2/3 PASS nel browser fino a riconferma** dopo aggiornamento. Nessuna modifica a DB, Vercel produzione o Stripe; PR #27 resta draft.


### Check Scintilla PASS e bagliori coordinati — 17/11/2026

L'utente ha confermato visivamente «Per-fettoo» per la **Scintilla viola** dopo l'aggiunta dell'aureola: rotazione, frase e bagliore ora **3/3 PASS** nel browser LAB. Ha quindi chiesto lo **stesso bagliore per le altre tre icone**, ciascuno col proprio colore, per aumentare visibilità e carattere.

**Implementato su branch LAB:** `src/components/alive/AlivePreview.css` estende l'alone radiale e il doppio `drop-shadow` a Cuore **rosa**, Sorriso **oro** e Messaggio **azzurro**, con variabili per le tre palette. Hover/focus mostrano il bagliore, click mantiene la selezione; animazioni esistenti inalterate. La Scintilla conserva il suo effetto viola approvato. Il Sorriso selezionato resta dorato correggendo l'ordine delle regole CSS; il Messaggio selezionato ha bordo e fondo azzurro; i tre puntini restano davanti all'SVG. Restano `aria-pressed`, focus visibile e rispetto di `prefers-reduced-motion`; nessun comportamento backend.

**QA automatico:** test di regressione in `tests/alivePreview.test.js`; commit `a97c433` **197 test PASS, 0 falliti e build Vite OK**. **QA browser delle tre nuove aureole ancora pendente**: non dichiararlo PASS senza screenshot/conferma utente. Poi verificare mobile (375/768 px), tastiera (Tab, Enter, Space), movimento ridotto, nessun like inviato. PR #27 resta draft, nessun deploy o modifica DB/Stripe.

**Rollback:** disattivare `VITE_LM360_ALIVE_PREVIEW` nel LAB per nascondere la preview; revert selettivo del commit CSS `c9fb39b` solo se necessario e con audit del branch prima di intervenire.


### Messaggio più espressivo — 17/11/2026

Su richiesta dell'utente, **prima del prossimo pull**, amplificato moderatamente e solo nel LAB il movimento del Messaggio azzurro, mantenendo lo stile distinto dalle altre tre icone. In `src/components/alive/AlivePreview.css`: rimbalzo dell'icona da 480 ms/scala 1.16 a 660 ms, traslazione verticale -8 px e scala 1.22; puntini da 4 a 5 px, salita da 4 a 6 px e sequenza da 450 a 560 ms con ritardi 100/200 ms. Bagliori cromatici, Cuore, Sorriso e Scintilla invariati. Il testo continua a spiegare che non è digitazione reale; nessuna chiamata backend.

Aggiornato `tests/alivePreview.test.js` per controllare durata, ampiezza, leggibilità dei puntini, stato selezionato e `prefers-reduced-motion`. La prova manuale del rimbalzo aggiornato e dei quattro bagliori si farà **solo dopo il pull**. Nessuna modifica a produzione, Supabase o Stripe; PR #27 ancora draft.
