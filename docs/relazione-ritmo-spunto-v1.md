# LoveMatch360 — Spunto sul ritmo della relazione (V1)

**Stato:** proposta di prodotto, non implementata. **Priorità n. 1:** dopo il match, facilitare una conversazione significativa senza valutare persone o coppie. Documento di progetto; **non** autorizza un deploy.

## Fondamento nelle regole attuali

- `public/legal/termini.html`, versione 31 ottobre 2026, §2: match = condizione d'interazione, non verifica dell'identità, valutazione scientifica o promessa di relazione. La partecipazione resta libera.
- `public/legal/uso-accettabile.html`, versione 31 ottobre 2026, §1 e §3: rispetto di limiti, consenso e rifiuti; il match non autorizza pressioni; no crediti per messaggio.
- `src/pages/ChatBox.jsx`: chat abilitata soltanto dopo `match_scores.score = 100` e `get_stanza_compatibility(...).opens = true`. Il secondo controllo è **un gate esistente**, non una valutazione del nuovo spunto. Il numero **100** indica interesse reciproco; non va presentato come certezza di compatibilità.
- Le pagine Termini/AUP e FAQ/Sicurezza risultano raggiungibili dai controlli dell'utente (14/11/2026). Questo non certifica ogni permesso backend.
- Premium/checkout in pausa; nessuna funzione a pagamento viene aggiunta.

## Testo esatto per l'interfaccia

**Posizione:** una card non modale sotto il titolo `💬 Stanza con …` e sopra i messaggi. Visibile soltanto dopo conferma server dell'accesso alla chat. Il compositore rimane sempre disponibile.

**Card iniziale, per ogni partecipante in modo indipendente**

- Titolo: **Parliamo del nostro ritmo**
- Testo: **«Quando una conoscenza inizia a diventare importante, quale ritmo ti farebbe stare bene tra sentirvi, vedervi e mantenere i vostri spazi?»**
- Aiuto: **«Potete partire da qui e, se vi va, parlare anche di quando sentirvi pronti a un impegno e di come vorreste far crescere la relazione. Non serve avere la stessa risposta: conta capirsi.»**
- Azioni: **Apri lo spunto** · **Non ora** · **Chiudi**
- `Apri lo spunto`: espande la card, annota solo l'avvenuta apertura nel database tramite RPC autorizzata. Non scrive nel compositore e non invia alcun messaggio.
- `Non ora`: nasconde la card solo durante la visita corrente, senza salvare una scelta.
- `Chiudi`: chiude definitivamente la proposta per quell'utente in quel match; non genera feedback.
- Card espansa: mantiene domanda e aiuto, aggiungendo la nota **«Non abbiamo inviato alcun messaggio. Se vuoi, racconta con parole tue ciò che conta per te.»** e il comando **Nascondi lo spunto**. Nascondere dopo l'apertura non annulla l'apertura.

**Feedback (alla successiva apertura della stessa chat, mai nella stessa visita di apertura dello spunto)**

- Titolo: **Un riscontro, solo per migliorare gli spunti**
- Domanda: **«Questo spunto ti ha aiutato a parlare di qualcosa di importante che altrimenti avresti rimandato?»**
- Risposte, una sola scelta: **Sì, molto** · **Abbastanza** · **Poco** · **No** · **Non ne abbiamo ancora parlato**
- Azione alternativa: **Salta**
- Nota: **«La tua risposta è facoltativa e privata: non viene mostrata all'altra persona e non modifica il match.»**
- Viene mostrato **una sola volta** a chi ha aperto la card, non al partner per riflesso. Visualizzazione registrata atomicamente dal backend, per impedire duplicazioni tra dispositivi e refresh. Nessun nuovo sollecito se ignorato o saltato; nessuna lettura dei messaggi.

## Dati minimi, nessuna nuova tabella

Si riutilizza **`public.match_scores`**, già indicizzata per coppia `(user_a,user_b)`. Proporre **due nuove colonne JSONB private**, `dialogue_v1_a` e `dialogue_v1_b`, una per ciascun partecipante, con esclusivamente:

- `opened_at` (timestamp o null) e `closed` (boolean)
- `feedback_shown_at` (timestamp o null)
- `feedback_choice` (codice enum: `yes_very`, `enough`, `little`, `no`, `not_yet`, `skip`; altrimenti null)
- `feedback_at` (timestamp o null)

La relazione con la coppia è implicita nella riga già esistente; **nessun testo di chat, profilo personale, note libere, classificazione dell'utente, punteggio aggiuntivo o identificatore di terzi negli analytics**.

**Vincoli tecnici:** revocare i SELECT/UPDATE diretti sui nuovi campi ai ruoli `anon` e `authenticated`; verificare e migrare gli attuali privilegi di tabella troppo ampi *prima* di aggiungere le colonne, altrimenti i due partecipanti potrebbero leggere le risposte dell'altro. Solo RPC server-side con `auth.uid()`, coppia presente, `score=100` e accesso chat abilitato può leggere o modificare **il proprio** campo; idempotenza/transazione per la visualizzazione singola. Non esporre `dialogue_v1_a/b` tramite viste. Definire `search_path`, privilegi EXECUTE e test negativi delle RPC. Le RPC non toccano `score`.

Conservazione proposta: stato minimo di soppressione fino alla fine del match; risposta individuale eliminata dopo **90 giorni**, mantenendo soltanto la statistica aggregata della finestra. Verificare trattamento e tempi effettivi nell'Informativa Privacy *prima* dell'attivazione. Non loggare PII né dati di chat in `console`, analytics o sistemi di errore.

## Comportamenti

1. Nessun match/chat vietata: nessuna card, nessuna API di scrittura.
2. Match confermato e chat consentita: card discreta. I due partecipanti agiscono separatamente.
3. Apertura: nessun invio; flag per l'utente aggiornato solo se il server conferma.
4. Riapertura successiva **della stessa chat**: backend decide e marca una sola visualizzazione del feedback; nessun feedback se l'altro partecipante ha aperto e io no.
5. Risposta o Salta: un unico valore, immutabile. Errori di rete non trasformati in successo; chat normale sempre disponibile.
6. Blocco/chiusura match: nessun nuovo prompt o feedback; accessi alle API negati.

## Passaggi di prova prima del rilascio

1. PostgreSQL isolato, utenti sintetici A e B: non-match, like singolo, match 100, chat autorizzata/non autorizzata.
2. RLS e privilegi: A legge/modifica soltanto il proprio campo; B non può vedere la risposta di A, `anon` non può leggere nulla; no modifica di `score` o `premium`.
3. Da browser, con A: card iniziale visibile solo dopo chat autorizzata; Apri non invia messaggio; Non ora non registra consenso; Chiudi non genera feedback.
4. Riapertura della **stessa** chat: una sola domanda; due dispositivi e doppio click producono una sola visualizzazione e al massimo una scelta. Aprire un'altra chat non conta.
5. B che non ha aperto lo spunto: nessuna domanda di feedback, nessun dato di A visibile.
6. Test tutte e cinque le risposte e Salta; il codice `not_yet` resta separato da `little` e `no`.
7. Connessione interrotta, match revocato, account sospeso, RPC assente: la card non provoca fughe di dati o falsi successi; messaggistica invariata.
8. Test automatizzati `npm test`, `npm run build`, E2E su account sintetici e verifica accessibilità tastiera/screen reader (WCAG 2.2 AA). Nessun deploy automatico finché i gate backend PR #27 non sono chiusi.

## Valutazione dopo un pilota di 30 giorni

**Metrica primaria:** `(yes_very + enough) / (yes_very + enough + little + no)`, soltanto fra le persone che dichiarano di averne parlato. **`not_yet` viene rendicontato separatamente**; `skip`, assenza di risposta e risposte non ancora raccolte non sono fallimenti.

**Decisione:** mantenere V1 se la metrica è **almeno 60%** con **almeno 30 riscontri validi**; sotto soglia, rivedere testo e momento d'apparizione senza profilare persone. Se il campione è minore di 30, non trarre conclusioni. Pubblicare solo aggregati con numerosità sufficiente; non mostrare risultati individuali all'altro partecipante. Anche riconoscere presto aspettative diverse è un esito utile, non una bocciatura.

## Fuori ambito V1

Nessun nuovo score di relazione, nessuna lettura automatica delle chat, nessun matching AI, nessun giudizio sulle persone, nessuna riflessione privata nel profilo, nessun confronto delle aspettative prima del like, nessuna modifica a Stripe.

## Stato e rollback

**Solo specifica.** La funzionalità, le colonne e le RPC qui descritte **non sono installate**. L'aggiunta di questo file nel branch di integrazione non modifica Supabase, il sito in produzione o Stripe. Rollback della proposta: eliminare il documento dal branch prima di qualsiasi merge.
