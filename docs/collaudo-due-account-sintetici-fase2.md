# LoveMatch360 — Fase 2: collaudo con due account sintetici

**Stato: harness locale preparato; test Auth/API reale NON ancora eseguito.** Nessun ambiente staging Supabase cloud esistente al 14/11/2026 (elenco dei branch di sviluppo vuoto). La PR #27 rimane draft.

## Perché il percorso non è ancora dichiarabile verde

- Le suite SQL V1/V2 superate in Docker simulano `auth.uid()` su Postgres, ma non eseguono la registrazione e il login reali con Supabase Auth.
- In produzione esistono `profili`, `profili_foto`, `likes`, `match_scores`, `messaggi`, ma `stanze_360` non è presente e mancano le RPC `lm360_get_public_profiles(uuid)`, `get_stanza_compatibility(uuid)`, `send_stanza_message(uuid,text)`. Non usare produzione per simulare il flusso.
- `supabase/migrations/20260911_stanza_360.sql` era incoerente col campo `messaggi.testo` e nel branch è stato corretto il riferimento `contenuto -> testo`; NON applicata al progetto principale.
- Il repository contiene solo una migrazione SQL (`20260911_stanza_360.sql`), **non un bootstrap completo dello schema esistente**. Eseguire `supabase start` direttamente su questo schema senza prepararne la baseline locale potrebbe fallire. Prima va resa riproducibile una copia **solo schema** (nessun dato o credenziale di produzione) e aggiunto l'hardening V1/V2 collaudato.
- `typing_status` usa `is_typing`, mentre la chat React legge/scrive `typing`. Inoltre la tabella non ha chiave univoca per coppia, quindi il realtime typing è **un blocco secondario distinto** da risolvere prima del collaudo UI completo.
- Le fotografie attuali sono salvate come `foto_url` e righe `profili_foto` in database (data URL), non come upload nell'API Supabase Storage: il test fotografa *il comportamento attuale*. Non dichiarare Storage collaudato.

## Harness preparato nel repository

- `scripts/e2e-two-accounts-local.mjs`: invoca **vere API locali** di Auth/PostgREST con due credenziali sintetiche separate e database temporaneo locale.
- `src/lib/localE2eSafety.js`: accetta solo `http://127.0.0.1:54321` oppure `http://localhost:54321`. Rifiuta esplicitamente qualsiasi endpoint cloud, indirizzo LAN o URL con credenziali.
- `tests/localE2eSafety.test.js`: verifica in CI guardie e copertura dei passi. `npm test` non esegue MAI richieste esterne.
- `npm run test:e2e:local`: comando **manuale** distinto dai test automatici.
- Registrazione A/B, conferma amministrativa **solo locale** se richiesta, login separati, profilo nome/bio/interessi, foto sintetica 1×1, consenso opt-in/revoca, scoperta filtrata, primo like, tentativo di impersonazione e falsificazione di match (negati), like reciproco, match 100, Stanza 360 completa per entrambi, invio messaggio dopo accesso, lettura da B, divieto lettura anonima e cleanup degli utenti locali.
- Le credenziali, gli UUID e il testo dei messaggi non sono stampati.

## Come eseguire, quando la baseline locale sarà pronta

1. Usare la **copia locale di prova**, mai il progetto online. La stack ufficiale richiede Supabase CLI e Docker Desktop.
2. In una cartella di test dedicata preparare la baseline delle tabelle esistenti e le migrazioni corrette (schema soltanto, senza dati personali), poi avviare `npx supabase start` (solo dopo aver verificato le dipendenze con `npx supabase --help`).
3. Recuperare da `npx supabase status` le credenziali **locali** e impostare in una sessione PowerShell non condivisa:
   - `LM360_LOCAL_SUPABASE_URL` = `http://127.0.0.1:54321`
   - `LM360_LOCAL_SUPABASE_ANON_KEY` = chiave anon/publishable **locale**
   - `LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY` = chiave amministrativa **locale** (solo per la conferma e pulizia dei due account sintetici)
4. Nel checkout della PR #27 eseguire `npm run test:e2e:local`, senza mai pubblicare i valori delle variabili. Il test interrompe la procedura con `FAIL fase ...` al primo contratto violato; nessun falso `PASS`.
5. Dopo la prova rimuovere le variabili di ambiente e fermare/reset­tare **soltanto** lo stack Supabase locale. La procedura esegue già la cancellazione dei soli due account sintetici creati; se il cleanup fallisce usare il reset locale documentato, non il database remoto.

**Importante:** la conferma amministrativa del test non dimostra che l'email di conferma funzioni. Per verificarla eseguire una prova separata con il Mailpit locale (`http://127.0.0.1:54324`) e `auth.email.enable_confirmations = true`; le email rimangono nel computer.

## Esiti da annotare

| Prova | Stato |
|---|---|
| SQL isolato con 3 identità A/B/C (fixture V1/V2) | PASS già riportato dall'utente |
| Preflight schema e RPC locali | Da eseguire dopo bootstrap |
| Auth A/B e profili/foto | Non eseguito |
| Consenso opt-in, revoca e discovery | Non eseguito su vere API |
| Like reciproco, match e Stanza 360 | Non eseguito su vere API |
| Messaggi letti e negazione anon | Non eseguito su vere API |
| Browser desktop/mobile, email Mailpit e realtime | Non eseguito |

## Criteri di uscita / rollback

Un eventuale esito verde di `npm test` non basta: occorrono `PASS` del test con vere API locali, prove RLS negative e prova browser con identità sintetiche. Se un controllo fallisce, la PR non deve essere distribuita. Rollback attuale: revert dei commit sul branch, nessuna modifica al progetto online. Nessun nuovo checkout, Stripe immutato.

Fonti tecniche: [Supabase local development](https://supabase.com/docs/guides/local-development), [Test auth flows / Mailpit](https://supabase.com/docs/guides/auth/testing-auth-flows).
