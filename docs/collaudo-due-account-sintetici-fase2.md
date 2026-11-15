# LoveMatch360 — Fase 2: collaudo con due account sintetici

**Stato al 15/11/2026: collaudo Auth/API locale con due account sintetici PASS, riferito dall'utente tramite output della CLI.** Nessun ambiente staging Supabase cloud attivo nell'ultimo controllo. La PR #27 rimane draft: test nel browser, realtime, e RLS della produzione ancora da verificare.

## Perché l'esito locale non autorizza ancora il rilascio

- Le suite SQL V1/V2 hanno simulato `auth.uid()` su PostgreSQL. Ora è stato inoltre superato il percorso locale **reale Auth/PostgREST/RPC** con due utenti sintetici, ma non ancora il browser.
- In produzione esistono `profili`, `profili_foto`, `likes`, `match_scores`, `messaggi`, ma `stanze_360` non è presente e mancano le RPC `lm360_get_public_profiles(uuid)`, `get_stanza_compatibility(uuid)`, `send_stanza_message(uuid,text)`. Non usare produzione per simulare il flusso.
- `supabase/migrations/20260911_stanza_360.sql` era incoerente col campo `messaggi.testo` e nel branch è stato corretto il riferimento `contenuto -> testo`; NON applicata al progetto principale.
- Il repository contiene la migrazione distribuibile `20260911_stanza_360.sql`, **non un bootstrap completo dello schema di produzione**. Per il test è stata aggiunta e applicata soltanto sul PC la baseline minima `scripts/local-only/20260910_lm360_core_lab.sql`, esclusa dai commit come migrazione distribuibile. Non equivale a verificare lo schema e le policy storiche della produzione.
- `typing_status` usa `is_typing`, mentre la chat React legge/scrive `typing`. Inoltre la tabella non ha chiave univoca per coppia, quindi il realtime typing è **un blocco secondario distinto** da risolvere prima del collaudo UI completo.
- Le fotografie attuali sono salvate come `foto_url` e righe `profili_foto` in database (data URL), non come upload nell'API Supabase Storage: il test fotografa *il comportamento attuale*. Non dichiarare Storage collaudato.

## Harness preparato nel repository

- `scripts/e2e-two-accounts-local.mjs`: invoca **vere API locali** di Auth/PostgREST con due credenziali sintetiche separate e database temporaneo locale.
- `src/lib/localE2eSafety.js`: accetta solo `http://127.0.0.1:54321` oppure `http://localhost:54321`. Rifiuta esplicitamente qualsiasi endpoint cloud, indirizzo LAN o URL con credenziali.
- `tests/localE2eSafety.test.js`: verifica in CI guardie e copertura dei passi. `npm test` non esegue MAI richieste esterne.
- `npm run test:e2e:local`: comando **manuale** distinto dai test automatici.
- Registrazione A/B, conferma amministrativa **solo locale** se richiesta, login separati, profilo nome/bio/interessi, foto sintetica 1×1, consenso opt-in/revoca, scoperta filtrata, primo like, tentativo di impersonazione e falsificazione di match (negati), like reciproco, match 100, Stanza 360 completa per entrambi, invio messaggio dopo accesso, lettura da B, divieto lettura anonima e cleanup degli utenti locali.
- Le credenziali, gli UUID e il testo dei messaggi non sono stampati.

## Procedura di ripetizione nel laboratorio

1. Usare esclusivamente `I:\\lm360-clean\\LM360_FASE2_LAB` con `supabase/config.toml` locale e baseline già applicata. Non collegare il progetto al cloud.
2. Docker Desktop: `Port binding behavior = Localhost only`. Verificare con `docker ps` che le porte pubblicate siano solo `127.0.0.1` o `::1`, non `0.0.0.0` o `[::]`.
3. In PowerShell nella copia LAB eseguire `& '.\\scripts\\local-only\\run-fase2-local.ps1'`. Lo script esegue `npm ci`, recupera le sole chiavi locali in memoria da `supabase status -o env`, lancia `npm run test:e2e:local` e ripulisce le variabili di ambiente.
4. Il test stampa soltanto i codici PASS/FAIL dei passi; al termine cancella i due account di prova locali. Se il cleanup segnala FAIL, verificare e ripristinare **soltanto** lo stack locale.
5. Non diffondere l'output integrale di `supabase status`, chiavi, password o token. Per interrompere il laboratorio utilizzare `npx --yes supabase stop` dalla cartella LAB.

**Importante:** la conferma amministrativa del test non dimostra che l'email di conferma funzioni. Per verificarla eseguire una prova separata con il Mailpit locale (`http://127.0.0.1:54324`) e `auth.email.enable_confirmations = true`; le email rimangono nel computer.

## Esiti da annotare

| Prova | Stato |
|---|---|
| SQL isolato con 3 identità A/B/C (fixture V1/V2) | PASS già riportato dall'utente |
| Preflight schema e RPC locali | PASS — 6 tabelle e 3 funzioni (9/9) presenti, verifica lettura locale |
| Auth A/B e profili/foto | PASS — signup, login, profili, foto sintetiche (output utente) |
| Consenso opt-in, revoca e discovery | PASS — vere API locali (output utente) |
| Like reciproco, match e Stanza 360 | PASS — match reciproco 100, impersonazione e falsificazione negate (output utente) |
| Messaggi letti e negazione anon | PASS — lettura partner e accesso anonimo negato (output utente) |
| Pulizia account sintetici locali | PASS — cleanup confermato dallo script (output utente) |
| Browser desktop/mobile, email Mailpit e realtime | Non ancora eseguito |

## Criteri di uscita / rollback

Il test con vere API locali è **PASS**, inclusi vari controlli negativi. Mancano ancora prova browser con due utenti sintetici, realtime/typing, Mailpit e un audit RLS sull'ambiente effettivo di rilascio. Se un controllo fallisce, la PR non deve essere distribuita. Rollback attuale: revert dei commit sul branch, nessuna modifica al progetto online. Nessun nuovo checkout, Stripe immutato.

Fonti tecniche: [Supabase local development](https://supabase.com/docs/guides/local-development), [Test auth flows / Mailpit](https://supabase.com/docs/guides/auth/testing-auth-flows).
