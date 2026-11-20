# LoveMatch360 — Gate 2.1 · Quando il rispetto manca, il contatto si chiude

**Data:** 17 novembre 2026  
**Stato:** contratto operativo di sicurezza, non ancora implementato né approvato nel database.  
**Ambito:** solo sviluppo e Docker LAB. Vietato dedurne che la produzione sia protetta.

> «LoveMatch360 non nasce per sfruttare i desideri delle persone, ma per rispettare i loro sentimenti.»

## 1. Tre decisioni distinte, nessun obbligo di continuare

| Gesto | Chi lo decide | Risultato richiesto | Motivazione |
| --- | --- | --- | --- |
| **Chiudi il match** | Uno dei due partecipanti | Si interrompe l'accesso attivo alla Stanza 360 e l'invio di nuovi messaggi da entrambi, anche tramite API; il match sparisce dall'elenco | Non obbligatoria: basta non voler continuare |
| **Blocca** | La persona che non desidera più essere contattata | L'altro non può ricontattarla, rifare il match o aggirare il blocco con la chat; visibilità limitata dove previsto | Facoltativa e non mostrata all'altra persona |
| **Segnala** | Chi riscontra un possibile abuso | Il servizio riceve un caso minimo, lo valuta con priorità proporzionata e può applicare misure effettive | Descrizione dei fatti quando possibile; nessuna colpevolezza automatica |

**Nessuna azione amministrativa automatica definitiva solo perché qualcuno segnala.** Una misura urgente di contenimento può essere necessaria per prevenire danni, con successiva verifica; sospensioni e chiusure devono avere base verificabile, proporzionalità, comunicazioni e possibilità di riesame quando dovute. Un utente può chiudere volontariamente un match **senza dover dimostrare una colpa**.

La fine di un rapporto non autorizza vendette, ritorsioni o divulgazione della cronologia.

## 2. Controlli tecnici non negoziabili

- **Revoca immediata lato server.** Eliminare o revocare un like deve rendere non valido il match reciproco nella stessa operazione atomica e autorizzata. Non basta nascondere un bottone nel browser. Soprattutto, il predicato effettivo di `can_open_stanza` e `send_stanza_message` deve rifiutare la coppia dopo la revoca.
- **Nessuna riapertura automatica.** Un match chiuso può riaprirsi solo con una nuova scelta volontaria valida delle persone coinvolte e nessun blocco in essere; una nuova richiesta non deve eludere il blocco.
- **Cronologia:** nell'interfaccia si chiude e non rimane consultabile come chat attiva dai partecipanti dopo unmatch/blocco. Gli eventuali dati necessari per una segnalazione o un obbligo giuridico non si cancellano automaticamente; accesso ristretto, criteri di conservazione effettivi ancora da definire e riesame dei diritti. Non promettere eliminazione immediata di tutte le copie.
- **Sessioni già aperte e API:** anche chi conosce l'URL, ha la chat aperta in una seconda scheda o richiama direttamente le RPC non può inviare né leggere ulteriori dati vietati dopo la revoca. I canali Realtime vanno chiusi/invalidati nella UI, ma il controllo decisivo è nelle autorizzazioni backend e RLS. Errore di rete = stato incerto, mai conferma fittizia di chiusura.
- **Blocco indipendente dal match:** non è sufficiente togliere il like. Lo stato di blocco deve persistere in un modello già esistente e verificato oppure in un futuro schema sottoposto a audit e autorizzazione; nessuna colonna/tabella nuova senza decisione esplicita.
- **Segnalazione indipendente dal blocco:** si può segnalare anche dopo la chiusura. Non loggare screenshot, contenuti di chat, UUID, email, token o altri dati personali in console/GitHub; nessuna lettura indiscriminata delle conversazioni.
- **Admin/sospensione:** la sola etichetta `status_account` non dimostra che tutte le RPC e le sessioni esistenti siano bloccate. Gate 2.2 ne verificherà l'effetto reale.

## 3. Evidenza nel codice attuale, non ipotesi sul cloud

La baseline di sviluppo in `scripts/local-only/20260910_lm360_core_lab.sql` contiene:

1. `public.likes` con DELETE consentita al proprietario mediante policy `likes_delete_own`.
2. Trigger `lm360_lab_reciprocal_after_like` **soltanto AFTER INSERT**, che crea/aggiorna `public.match_scores` a `score=100`.
3. Nessun meccanismo di revoca automatica del punteggio su DELETE like in quella baseline.
4. In `supabase/migrations/20260911_stanza_360.sql`, `can_open_stanza` controlla la compatibilità e il record di `match_scores` con `score=100`; `send_stanza_message` si basa su quel risultato.
5. La policy `messaggi_read_participants` consente la lettura ai partecipanti indipendentemente dall'esistenza attuale del match. Per questo la sola DELETE del like non chiude necessariamente la lettura storica.

**Problema reale individuato nello schema testuale LAB:** un like cancellato non implica automaticamente che `score=100` sia revocato; il percorso chat può quindi restare autorizzato. **Non esiste ancora una prova eseguita nel Docker locale di questa sequenza dopo revoca**, e il cloud usa uno schema diverso. Nessuna correzione in produzione sulla base di queste sole deduzioni.

## 4. Sequenza esecutiva a rischio minimo

**Step 2.1-A — audit metadati, read-only (ORA).**  
Script: `scripts/local-only/check-gate21-readonly.ps1`. Convalida clone LAB, branch, container e porta loopback. Legge esclusivamente presenza di policy/RLS/GRANT, trigger DELETE e RPC; stampa solo stati YES/NO. Non legge righe, like, match, cronologia o dati personali. Output finale atteso: `GATE21_METADATA_READ_ONLY=COMPLETE` e `GATE21_REVOCATION_E2E=NOT_TESTED`. **Un risultato NO è un'informazione da esaminare, non autorizza a cambiare permessi.**

**Step 2.1-B — test negativo con coppia nuova (NON ancora avviato).**  
Creare due account sintetici **nuovi**, con cleanup in `finally`, non riutilizzare Andrea/Bianca e non eseguire `db reset`. Verificare prima che il match e la chat funzionino. Revocare l'interesse di uno dei due tramite il percorso disponibile; confermare lo stato effettivo del match e tentare, da entrambi, accesso all'URL chat, RPC `can_open_stanza`, RPC `send_stanza_message`, SELECT storico da client autenticato e ripetizione con token valido in seconda sessione. Se uno solo passa indebitamente, il gate **FAIL**. Terzo e anon restano negati. Non creare false prove di abuso.

**Step 2.1-C — correzione e controprove (solo dopo A+B).**  
Preparare proposta minima e revisionabile: revoca atomica, controllo invio e visibilità delle chat, eventuale persistenza del blocco dopo verifica delle tabelle/colonne realmente esistenti, test di segnalazione senza dati veri. Nessun DDL impulsivo; query funzionali protette da ownership/RLS, controllo di `auth.uid()` dentro eventuali funzioni privilegiate, nessuna concessione a `anon` e nessuna escalation con `SECURITY DEFINER` non revisionato. Verificare i trigger concorrenti e tutti i percorsi di invio.

**Step 2.1-D — gate finale.**  
Conferma dell'utente nel browser, test positivo/negativo automatico, build verde, spiegazione dei dati conservati, compatibilità mobile, rollback verificabile. Soltanto dopo passare al Gate 2.2. Audit cloud separato e staging necessari prima di merge/deploy.

## 5. Stato e rollback

- **Ora:** analisi della baseline e preparazione della ricognizione read-only. Nessuna revoca reale eseguita, nessuna policy mutata.
- **Feature safety:** mantenere la PR #27 in bozza e il flag Alive soltanto locale. Stripe sospeso.
- **Rollback dello step A:** nessuno necessario sul database; lo script esegue solo SELECT di metadati. Per annullare i soli nuovi file Git utilizzare un commit di revert mirato nel branch, senza reset o force-push.
- **Mai** trattare un test statico/CI come prova di autorizzazione server-side: l'esito decisivo arriverà dal Docker LAB con i nuovi account sintetici.

**Prossima azione unica:** aggiornare il clone LAB con `git pull --ff-only`. Poi lanciare il preflight 2.1-A e leggere solo le righe di stato.


## 6. Checkpoint runtime 17 novembre 2026 — revoca like in Docker LAB

**Fonte:** risultati console PowerShell comunicati dal proprietario in data 17/11/2026. Il test non è stato eseguito sul cloud né nel browser. I nomi/identificativi sintetici non vengono registrati.

- **Prima della correzione:** \`PASS GATE21_LOCAL_PREFLIGHT\`, \`PASS GATE21_BEFORE_REVOCATION\`, \`PASS GATE21_LIKE_REVOKED\`, ma **FAIL** su \`CAN_OPEN_A_DENIED\`, \`CAN_OPEN_B_DENIED\`, \`SEND_A_DENIED\`, \`SEND_B_DENIED\`, \`HISTORY_A_DENIED\`, \`HISTORY_B_DENIED\`; \`FAIL GATE21_REVOCATION_E2E\`, \`PASS GATE21_CLEANUP\`. Il difetto era riproducibile nello schema semplificato del LAB.
- **Patch LAB applicata:** \`scripts/local-only/apply-gate21-unlike-guard-lab.ps1\` ha prodotto \`GATE21_LAB_PATCH_APPLIED=PASS\`. Crea trigger \`AFTER DELETE\` su \`public.likes\` che porta \`match_scores.score\` a 0 nella medesima transazione e restringe la policy SELECT \`messaggi_read_participants\` al match attivo. Non elimina i messaggi, non aggiunge colonne/tabelle. Questa patch è **solo nello stack Docker locale**, non in una migration di produzione.
- **Controprova dopo la patch:** \`PASS GATE21_LOCAL_PREFLIGHT\`, \`PASS GATE21_BEFORE_REVOCATION\`, \`PASS GATE21_LIKE_REVOKED\`, **PASS** di entrambi i \`CAN_OPEN_..._DENIED\`, entrambi i \`SEND_..._DENIED\` e entrambi gli \`HISTORY_..._DENIED\`; \`PASS GATE21_REVOCATION_E2E\`, \`PASS GATE21_CLEANUP\`, \`GATE21_PROCESS=PASS\`.
- **Ambito del PASS:** due nuovi utenti sintetici autenticati e richieste dirette alle API in Docker. Non prova revoca da UI, seconda sessione già aperta, concorrenza, Realtime dopo revoca, blocco permanente, pausa, richieste 😔, scuse, segnalazioni, conservazione conforme al GDPR o schema online.
- **Attenzione:** la revoca di un like **non equivale ancora alla specifica \`Chiudi il match\` definitiva**. Se nuovi like vengono inseriti, il trigger \`AFTER INSERT\` della baseline può riattivare lo score. Occorre progettare la persistenza del divieto di contatto prima di chiamare questa funzione \`Chiudi il match\`.
- **Rollback disponibile ma non ancora collaudato:** lo stesso script accetta \`-Rollback\`, esclusivamente nel LAB; non va eseguito per ora, perché rimuoverebbe la protezione sperimentale.

**Stato aggiornato:** Step 2.1-A PASS; 2.1-B difetto riprodotto; 2.1-C contromisura LAB con controprova API PASS; **Gate finale 2.1-D ancora APERTO**. PR #27 resta Draft, nessun merge/deploy, Supabase cloud e Stripe invariati.

**Successivo micro-passo:** audit e specifica testabile della differenza tra revoca like, pausa reversibile e chiusura definitiva, senza alterare lo schema né i dati reali.
