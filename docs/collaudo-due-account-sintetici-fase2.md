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


## Stato browser — 15 novembre 2026

- **PASS effettivo browser locale**: Andrea Test in Chrome e Bianca Test in Edge hanno completato signup e accesso in sessioni indipendenti. Il guard sessione ora funziona dopo aggiunta della colonna di compatibilità solo LAB `profili.stripe_customer_id`.
- **PASS browser**: profili completi al 100% con immagini sintetiche, visibilità opt-in separata, entrambe le schede presenti in Scopri, due like inviati e UI «Like inviato».
- **BLOCCO browser**: entrando nella pagina Match da Bianca appare «Non riusciamo a mostrare i match in questo momento» anche dopo il secondo like. L'esistenza del match nella tabella non è ancora stata verificata in questa specifica sessione browser.
- **Causa verificata nel codice**: `src/pages/MatchDashboard.jsx` leggeva direttamente `profili` dell'altra persona, mentre la fixture RLS permette la lettura diretta solo del proprietario; zero righe diventavano un errore UI.
- **Correzione PR (non ancora provata nel browser)**: `src/lib/matchProfiles.js` combina `match_scores.score=100` con `lm360_get_public_profiles(p_profile_id)` per ciascuna controparte. Solo le proiezioni pubbliche consentite possono comparire. Nessuna modifica alla RLS o concessione di lettura sui profili privati.
- Test di regressione: match visibile, like unidirezionale, revoca visibilità, righe RPC incoerenti, errore RLS/RPC, duplicati e assenza sessione. GitHub Actions su `0e3d7cf`: **163 test superati, 0 falliti, build Vite riuscita**.
- **Da riprovare nel browser**: aggiornare la copia LAB con `git pull --ff-only`, ricaricare `/#/match` in Edge, controllare che il match Andrea–Bianca sia visualizzato e il link alla Stanza 360 sia presente. Se non compare, acquisire soltanto un codice d'errore non sensibile tramite diagnostica read-only locale.
- Stanza 360 e chat browser **non ancora verificate**. PR resta draft, nessuna modifica a main, sito online, Supabase produzione o Stripe.


## Browser — accesso Stanza 360 con due profili completi

- **15/11/2026: PASS apertura Stanza 360 dal browser locale.** Dopo il match reciproco verificato e il salvataggio delle due Stanze (5 qualità offerte + 5 cercate, imperfezioni facoltative), la schermata mostra «La porta si è aperta», compatibilità calcolata **100%** nello scenario con scelte sintetiche identiche, cinque qualità condivise e il CTA «Entra e scambia due parole».
- Lo screenshot dell'apertura mostra **Andrea Test** come sessione attiva (Chrome); questa evidenza certifica l'apertura da quel lato, non ancora l'apertura da Bianca/Edge.
- **Nota UI individuata:** compare «Tu e questa persona» anziché nome del partner, perché Stanza/Chat usavano una lettura diretta della tabella privata `profili`, nascosta dalla RLS ai non proprietari.
- Correzione preparata sul branch draft: `src/lib/partnerDisplayName.js` recupera unicamente il nome tramite `lm360_get_public_profiles(p_profile_id)` e fallback generico senza consenso. `src/pages/Stanza360Page.jsx` e `src/pages/ChatBox.jsx` la invocano **solo dopo** i gate preesistenti di match reciproco e compatibilità. Nessun permesso RLS allargato, nessun nuovo endpoint o accesso diretto a profili altrui.
- Test aggiunti in `tests/partnerDisplayName.test.js`: proiezione autorizzata, revoca/non disponibilità, errore RPC, non autenticato, gate mantenuti. GitHub Actions commit `89125fc`: **167 test verdi, 0 falliti, build Vite OK**.
- **DA COLLAUDARE nel browser dopo git pull**: nome partner, apertura della chat, invio/ricezione di un messaggio tra Chrome ed Edge, eventuali limiti realtime/typing. Non dichiarare chat/browser E2E superato prima della prova.
- Nessun dato cloud reale, nessun deploy, nessuna modifica a Stripe. PR draft.
