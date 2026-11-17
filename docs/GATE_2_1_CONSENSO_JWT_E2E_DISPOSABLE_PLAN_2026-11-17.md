# Gate 2.1 — Collaudo JWT reale del consenso Ponte360

**Data:** 17 novembre 2026. **Stato:** piano di prova; non implementato e **non autorizza** SQL persistente o modifiche a Supabase cloud. PR #27 Draft.

## 1. Baseline e perché serve una prova diversa

La simulazione JS F01–F12 è risultata **12 PASS / 0 FAIL** nel PC dell'utente. La simulazione psql con `BEGIN`/`ROLLBACK` è risultata **`GATE21_CONSENT_SQL_SIMULATION=PASS`**, `GATE21_LOCAL_SCHEMA_CLEAN=PASS`, `GATE21_CONSENT_AUTH_JWT_E2E=NOT_TESTED`, **in due esecuzioni**. Il laboratorio è stato sincronizzato fino al commit `3afff52`.

Il precedente test di privacy con account temporaneo Ponte360 e quello sulla revoca del like verificano già login JWT e RLS/RPC **per funzioni esistenti** nel LAB. Non sono però un test del **nuovo consenso bilaterale**: nessuna API `consent` persistente è attualmente esposta tramite PostgREST.

**Limite tecnico:** la prova psql simula `request.jwt.claim.sub` con `SET LOCAL`; la transazione non rende visibili a connessioni HTTP distinte le funzioni e le tabelle non ancora committate. Per il JWT E2E serve una fixture locale **temporaneamente committata**, con distruzione mirata e verifica di assenza degli oggetti, oppure un secondo stack Docker LAB interamente sacrificabile. Non chiamare una simulazione SQL «JWT E2E».

## 2. Scelta sicura per la prova (da approvare prima di eseguire)

**Preferenza:** un secondo stack Docker effimero, isolato da `LM360_FASE2_LAB`, con porte differenti e nessun accesso alla produzione. Prima verificare compatibilità con spazio disco, Docker e configurazione locale; se indisponibile, riprogettare senza compromettere Andrea/Bianca.

La fixture dovrebbe contenere **soltanto** due adulti sintetici A/B e un mediatore sintetico M, con identità create da GoTrue locale, credenziali casuali `@example.test`, client distinti, e oggetti di consenso separati dalla chat. Nessuna lettura di `profili`, `messaggi`, `likes`, `match_scores` di utenti esistenti.

Nello stack sacrificabile:
- Esporre il **minimo** di RPC di prova al ruolo `authenticated`, con `auth.uid()` controllato sul server; nessun accesso diretto al contenitore dei consensi, nessuna esecuzione `anon`.
- Verificare proprietà/privilegi delle funzioni `SECURITY DEFINER`, `search_path` ristretto, `GRANT EXECUTE` espliciti e cache API aggiornata; non copiare nel cloud.
- Richiedere due JWT realmente emessi dal server Auth, ottenuti con due login distinti. Non affidarsi a `user_metadata` o a un `user_id` indicato dal chiamante.
- Dopo ogni mutazione, verificare l'effetto con due client distinti e token ancora validi; un errore generico 401/404 non è un PASS di autorizzazione.
- Usare cleanup `finally`, eliminare soltanto oggetti/account creati dalla prova e verificare che la fixture non esista più. Se cleanup fallisce, **FAIL** e nessun `db reset` dello stack LAB principale.
- Non stampare email, UUID, password, JWT, chiavi, log del provider, motivi del conflitto o contenuti di chat. Esportare solo etichette PASS/FAIL.

## 3. Condizioni di accettazione del test reale

| ID | Azione attraverso API autenticata | Esito richiesto |
| --- | --- | --- |
| J01 | A accetta, B non accetta | Mediatore non può aprire né leggere |
| J02 | B tenta di accettare per A (inviando ID di A) | Vietato; consenso A invariato |
| J03 | A e B accettano separatamente la **stessa istanza** | Accesso alla sola stanza sintetica ammesso |
| J04 | M e un quarto estraneo tentano di accettare per A/B | Vietato |
| J05 | A ritira il consenso con il JWT A | Accesso negato ad A, B e M, anche con token esistente |
| J06 | B tenta di revocare **per A** | Vietato; può ritirare solo il proprio consenso |
| J07 | Sessione già chiusa o bloccata | Nuovo invito/consenso/accesso vietati |
| J08 | Account `anon` chiama le RPC | Vietato con controllo GRANT e server funzionante |
| J09 | Tutti i test terminano, compreso errore intenzionale | Fixture e account temporanei eliminati; nessuna traccia nello stack LAB principale |

**Il superamento di J01–J09 sarà un gate intermedio, non un'autorizzazione al rilascio.** Mancano comunque i test di concorrenza, Realtime, UI, gestione di conservazione e sicurezza dello schema cloud.

## 4. Punto di arresto corrente

Non creare ora nuove tabelle/colonne o permessi, né nello stack principale né nel cloud. Prima verificare se il PC può sostenere un secondo stack Docker o se occorre una soluzione più leggera; preparare separatamente la fixture con revisione statica e cleanup testato. Non avviare il JWT E2E con lo script SQL di rollback esistente: quel test è già concluso e non possiede un endpoint di consenso HTTP.

**Prossimo micro-passo:** eseguire il controllo in sola lettura dello stato Docker/risorse del PC e decidere se il secondo stack locale è praticabile. Nessuna modifica a `main`, produzione, Stripe o PR #27 Draft.
