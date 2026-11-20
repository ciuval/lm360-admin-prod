# LoveMatch360 — Gate 2.1 · Proposta minima di persistenza, V1

**Data:** 17/11/2026. **Stato:** soltanto progetto architetturale su PR #27 Draft. NON è SQL eseguibile, non è una migration e non autorizza modifiche a schema, permessi, dati o produzione.

**Dipende da:**
- `docs/GATE_2_1_STATI_PAUSA_RIPRESA_SCUSE_CHIUSURA_V1_2026-11-17.md`
- `docs/GATE_2_1_PONTE360_CONSENSO_BILATERALE_V1_2026-11-17.md`
- `docs/GATE_2_1_PONTE360_MEDIAZIONE_CONSENSUALE_V1_2026-11-17.md`

## 1. Riscontri già verificati e limite del modello corrente

Nel **solo schema sintetico LAB**:
- `likes` contiene `user_id`, `user_from`, `user_to`; il trigger `AFTER INSERT` può creare il match `score=100`.
- `match_scores` contiene la coppia `user_a/user_b` e un `score` limitato a 0 o 100, **non** uno stato di mediazione.
- `messaggi` contiene mittente/destinatario e testo; la chat privata non deve contenere inviti, scuse o messaggi della stanza mediata.
- `stanze_360` riguarda la compatibilità e non il consenso di mediazione.
- La patch sperimentale **solo Docker LAB** fa scendere `score` a 0 dopo DELETE like e chiude la SELECT storico. Il test API di revoca dopo patch è PASS.
- La verifica nomi del catalogo ha riportato **0 indizi** di oggetti pausa/chiusura/blocco/richieste; questo non dimostra l'assenza universale di logica equivalente.

**Limite critico:** due nuovi like possono far risalire `score` a 100. Un match non può considerarsi definitivamente `CLOSED` usando soltanto `score=0`. Un flag in `localStorage` o uno stato React non protegge API e sessioni già aperte.

Nessuna affermazione di questo documento certifica lo schema di Supabase cloud.

## 2. Modello minimo proposto, non creato

Per evitare colonne sulle tabelle correnti, il modello può essere aggiunto **solo dopo approvazione espressa** come strutture separate. Distinguere fase sicurezza e fase stanza mediata; prima di approvare confrontare lo schema reale.

### Fase A — Due entità persistenti, senza chat mediata

**Entità 1: `relationship_controls`** (nome di lavoro, una riga per coppia canonica):
- `user_a`, `user_b` UUID con ordine canonico, coppia unica e partecipanti distinti.
- `paused_a`, `paused_b`: due decisioni indipendenti, revocabili solo dal titolare.
- `blocked_a`, `blocked_b`: blocchi direzionali; nessun gesto bypassa il blocco.
- `closed_at` e `closed_by`: chiusura persistente, non cancellabile da nuovi like o dalle sessioni esistenti.
- `episode_number`: cambia **solo** dopo una ripresa reale condivisa, non con refresh o toggle artificiosi.
- `gesture_a`, `gesture_b`: scelta una tantum per episodio fra `request_resume`, `apology`, `offer_mediation`; `NULL` finché non inviata.
- `version` (intero monotono), `updated_at`: gestione di conflitti, stati incerti e aggiornamento UI.

Gli stati `ACTIVE`, `PAUSED_BY_A`, `PAUSED_BY_B`, `PAUSED_BY_BOTH`, `CLOSED`, `BLOCKED` si **derivano** dai campi, con precedenza **BLOCKED/CLOSED > PAUSED > ACTIVE**. Non conservare un ulteriore `status` mutabile e potenzialmente contraddittorio.

L'identificativo della coppia resta privato nei dati: mai log di UUID, e-mail, motivazioni o contenuti. Nessun mediatore può scrivere questa entità.

**Entità 2: `mediation_invites`** (nome di lavoro, una riga per invito/istanza):
- `id` opaco, `user_a`, `user_b`, `episode_number`: invito riferito a coppia ed episodio specifici.
- `requested_by`: soltanto uno dei partecipanti, con controllo lato server e limite gesto sull'entità 1.
- `consent_a_at`, `consent_b_at`: conferme separate per **la medesima istanza**, mai attribuibili dall'altro partecipante o da Ponte360.
- `withdrawn_at`, `ended_at`, `created_at`: ritiro unilaterale/chiusura e audit strettamente necessario. Il valore `withdrawn_at` non autorizza riaperture.
- `mediator_id` (solo se mediatore umano con identità verificata e abilitazione): **nessun accesso alla chat privata** e nessun privilegio `service_role`.

`INVITED`, `ONE_CONSENT`, `BOTH_CONSENTED`, `IN_SESSION`, `ENDED` sono **stati applicativi derivati e convalidati server-side**. Se serve un marcatore di attivazione `started_at`, valutarlo solo nel disegno successivo: non aprire una stanza sulla sola presenza di due timestamp senza ricontrollare i controlli di coppia.

Non consentire più inviti concorrenti validi per la stessa coppia/episodio. Una richiesta duplicata non genera una seconda notifica. L'invito e le conferme non devono essere inseriti come messaggi della chat privata.

**Attenzione a ritiro e consenso:** `withdrawn_at` è terminale per l'istanza; una nuova adesione richiede una **nuova proposta ammissibile**, non il recupero dei vecchi timestamp. Qualsiasi chiusura/blocco impone fine/negazione immediata, anche con consensi preesistenti.

### Fase B — Stanza mediata solo dopo la fase A

**Entità futura 3: `mediation_messages`** (NON parte della prima fase):
- `mediation_id`, `author_id`, `text`, `created_at`, eventuale `id`: messaggi esclusivamente della stanza nuova.
- Il mediatore vede **solo** contenuti condivisi esplicitamente in questa stanza **dopo** due consensi validi.
- RLS/controllo RPC nega accesso a tutti dopo revoca, chiusura o blocco, salvaguardando l'eventuale conservazione lecita senza fingere cancellazione retroattiva.
- Non riutilizzare `public.messaggi` per la mediazione e non importare la cronologia.

Questa suddivisione riduce la superficie iniziale: **non costruire una chat a tre prima di aver provato il consenso**. Il nome e il numero di entità sono proposte, non decisioni di migrazione.

## 3. Contratto di sicurezza necessario prima di scrivere SQL

- **Identità:** ogni mutazione è associata a `auth.uid()` verificato nel database, mai all'identità dichiarata nel body o in `user_metadata`. Il mediatore non può dichiararsi A/B.
- **Scrittura protetta:** niente INSERT/UPDATE/DELETE diretti per client sulle entità di controllo; usare operazioni molto ristrette e sottoposte ad audit su grant, RLS e poteri effettivi. Nessun `service_role` nel browser.
- **Atomicità:** lock della riga canonica della coppia (o altro meccanismo transazionale equivalente) per serializzare pausa, revoca pausa, richiesta, invito, blocco, chiusura, consenso e invio. Se si invia nello stesso momento in cui una pausa/chiusura viene confermata, non deve essere committato un messaggio dopo la chiusura.
- **Coerenza:** una stessa decisione server-side è rispettata da `can_open_stanza`, `send_stanza_message`, SELECT/UPDATE `messaggi`, eventuali canali Realtime e API di likes/match.
- **Stop persistente:** `closed_at` e blocco prevalgono su nuovi like e su eventuale trigger di match reciproco. La semplice cancellazione del like **non** equivale alla chiusura definitiva.
- **Lettura:** durante la pausa i partecipanti possono leggere la propria cronologia privata solo se la policy del prodotto lo consente; nessun nuovo messaggio. Dopo chiusura/blocco la cronologia non è accessibile come chat attiva. Il mediatore non legge mai lo storico A/B.
- **RLS e RPC:** revisione `SECURITY DEFINER`, proprietà dell'oggetto, `search_path`, `EXECUTE`, ruoli `authenticated/anon` e policy per comando. Evitare una vista o funzione che bypassi involontariamente la RLS.
- **Idempotenza:** doppio click, retry, più schede, login nuovo e richieste fuori ordine non consumano più gesti o riaprono sessioni.
- **Privacy:** minimizzazione, chi può vedere esiti/consensi, durata di conservazione, opposizione e diritti da approvare prima della fase reale.

### Condizione che blocca il progetto

I requisiti **non sono soddisfacibili in modo robusto soltanto con le colonne `likes`, `match_scores` e `messaggi` attuali** senza cambiare il significato di campi esistenti o falsare i dati. Non proporre di memorizzare consensi legali, pause o blocchi dentro `score` o `testo`.

**Non si autorizza qui alcuna nuova tabella o colonna.** Nessun SQL eseguibile viene consegnato da questo documento.

## 4. Prove locali richieste prima dell'approvazione schema

1. **R01–R06**: pausa A, tentativo B di riprenderla, pausa entrambi, ripresa indipendente, nessun invio in pausa, storico gestito secondo policy.
2. **C01–C04**: chiusura non riattivabile dopo nuovi like e accesso negato per due browser/sessioni e RPC diretta.
3. **B01–B04**: invito senza consenso, singolo consenso non sufficiente, impersonazione negata, due consensi riferiti alla stessa istanza.
4. **B05–B08**: mediatore non legge chat precedente; revoca unilaterale efficace; singolo gesto per episodio e invito duplicato negato.
5. **B10–B15**: blocco/chiusura prevalgono su ogni consenso, sessioni già aperte negate, disconnessioni e utenti estranei senza accesso.
6. **CLEANUP**: nuovi account sintetici; non alterare gli account Andrea/Bianca, non fare `db reset` né pubblicare cloud.

I codici di test definitivi restano nei contratti precedenti; qui gli intervalli raggruppano i controlli senza dichiararli eseguiti.

## 5. Scelta operativa e rollback

- **Adesso:** tenere la patch di revoca solo nel Docker LAB, senza annullarla; non toccare schema/cloud/React.
- **Prossimo passo:** confronto read-only con lo schema reale e verifica della necessità di una persistenza nuova; solo successivamente una decisione esplicita sulla fase A in un clone locale sicuro.
- **Rollback oggi:** nessuno necessario, perché questa è soltanto documentazione. Eventuali migrazioni future devono avere una strategia separata di rollback e di preservazione di record/consensi già esistenti.
- **Stato:** PR #27 Draft, nessun merge o deploy, Stripe sospeso.

**Regola guida:** nessuna nuova possibilità di contatto deve diventare una scorciatoia intorno a un «no».
