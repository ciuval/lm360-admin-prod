# LoveMatch360 — Gate 2.1 · Stati della relazione V1

**Data:** 17 novembre 2026  
**Ambiente:** PR #27 in bozza; specifica testabile, **nessuna funzione ancora implementata**.  
**Scopo:** tradurre le decisioni UX su pausa, riconciliazione e fine del match in requisiti verificabili prima di cambiare lo schema o la UI.

> «Il consenso apre la porta. Chiunque può fermarsi. Chiedere scusa non obbliga a perdonare.»

## 1. Parole e comandi: non confondere le azioni

| Comando | Effetto richiesto |
| --- | --- |
| **Esci** (header) | Logout Supabase dell'account, **non** modifica la relazione. |
| **Torna ai match** (Stanza) | Navigazione: **non** modifica né sessione né relazione. |
| **Metti in pausa** | Decisione individuale, reversibile soltanto da chi l'ha attivata; nessun nuovo messaggio finché permane almeno una pausa. |
| **😔 Chiedi di riprendere** | Segnale unico, non una chat o una richiesta ripetibile; l'altra persona resta libera di ignorarlo o respingerlo. |
| **Ho sbagliato. Scusa.** | Scuse volontarie, **non** dichiarazione di colpa giuridica; nessun obbligo di risposta, perdono o ripresa. |
| **Chiudi il match** | Chiusura del rapporto digitale corrente su decisione di una sola persona, senza motivazione; non riapribile da vecchi like o da una richiesta. |
| **Blocca** | Divieto di ricontatto indipendente dal match; prevale su tutte le richieste di riconciliazione. |
| **Segnala** | Segnalazione separata, possibile anche dopo la chiusura, senza colpevolezza automatica. |

## 2. Macchina a stati: definizione funzionale

Lo stato effettivo è **di coppia**, ma la scelta di pausa appartiene **a ciascuna persona**. Non è sufficiente salvare un semplice `paused=true` condiviso.

| Stato logico | Invio nuovi messaggi | Chi può agire |
| --- | --- | --- |
| `ACTIVE` | A e B, soltanto se match reciproco, compatibilità e sicurezza validi | A o B possono mettere in pausa o chiudere |
| `PAUSED_BY_A` | Nessuno | Solo A può togliere la propria pausa; B può inviare **un solo** gesto consentito |
| `PAUSED_BY_B` | Nessuno | Solo B può togliere la propria pausa; A può inviare **un solo** gesto consentito |
| `PAUSED_BY_BOTH` | Nessuno | A revoca solo la propria pausa; B revoca solo la propria. La chat si riapre **solo** quando entrambe sono rimosse |
| `CLOSED` | Nessuno | Nessuna richiesta 😔 o scusa. L'eventuale nuova relazione richiede un percorso nuovo di consenso esplicito, non i vecchi like |
| `BLOCKED` | Nessuno | Nessun gesto o richiesta; serve una gestione distinta del blocco e delle eventuali segnalazioni |

La pausa non scade automaticamente dopo 24 ore, dopo logout o per inattività. L'utente non deve pagare per riprendere. L'errore di rete non equivale a conferma: lo stato va verificato sul server.

**Priorità delle condizioni:** blocco/chiusura > pausa di almeno una persona > normale gate compatibilità + match. L'UI non può rendere autorizzata un'azione vietata dall'API.

## 3. Pausa: diritti e richieste

- **A mette in pausa:** A vede «Riprendi la chat»; B vede «Questa persona ha bisogno di tempo». B non può togliere la pausa di A.
- B può scegliere **un solo gesto per questo episodio di pausa**: `😔 Chiedi di riprendere` **oppure** `Ho sbagliato. Scusa.`. Le scuse non devono essere pretese o suggerite come ammissione obbligatoria.
- A riceve al massimo una notifica discreta, senza contenuti di chat o solleciti, e può scegliere **«Riprendi la chat»** o **«Non ora»**. Ignorare equivale a non riaprire.
- **«Non ora»** non invia all'altra persona un giudizio morale; non abilita ulteriori richieste durante la stessa pausa. Nessun contatore emotivo, nessun richiamo automatico.
- L'eventuale riscontro **«Ho letto le tue scuse»** (se implementato) è **separato** da «Riprendi la chat»: riconoscere le scuse non sblocca nulla.
- Se entrambi hanno messo in pausa, ognuno può revocare solo la propria. Un gesto è possibile soltanto dopo aver revocato la propria pausa, se l'altra persona è ancora in pausa; sempre nel limite di un gesto per episodio.
- Ogni nuova pausa è un nuovo episodio **solo se** vi è stata una effettiva ripresa reciproca; non si può aggirare il limite alternando rapidamente richiesta/pausa.
- Le richieste non sono messaggi nella tabella chat e non vanno memorizzate in `messaggi` né in analytics con testo o identificativi personali.

## 4. Chiusura definitiva del match

- Richiede conferma neutrale esplicita. Nessuna domanda obbligatoria sul motivo e nessuna pressione a riaprire.
- Deve disattivare la relazione attiva per entrambi e impedire invio, lettura della chat attiva, URL diretto, RPC diretta e sessioni già aperte, anche dopo refresh.
- **Non basta eliminare un like o portare `score=0`**: il trigger di like reciproci può ricreare `score=100`; serve un divieto persistente del riutilizzo dei consensi precedenti, verificato lato server.
- Non cancellare automaticamente la cronologia: eventuali prove per segnalazioni e conservazione legittima sono gestite in un percorso ristretto e separato dalla chat attiva.
- Un blocco prevale su nuove iniziative di contatto, anche se l'altro dichiara di voler chiedere scusa.

## 5. Contratto tecnico da progettare prima dell'implementazione

1. **Audit schema reale e LAB:** verificare nomi, trigger, RLS, GRANT, firme RPC e conflitti di policy. Non assumere che il database cloud sia identico alla fixture Docker.
2. **Persistenza server-side:** rappresentare senza ambiguità pausa per partecipante, episodio/limite richieste e chiusura definitiva. Prima verificare se strutture esistenti bastano; **nessuna nuova colonna/tabella ora**.
3. **RPC autorizzate:** solo un partecipante autenticato può mettere/togliere la **propria** pausa, chiedere una ripresa una sola volta e chiudere il proprio match. Le funzioni verificano `auth.uid()`, stato account e blocco, sono idempotenti per retry e non permettono impersonazione.
4. **Gate di accesso:** `can_open_stanza`, `send_stanza_message`, SELECT/UPDATE `messaggi`, canali Realtime e letture visibili devono rispettare i medesimi stati. Una pagina nascosta non è una protezione.
5. **Concorrenza:** dopo conferma della pausa/chiusura non deve passare alcun nuovo invio (includere race request/submit, più schede, doppio click, riconnessione e token valido).
6. **UI accessibile:** stato leggibile senza colore, pulsanti veri con focus visibile, conferma chiusura, feedback `role=status/alert`, mobile e `prefers-reduced-motion`. Emojis non sono l'unico canale informativo.
7. **Privacy:** mai loggare email, UUID, token, payload, testo di scuse o messaggi; notifica minima. Politiche di conservazione da verificare prima del rilascio.

## 6. Criteri di accettazione nel Docker LAB

| ID | Scenario sintetico | Esito atteso |
| --- | --- | --- |
| P01 | A mette in pausa dopo match autorizzato | `send_stanza_message` negata per A e B |
| P02 | B tenta di revocare la pausa impostata da A | Negato |
| P03 | B invia 😔 una prima volta, poi ripete | Prima accettata come segnale; seconda negata senza nuova notifica |
| P04 | B sceglie scuse anziché 😔 | Una sola comunicazione; nessuna riapertura automatica |
| P05 | A seleziona «Non ora» o non risponde | Pausa invariata, nessun nuovo sollecito |
| P06 | A riprende, B non è in pausa | Chat torna disponibile solo se tutti gli altri gate sono validi |
| P07 | A e B entrambi in pausa; soltanto A riprende | Chat ancora bloccata |
| C01 | A chiude il match | Chat e RPC negate per A e B; storico non leggibile come chat attiva |
| C02 | Dopo chiusura, A/B ritentano i like reciproci | Non riaprono il match precedente |
| C03 | Una persona ha bloccato l'altra | Nessun segnale 😔, scusa o richiesta supera il blocco |
| C04 | Una sessione resta aperta mentre la coppia viene chiusa | Nessun nuovo invio/lettura autorizzata dopo conferma |
| S01 | Terzo account/anon prova a leggere o decidere sulla coppia | Negato |
| R01 | Errore API durante chiusura | Nessuna falsa conferma di successo, stato da rileggere |
| R02 | Cleanup account temporanei e rollback locale mirato | PASS, senza `db reset` e senza toccare produzione |

## 7. Stato del lavoro e prossimo passo

- **Fatti già provati:** revoca del singolo like nel Docker LAB, dopo patch sperimentale, nega `can_open_stanza`, invio RPC e SELECT storico per i due utenti sintetici; cleanup PASS (risultato comunicato il 17/11/2026).
- **Non provati:** pausa, gesto 😔, scuse, chiusura non riattivabile, blocco, segnalazione, race/sessioni già aperte e schema cloud.
- **Sicurezza rilascio:** PR #27 resta Draft. Niente merge, deploy, SQL online o riattivazione Stripe.
- **Prossima azione tecnica:** audit read-only delle strutture esistenti che potrebbero supportare lo stato persistente; progettare eventuale modifica DB **solo dopo** aver stabilito il contratto e i test. Nessuna modifica oggi a schema/React.

La possibilità di usare in futuro questa esperienza per coppie adulte già formate resta una **proposta di prodotto**, non una funzionalità implementata e non un incentivo a rientrare in relazioni coercitive o abusive.
