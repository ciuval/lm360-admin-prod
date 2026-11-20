# Ponte360 — Andrea Test e Bianca Test dopo un litigio (demo locale)

**Data:** 17 novembre 2026  
**Scope:** `integration/quality-gate-20261112`, PR #27 Draft, **nessuna modifica a main, Vercel, Supabase cloud o Stripe**.  
**Stato:** demo UX offline; non è una funzione con accessi autenticati o mediatore operativo.

## Obiettivo

Provare se Andrea Test e Bianca Test desiderano invitare un terzo soggetto neutrale, dopo un disaccordo, senza permettergli di leggere conversazioni private, creare profili dating o ripristinare automaticamente il match.

**Non presupporre che Andrea e Bianca abbiano davvero litigato.** La demo simula una pausa scelta da una persona. Non legge la loro chat né analizza i messaggi per rilevare conflitti.

## Percorso

1. Nel ruolo di **Andrea Test**, simulare un litigio e mettere in pausa la chat privata.
2. Nel ruolo di **Bianca Test**, scegliere **Proponi Ponte360 (unico invito)**, senza una sequenza di solleciti.
3. Andrea vede l'invito, può accettare, rifiutare, bloccare o uscire; anche Bianca deve accettare separatamente.
4. Con **un consenso solo**, Ponte360 non può entrare. Con due sì, la demo apre soltanto una **stanza distinta** e può proporre domande neutrali.
5. Il ruolo **Ponte360 Test** è fittizio e dichiarato. Non è una persona verificata, non è un account Auth ed è inattivo prima del consenso bilaterale.
6. Andrea o Bianca possono ritirare il consenso in qualsiasi momento. Paura, blocco, chiusura e rifiuto impediscono l'intervento.

**Il terzo non riceve la cronologia `messaggi`, il punteggio `match_scores` o i dati privati di `profili`**. La chat preesistente resta in pausa nella simulazione; l'ingresso in Ponte360 non equivale al ripristino del rapporto.

## File

- `lab/ponte360-couple/index.html` — schermata dark, ruoli Andrea/Bianca/Ponte360.
- `lab/ponte360-couple/policy.mjs` — modello di consenso offline, invito unico e revoca.
- `lab/ponte360-couple/app.mjs` — interazioni DOM senza rete/storage e spunti predefiniti.
- `scripts/local-only/serve-ponte360-family-lab.mjs` — server HTTP limitato a `127.0.0.1:5188`, espone il percorso addizionale `/andrea-bianca/`.
- `tests/ponte360CoupleConflictLab.test.js` — 15 test statici/di logica C01–C15.

Il server locale va **riavviato** dopo il pull perché il processo Node già in esecuzione usa la precedente tabella dei percorsi.

## Esecuzione Windows

Dopo `git pull --ff-only` e interruzione del server vecchio con `Ctrl+C` nella relativa PowerShell:

```powershell
node "I:\lm360-clean\LM360_FASE2_LAB\scripts\local-only\serve-ponte360-family-lab.mjs"
```

Nel browser aprire manualmente:

```text
http://127.0.0.1:5188/andrea-bianca/
```

Provare un ruolo alla volta. **Non digitare dati personali:** i nomi sono esempi e la pagina non contiene account veri, ruoli Supabase o chat. La demo è volutamente utilizzabile da una sola persona che cambia ruolo; la privacy tra utenti reali non è dimostrata da questi pulsanti.

## Test già superati, distinti

Nel Docker LAB, in prove precedenti con account sintetici, sono stati riportati PASS per privacy del terzo (M01) e per il consenso e la revoca bilaterale via JWT, con pulizia della fixture. **Queste verifiche non abilitano ancora il mediatore nella chat autentica Andrea/Bianca.**

La demo C01–C15 controlla solo comportamento locale, senza JWT reale. Restano aperti: accessi di due account diversi, stato di pausa persistente server-side, invito unico, rifiuto e revoca transazionali, RLS stanza mediata, riconciliazione/chiusura, Realtime, GDPR, UX e prevenzione dell'abuso.

## Rollback

Premere `Ctrl+C` nella finestra del server. Lo stato del prototipo è solo in memoria: chiudere o ricaricare la pagina lo azzera. Nessun account è stato creato, nessun SQL applicato, nessuna migrazione o deploy. Per rimuovere il codice dalla PR, effettuare un revert mirato nel branch Draft; non resettare il database.

**Principio:** il terzo può creare le condizioni di un confronto, non imporre a qualcuno di continuare una relazione.
