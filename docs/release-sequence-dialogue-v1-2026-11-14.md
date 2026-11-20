# LoveMatch360 — Piano di rilascio: da sicurezza a «Una conversazione che conta»
**Stato: piano attivo, branch di integrazione ancora in bozza. Nessun via libera a produzione.**

## Regole non negoziabili

- Nessun dato personale nei log o nei test; usare solo utenti sintetici.
- Nessun nuovo checkout / acquisto; Stripe invariato.
- Nessuna modifica alla produzione fino a ripristino verificato, test negativo RLS e revisione.
- Non aprire nuove tabelle o altre architetture per comodità: partire dallo schema reale e dai componenti esistenti.
- La pagina pubblica deve essere interessante e navigabile senza account; l'accesso ai dati personali resta autenticato.

## Ordine di realizzazione e condizioni di passaggio

### 0. Baseline verificata — FATTO, MA NON E2E
- [x] Termini, AUP e Manifesto pubblicati con HTTP 200 e titolo HTML corretto (verifica proprietario).
- [x] FAQ/Sicurezza visualizzabili in browser (verifica proprietario).
- [x] Test locali PostgreSQL V1 e V2 con dati sintetici: PASS (output del proprietario).
- [x] GitHub Actions precedente alla sequenza: 143 test verdi e Vite build verde (commit `971f0b7`).
- [ ] Navigazione completa di tutte le pagine sul sito vivo e percorso Auth/Storage/E2E.

### 1. Audit e messa in sicurezza database — AVVIATO / NON APPLICATO
- [x] Fotografia solo metadati DB: RLS attiva sulle cinque tabelle core; occorre rivedere i GRANT effettivi, la sovrapposizione delle policy e il contratto API usato dal frontend.
- [x] Creato `scripts/audit-security-gates-readonly.sql`: query di sola lettura, senza righe personali.
- [ ] Riconciliare SQL V1/V2 isolato con **schema effettivo**, indici, vecchi trigger, grants, funzioni e obblighi della app.
- [ ] Verificare disponibilità delle RPC indispensabili per Stanza 360, chat e scoperta pubblica, senza creare automaticamente nuove tabelle.
- [ ] Preparare migrazione riproducibile **solo per staging isolato**; evitare SQL di staging sul progetto online.
- [ ] Aggiungere test allow/deny per A, B, anon, terzo, utente sospeso; like reciproci e revoca; foto/consenso; read-only delle risposte private.
- [ ] Prova in staging autentico Supabase (Auth, RLS, Storage, REST/Realtime); i test PostgreSQL senza rete non coprono queste integrazioni.
- [ ] Backup verificato, simulazione rollback e revisione puntuale delle operazioni che potrebbero bloccare utenti esistenti.
**Gate di uscita:** report tecnico, PASS isolato e staging, nessuna esposizione di dati altrui e piano restore provato.

### 2. Collaudo funzionale base con due account sintetici
- [ ] Home -> registrazione -> conferma email -> login -> profilo e foto -> consenso esplicito -> Scopri -> primo like -> like reciproco -> Match -> Stanza -> chat.
- [ ] Profilo privato, revoca del consenso, logout, errore RPC, utente sospeso, limiti di Realtime/Storage.
- [ ] Test browser desktop/mobile e accessibilità WCAG 2.2 AA; non modificare la produzione per effettuare questi test.
**Gate di uscita:** intero percorso funzionante su staging, con prove e nessun dato reale.

### 3. Spunto facoltativo dopo match
- [ ] Solo in `src/pages/ChatBox.jsx`, *dopo* verifica dell'accesso effettivo alla chat.
- [ ] Posizione sotto il titolo, sopra i messaggi; «Apri lo spunto · Non ora · Chiudi».
- [ ] Apertura individuale non invia alcun messaggio, non modifica `score=100`, non blocca l'input.
- [ ] Feature flag inizialmente spento: nessuna funzione incompleta viene mostrata su produzione.
**Gate di uscita:** prova UI e test automatici di accesso, testo, chiusura e assenza invii.

### 4. Stato individuale e feedback privato
- [ ] Prima di aggiungere campi a `match_scores`, togliere **grant di tabella** incompatibili con campi riservati; definire privilegi per colonne pubbliche necessarie ed evitare `SELECT *`.
- [ ] Verificare la proiezione e il controllo delle RPC, con attore `auth.uid()`, match reciproco, accesso chat e coppia canonica. Ciascun partecipante gestisce solo il proprio stato; l'altro non può leggerlo.
- [ ] Sulla *successiva* apertura della stessa chat: un'unica visualizzazione, atomica, resistente a due dispositivi e refresh; risposte cinque + Salta.
- [ ] Nessun testo di chat, punteggio, email o identificatore nei dati analytics; aggregazione con `not_yet` separato da `little`/`no`.
- [ ] Definire retention effettiva e aggiornare Informativa Privacy **prima** di attivare il feedback.
**Gate di uscita:** test simultanei e negati, privacy verificata, copy approvato.

### 5. Verifica finale e rilascio esplicito
- [ ] `npm ci`, `npm test`, `npm run build`, test su staging, E2E, 375px/768px/desktop, tastiera, report di sicurezza.
- [ ] Documentazione pubblica e sito `www` verificati separatamente dall'app.
- [ ] Validare backup e restore, acquisire approvazione umana al merge e pianificare un rilascio reversibile.
- [ ] La PR #27 resta `draft` fino al superamento di tutti i blocchi; niente merge automatico.
- [ ] Stripe in pausa fino a decisione scritta separata e servizio affidabile.

## Contratto di prodotto
Testo e comportamento definitivi: [Spunto sul ritmo della relazione](./relazione-ritmo-spunto-v1.md).
Valore prioritario: anticipare conversazioni importanti, **non classificare persone**.
Metrica pilota: 30 giorni, almeno 30 riscontri utili, >=60% `Sì molto + Abbastanza` tra chi ne ha parlato; `Non ne abbiamo ancora parlato` resta separato.

## Rollback
- Prima del merge: revert dei commit del branch / chiusura della bozza; nessun effetto su produzione.
- Staging SQL: container eliminato, o restore di staging verificato; nessuna copia di dati reali.
- Produzione (solo in una fase futura, previa autorizzazione): backup verifi­cato, restore provato, rollback testato per ciascuna migrazione; mai dedurre la reversibilità solo da un `ROLLBACK` SQL.
