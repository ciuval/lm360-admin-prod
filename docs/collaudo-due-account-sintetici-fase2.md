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


## Browser — apertura chat e verifica invio da Andrea

- **15/11/2026: PASS apertura chat locale** dal browser Chrome con Andrea Test, nome partner Bianca Test visualizzato, campo messaggio e pulsante di invio accessibili; match e compatibilità server-side verificati prima.
- **Esito invio ancora NON certificato**: screenshot mostrano testo digitato, poi viewport di chat vuota dopo il tentativo di invio. Dalle immagini non si può inferire se la RPC abbia committato il messaggio. Non ripetere l'invio fino alla verifica, per evitare duplicati.
- **Difetto frontend accertato nel codice**: dopo RPC positiva, `ChatBox.jsx` azzerava il composer senza rileggere `messaggi`; aspettava solo l'evento realtime e chiamava `scrollIntoView` su un elemento interno, con possibile scroll dell'intera pagina sotto l'header sticky.
- **Fix nel branch draft**, da verificare nel browser: ri-lettura server-side dei messaggi della sola coppia dopo conferma RPC, scroll limitato al riquadro chat, blocco di invii ripetuti durante l'operazione, deduplicazione tra refresh e realtime, messaggio di errore in caso di cronologia non disponibile senza suggerire un secondo invio. La RPC `send_stanza_message` e tutte le policy DB rimangono invariate.
- Test `tests/chatSendUi.test.js`, CI `40d9adc`: **171 test verdi, 0 falliti, build Vite OK**.
- **Prossima evidenza richiesta**: pull del branch nel LAB, Ctrl+R nella chat Andrea (prima di un nuovo invio) e screenshot della conversazione; se non si vede alcun messaggio, eseguire una SELECT read-only aggregata sul Docker LAB prima di scegliere il passo successivo.
- Da provare ancora la ricezione in Edge/Bianca, realtime e typing. PR draft; non modificati produzione, cloud Supabase o Stripe.


## Conclusione collaudo browser bidirezionale — 15 novembre 2026

**Esito del percorso core: PASS in laboratorio locale, su due sessioni browser reali e due account sintetici.** Le prove visive condivise dal proprietario confermano:

1. Registrazione/login indipendenti in Chrome (Andrea) ed Edge (Bianca).
2. Profilo e foto sintetici al 100% per entrambi; consenso alla visibilità volontario, revocabile e separato; ognuno vede l'altro in Scopri solo dopo autorizzazione.
3. Like reciproci e match `score=100` confermati nel browser: indica reciprocità, non compatibilità sentimentale.
4. Due Stanze 360 compilate e salvate con cinque qualità offerte e cinque cercate; controllo di compatibilità sintetico 100%, porta aperta e link chat disponibile.
5. Primo messaggio sintetico **Andrea → Bianca** inviato via Chat, visibile dopo refresh nella sessione Andrea e ricevuto nella sessione Bianca.
6. Risposta sintetica **Bianca → Andrea**: screenshot della chat Bianca con entrambi i messaggi e screenshot della chat Andrea con entrambi, confermando lettura bidirezionale e persistenza della conversazione. Nessuna ripetizione del primo invio necessaria.

**Limiti del PASS**: la ricezione *senza refresh* tramite Realtime/typing non è stata isolata e non può essere considerata certificata dalle schermate; le policy RLS e gli schemi della produzione non sono identici alla baseline semplificata LAB, quindi il collaudo non autorizza deploy o attivazione dei pagamenti. Mancano ancora test browser mobile e verifica negativa con identità non autorizzata.

**Piccolo fix successivo sul branch draft**: in `src/pages/ChatBox.jsx` le date/ore ora specificano `it-IT`, per evitare la divergenza osservata tra Chrome (data americana `11/15/2026`) ed Edge (data italiana `15/11/2026`). Test aggiunto in `tests/chatSendUi.test.js`, da verificare in UI dopo pull; non altera messaggi, auth o RPC.

**Protezione ambienti**: nessun deploy, nessuna scrittura al database cloud o attivazione Stripe. PR #27 resta draft e viene conservata come evidenza e revisione prima di qualunque rilascio.


## Test Realtime senza reload — 15 novembre 2026

**Esito: NON SUPERATO / causa da diagnosticare.** Screenshot Edge con Bianca Test mostra il terzo messaggio sintetico «Test Realtime LoveMatch360» inviato alle 13:00 e presente nel proprio elenco; screenshot Chrome con Andrea Test, acquisito successivamente, mostra ancora soltanto i primi due messaggi. Non emerge alcun aggiornamento automatico nel browser ricevente. Non affermare che Realtime funzioni: persistenza e lettura dopo reload erano state verificate in precedenza ma non equivalgono a consegna live.

**Indizio verificato nello schema**: `scripts/local-only/20260910_lm360_core_lab.sql` contiene la nota «Realtime e typing non sono ancora coperti» e **non** include `public.messaggi` nella publication `supabase_realtime`. La subscription UI `ChatBox.jsx` per `postgres_changes` `INSERT` esiste. Occorre verificare la membership effettiva nel Docker locale: può mancare anche senza un errore nella chat. Non effettuare GRANT o ALTER alla cieca.

**Diagnosi preparata, sola lettura e isolata**: `scripts/local-only/check-fase2-realtime.ps1` verifica branch e porte Docker localhost, identità del database locale, publication, membership messaggi, RLS, ruolo authenticated, policy SELECT, servizio realtime. Emissione soltanto di flag, non chiavi, UUID, email o testi. Test `tests/localRealtimeDiagnostic.test.js` assicura assenza di SQL mutativo. Prima eseguire script nel PC LAB; soltanto se `MESSAGGI_PUBLISHED=NO` e RLS/SELECT risultano corretti, preparare fix **esclusivamente locale**, poi riprovare in due browser senza reload.

**Protezione**: nessuna modifica a SQL cloud, produzione o Stripe; PR #27 ancora draft. Per il momento non ripetere messaggi già inviati.

## Ripristino Realtime esclusivamente locale — publication messaggi

**Diagnosi reale confermata dall'utente, 15/11/2026**:

- `PUBLICATION=PRESENT`
- `MESSAGGI_PUBLISHED=NO`
- `MESSAGGI_RLS=ENABLED`
- `MESSAGGI_SELECT_GRANT=YES`
- `MESSAGGI_SELECT_POLICY=PRESENT`
- `REALTIME_CONTAINER=RUNNING`

Causa isolata: la publication `supabase_realtime` del LAB non include `public.messaggi`, quindi la subscription `postgres_changes` della chat non può ricevere gli INSERT. Vedere documentazione ufficiale Supabase Postgres Changes (29/10/2026): https://supabase.com/docs/guides/realtime/postgres-changes.

**Rimedio predisposto ma NON ancora eseguito sul PC dell'utente**: `scripts/local-only/enable-fase2-realtime.ps1` esegue solo `ALTER PUBLICATION supabase_realtime ADD TABLE public.messaggi` e solo sul Docker locale `LM360_FASE2_LAB`. Guardie: branch, `supabase/config.toml`, bind localhost, label container esatta, publication presente non-all-tables, RLS, grant SELECT autenticato, nessun grant SELECT anon, unica policy di lettura `messaggi_read_participants` limitata ai partecipanti. Se una guardia fallisce, la modifica viene rifiutata. È idempotente: ripetere non raddoppia la publication. Esegue post-check della membership prima di dire PASS. `-Rollback` esegue solo `ALTER PUBLICATION supabase_realtime DROP TABLE public.messaggi`, mantenendo dati e RLS. Nessuna migrazione di produzione o modifica dei dati.

**Test automatici di contratto**: `tests/localRealtimeEnable.test.js`; GitHub Actions commit `3bfa0e0`: **178 test PASS, 0 FAIL e build Vite OK**. La riuscita della modifica SQL locale non è ancora certificata finché l'utente non esegue lo script e mostra `MESSAGGI_PUBLISHED=YES`.

**Passo successivo dopo l'abilitazione**: ricaricare le due chat (per ricreare le subscription), lasciare Chrome/Andrea senza refresh, inviare un solo nuovo messaggio sintetico da Edge/Bianca, verificare se compare automaticamente e se il ricevente non autorizzato resta escluso. Il terzo messaggio già inviato NON va ripetuto.

**Limiti**: la publication include il tipo di evento per cui il client si iscrive; non sostituisce RLS. Nessun deploy o intervento sul Supabase cloud/Stripe; PR draft.


## Diagnostica browser Realtime — WebSocket 101

**15/11/2026, sessione Chrome/Andrea**: Chrome DevTools mostra una connessione WebSocket originata da `ChatBox.jsx` con stato HTTP **101** e un'altra del dev server Vite. Quindi il browser riesce a effettuare l'upgrade WebSocket, ma questo **non certifica** lo stato `SUBSCRIBED` del canale Postgres Changes, né la ricezione dei payload RLS filtrati.

**Scenario riprodotto dopo `MESSAGGI_PUBLISHED=YES`**: Edge/Bianca invia il quarto messaggio sintetico «Test Realtime 2» alle 21:15, visibile in Edge ma non in Chrome/Andrea senza refresh. Le letture dopo refresh continuano a funzionare. Nessun nuovo invio o modifica DB finché non sappiamo lo stato del canale.

**Diagnostica non invasiva**: in `ChatBox.jsx` ora è visibile un breve stato accessibile della subscription, aggiornato dal callback ufficiale `.subscribe((status) => ...)`: «Realtime: canale collegato (consegna da verificare)» per `SUBSCRIBED`, «Realtime: non disponibile» per `CHANNEL_ERROR`, `TIMED_OUT` o `CLOSED`, altrimenti «collegamento in corso». Non stampa eventi, messaggi, URI WebSocket, token o UUID. Quando SUBSCRIBED rilegge in modo autorizzato la cronologia per allineamento, ma non dichiara consegna push senza nuovo test. Il controllo del callback non modifica policy, tabelle o invii.

**Prossima prova**: `git pull --ff-only` nel LAB senza fermare il server, Ctrl+R solo per caricare la UI diagnostica nella chat di Chrome/Andrea; riferire soltanto la riga «Realtime: …», senza catturare il pannello Network o esporre chiavi. Nessun nuovo messaggio finché l'esito della subscription non è noto. PR #27 resta draft; nessun deploy/Stripe/cloud.


## Stato UI Realtime NON_DISPONIBILE — 15/11/2026

**Nuova evidenza browser**: Chrome/Andrea mostra direttamente sotto «Stanza con Bianca Test» il testo «Realtime: non disponibile. La cronologia resta consultabile.». Il callback `subscribe` ha quindi riportato almeno uno fra `CHANNEL_ERROR`, `TIMED_OUT`, `CLOSED`; la versione precedente della UI li aggregava, perciò non è possibile inferire quale dai soli screenshot. WebSocket 101, publication `MESSAGGI_PUBLISHED=YES`, WAL `logical`, 3/3 slot di replica logica attivi sono condizioni necessarie, ma non certificano la subscription al canale.

**Possibile artefatto del React.StrictMode**: `src/application.jsx` usa `React.StrictMode` che rimonta gli effetti in sviluppo. In `ChatBox.jsx` la sottoscrizione precedente può emettere `CLOSED` dopo cleanup e sovrascrivere in ritardo lo stato mostrato dalla nuova. Questa è una **ipotesi da verificare**, non una diagnosi confermata. Il callback Realtime ora ignora gli eventi di un effetto già smontato tramite flag `active` settato a false prima di `removeChannel`. Lo stesso controllo vale per i payload e l'indicatore typing. Senza scrivere payload/URI/chiavi in console, l'interfaccia visualizza lo stato terminale esatto fra `CHANNEL_ERROR`, `TIMED_OUT` e `CLOSED`; su `SUBSCRIBED` segnala «canale collegato (consegna da verificare)».

**Prossimo test UI**: `git -C 'I:\lm360-clean\LM360_FASE2_LAB' pull --ff-only`, poi un solo reload di Chrome/Andrea; riferire la riga «Realtime: ...», senza aprire Network e senza inviare messaggi. Il LAB Vite HMR potrebbe già mostrare l'aggiornamento dopo pull. Se `SUBSCRIBED`, test push bidirezionale da eseguire in seguito; se stato errore, esaminare status specifico e l'eventuale presenza della tabella `public.typing_status` in una diagnostica read-only. Nessun intervento su DB cloud, policy, Vercel o Stripe; PR #27 rimane draft.


## Realtime: sottoscrizione anonima rilevata — 15/11/2026

**Diagnosi read-only dal PC LAB (due sessioni Edge/Bianca e Chrome/Andrea):**

- `realtime.subscription` per `public.messaggi`: 2 righe totali.
- `claims_role = authenticated`: 1 riga.
- `claims_role = anon`: 1 riga.
- `supabase_realtime.pubinsert`: YES; WAL logical, 3/3 slot logici attivi; canali WebSocket riportano `SUBSCRIBED` in entrambe le chat.
- Ultimo messaggio sintetico «Test Realtime 3» inviato da Bianca non comparso in Chrome/Andrea senza refresh.

**Interpretazione**: la sottoscrizione anonima non dovrebbe poter leggere i messaggi con RLS; i conteggi non identificano da soli il browser coinvolto né escludono sottoscrizioni obsolete. Nessuna apertura dei privilegi `anon`, nessuna disattivazione RLS.

**Modifica FE da verificare nel LAB, non ancora confermata dal browser**: `src/pages/ChatBox.jsx` ora chiama `supabase.auth.getSession()` per ottenere la sessione attuale e verifica la corrispondenza dell'utente; `await supabase.realtime.setAuth(data.session.access_token)` avviene **prima** della creazione e sottoscrizione dei canali Postgres Changes. Il JWT rimane in memoria e non è loggato. Un listener `TOKEN_REFRESHED` aggiorna la credenziale Realtime e `SIGNED_OUT` chiude i canali; cleanup sicuro con React StrictMode. `tests/chatSendUi.test.js` verifica sequenza JWT-first, rinnovo sessione e logout. Migliorata anche la gestione del blocco audio di notifica per non interrompere conferma di lettura.

**GitHub CI (commit `11f99ce`)**: 183 test PASS, 0 FAIL e Vite build riuscita. Questo certifica test statici e build, **non** l'arrivo degli eventi dal Docker reale.

**Prossimo collaudo**: `git pull --ff-only` nel clone LAB, aggiornare *entrambi* i browser una sola volta dopo il pull. Nuova lettura read-only di `realtime.subscription` aggregata per `claims_role` (senza esporre JWT, claims o UUID). Il risultato atteso, se entrambe le sottoscrizioni correnti sono attive, è `authenticated|2`, `anon|0`; un conteggio diverso richiede nuova diagnosi, non modifica delle policy. Solo dopo prova push **senza refresh**, una volta per direzione. Nessun deploy, Supabase cloud o Stripe modificato. PR #27 ancora draft.


## Realtime live Bianca → Andrea — PASS browser 15/11/2026

**Evidenza screenshot user fornita dopo il test esplicitamente eseguito senza refresh**: in Chrome/Andrea, con stato `Realtime: canale collegato (consegna da verificare)`, è comparso il quinto messaggio sintetico «Test Realtime 4 — Verifica finale della ricezione automatica.» inviato da Edge/Bianca alle 22:06. Nella schermata precedente Chrome non aveva ancora tale messaggio. Pertanto **Bianca → Andrea, Realtime live: PASS** secondo il protocollo senza `Ctrl+R` indicato all'utente. Non è un test automatico strumentato: evidenza browser fornita dal proprietario.

Prima di questo test, la verifica locale read-only di `realtime.subscription` ha restituito `authenticated|2`, senza `anon` per `public.messaggi`, a seguito del fix che applica il JWT di sessione al canale prima della sottoscrizione. RLS rimasta attiva; nessuna concessione al ruolo anon. L'intera prova è circoscritta al Supabase e Vite locali.

**Ancora da collaudare**: push live **Andrea → Bianca** senza reload. Dopo il suo PASS, considerare E2E Realtime bidirezionale completato nel LAB, non l'intera app pronta alla produzione; restano test negativi di autorizzazione, mobile, sicurezza e produzione. PR #27 draft, Stripe inattivo, nessun deploy.


## Chiusura del collaudo Realtime bidirezionale — 15/11/2026

**Esito: PASS nel laboratorio locale, con evidenza browser reale in entrambe le direzioni.**

- **Bianca → Andrea: PASS.** Screenshot in Chrome/Andrea: «Test Realtime 4 — Verifica finale della ricezione automatica.» compare alle **22:06** dopo l'invio in Edge/Bianca, nel test condotto senza refresh della pagina ricevente.
- **Andrea → Bianca: PASS.** Screenshot in Edge/Bianca: «Test Realtime 5 — Bianca, mi ricevi senza aggiornare la pagina?» compare alle **22:09** dopo l'invio da Chrome/Andrea, nel test condotto senza refresh della pagina ricevente.
- Entrambe le chat riportano `Realtime: canale collegato`; la verifica tecnica read-only precedente aveva restituito `authenticated|2` per le sottoscrizioni `public.messaggi` (nessuna `anon`). La modifica `supabase.realtime.setAuth(session.access_token)` prima della sottoscrizione ha superato la prova manuale. Non è stata indebolita la RLS.
- Il percorso core completo E2E locale è dunque verificato nel browser: **signup sintetico indipendente → profili e foto → consenso visibilità → scoperta → like reciproci → match → Stanza 360 → chat persistente → consegna Realtime bidirezionale**.

**Portata del PASS:** test manuale end-to-end su due browser e due account sintetici, non test automatico di carico/disconnessione. Le precedenti sezioni che indicano Realtime come *ancora da collaudare* descrivono lo stato storico prima di questa prova; il risultato aggiornato è **PASS bidirezionale in LAB**.

**Vincoli ancora aperti prima di qualsiasi rilascio**: test negativi RLS/IDOR con terzo account e utente anonimo, verifica revoca/chiusura match e sessione, resilienza disconnessioni, esperienza mobile/accessibilità, confronto schema cloud e documentazione sicurezza. La PR #27 resta **draft**; non autorizza deploy né attivazione di Stripe. Nessun cambiamento a Vercel, Supabase online o dati reali.
