# Ponte360 · Figlio maggiorenne, mamma e papà — Demo locale V1

**Data:** 17 novembre 2026. **Ambiente:** PR #27, branch \`integration/quality-gate-20261112\`, non pubblicata.  
**Stato:** demo interattiva di UX, non un servizio reale. **Nessun account creato o persistente. Nessuna connessione Supabase, chat o mediazione umana attiva.**

## Scopo

Un figlio **maggiorenne** desidera che mamma e papà tornino a parlarsi. Può inviare **una singola proposta** nel prototipo; non può conoscere le risposte riservate, scrivere per un genitore o partecipare al confronto. Ciascun genitore sceglie separatamente se aderire. La stanza simulata si apre solo con due consensi.

**Non è un obbligo di riunirsi.** È legittimo trovare accordi pratici pur restando separati, oppure fermarsi.

La funzione è esclusivamente per utenti adulti; un minore non deve essere incaricato di mediare tra i propri genitori. In presenza di paura, minacce, violenza o controllo coercitivo, non si avvia una mediazione congiunta.

## File del prototipo

- \`lab/ponte360-family/index.html\` — UI dark, accessibile da tastiera, ruoli simulati e informativa.
- \`lab/ponte360-family/app.mjs\` — componenti DOM e interazioni; contenuto statico inventato, nessun input di informazioni personali.
- \`lab/ponte360-family/policy.mjs\` — macchina a stati pura: un invito, due consensi, uscita, pausa, blocco, tutela.
- \`scripts/local-only/serve-ponte360-family-lab.mjs\` — server HTTP in sola lettura su \`127.0.0.1:5188\`, con CSP restrittiva e solo quattro path espliciti.
- \`tests/ponte360AdultSonLab.test.js\` — controlli automatici SON01–SON13.

## Come aprire nel Windows LAB

Da PowerShell:

\`\`\`powershell
node "I:\lm360-clean\LM360_FASE2_LAB\scripts\local-only\serve-ponte360-family-lab.mjs"
\`\`\`

Il terminale mostra \`PONTE360_FAMILY_LAB=http://127.0.0.1:5188/\`. Aprire in un browser locale:

\`\`\`text
http://127.0.0.1:5188/
\`\`\`

Nella prima vista premere **Proponi una volta un dialogo facoltativo**. Passare al ruolo **Mamma**, scegliere *Accetto*; passare al ruolo **Papà**, scegliere *Accetto*: soltanto allora appare la domanda guidata. Ciascuno può approvare un piccolo passo separatamente, oppure rifiutare, mettere in pausa, bloccare o terminare.

**Il cambio ruolo è solo una simulazione, non un login.** Chi prova la demo controlla tutte le schermate; quindi non inserire nomi veri, messaggi reali o dati riservati. L'app non memorizza dati né in browser né in server, non crea profili e non invia notifiche.

**Arresto e rollback:** premere \`Ctrl+C\` nel terminale del server; ricaricare la pagina azzera lo stato in memoria. Nessuna migration o file temporaneo da cancellare. Se una futura modifica al branch va annullata, fare un revert Git mirato, mai reset forzato di branch o database.

## Perché questa separazione

La versione locale permette di verificare il flusso UX senza coinvolgere persone reali e senza cambiare lo schema del dating. I due genitori **non devono mettersi like** né riaprire match sentimentali per partecipare a un eventuale percorso familiare.

L'eventuale funzione online richiederà un **modello di consenso persistente separato dalla chat**, identità verificate per ciascun adulto, protezione anti-impersonazione, storico non importabile, revisione privacy/GDPR, audit su abuso/coercizione, accessibilità e test di sicurezza. La demo **non** prova queste proprietà in un ambiente reale.

## Checkpoint tecnico del 17/11/2026

Il proprietario ha eseguito \`scripts/local-only/run-gate21-jwt-consent-local.ps1\` con output:

\`\`\`text
PASS JWT_AUTHENTICATED_SYNTHETIC_ACTORS
PASS JWT_FIXTURE_RPC_READY
PASS JWT_THIRD_PARTY_NO_CONSENT
PASS JWT_ONE_CONSENT_DENIED
PASS JWT_TWO_CONSENTS_ONLY_PARTICIPANTS
PASS JWT_CLOSED_BLOCKED_DENIED
PASS JWT_ANON_DENIED
PASS JWT_WITHDRAW_REVOKES_VALID_SESSIONS
PASS JWT_WITHDRAW_BY_EITHER_PARTICIPANT
GATE21_JWT_CLEANUP=PASS
GATE21_JWT_E2E=PASS
\`\`\`

Questi PASS si riferiscono alle RPC **temporanee della fixture Docker**, non alla demo famiglia (che usa solo JavaScript e nessun JWT), né al database online. La prova dimostra revoca possibile da ciascuno dei due utenti nella fixture, senza riutilizzo di precedenti consensi.

## Condizioni prima del rilascio pubblico

- Niente merge finché Gate 2.1-D non copre tutti i controlli di pausa, chiusura, RLS/IDOR, race e Realtime.
- Account genitoriali reali: **non ancora creati**. Non bastano bottoni che cambiano ruolo; servono autenticazione e autorizzazione effettive lato server.
- Figlio adulto: eventuale richiesta **una sola volta**, con tutela della privacy; nessun accesso alle risposte dei genitori e nessuna pressione a riunirsi.
- Minori: nessun account di mediazione o obbligo di aiutare i genitori a riconciliarsi.
- PR #27 Draft, niente deploy Vercel, niente Supabase cloud, Stripe sospeso.

**Principio:** il figlio può desiderare un ponte, ma sono i genitori a decidere se attraversarlo.
