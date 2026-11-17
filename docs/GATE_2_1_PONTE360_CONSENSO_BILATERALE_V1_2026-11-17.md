# LoveMatch360 — Ponte360 · Contratto di consenso bilaterale V1

**Data:** 17 novembre 2026  
**Ambiente:** PR #27 in bozza, Docker `LM360_FASE2_LAB`.  
**Stato:** specifica di comportamento e test; **nessuna API, UI, tabella, colonna o policy implementata da questo documento**.

Riferimenti interni:
- `docs/GATE_2_1_PONTE360_MEDIAZIONE_CONSENSUALE_V1_2026-11-17.md`
- `docs/GATE_2_1_STATI_PAUSA_RIPRESA_SCUSE_CHIUSURA_V1_2026-11-17.md`
- `docs/GATE_2_1_CHIUSURA_MATCH_BLOCCO_SEGNALAZIONE_2026-11-17.md`

## 1. Decisione di prodotto

**Ponte360 è un invito a conversare in un luogo separato, non un diritto di accesso alla coppia.** Andrea e Bianca devono **accettare entrambi, personalmente e separatamente**, prima che il mediatore entri nella stanza. Un solo «sì» non basta.

Il gesto `Proponi Ponte360` **non equivale** al consenso per partecipare. L'invito non apre la stanza, non sblocca la chat e non concede letture a nessuno.

Il mediatore è presentato in modo trasparente:
- **LAB:** `Ponte360 Test`, account fittizio con credenziali temporanee e privilegi ordinari, distrutto al termine del collaudo; **non è un consulente attivo**.
- **Prodotto futuro:** identificare chiaramente se è un operatore umano verificato o un assistente AI dichiarato. Non presentare un'AI come persona reale, né creare un falso profilo di dating.

Il servizio non stabilisce chi ha ragione, non promette pace, non suggerisce il perdono come dovere e non è una terapia di coppia.

## 2. Stati separati dalla relazione

La relazione A/B mantiene i propri stati `ACTIVE`, `PAUSED_BY_A`, `PAUSED_BY_B`, `PAUSED_BY_BOTH`, `CLOSED`, `BLOCKED`.

La proposta Ponte360 ha **uno stato autonomo per quella coppia e per quell'episodio**:

| Stato mediazione | Condizione | Diritto del mediatore |
| --- | --- | --- |
| `NONE` | Nessun invito corrente | Nessuno |
| `INVITED` | Invito inviato, nessun consenso bilaterale | Nessuno |
| `ONE_CONSENT` | Esattamente una persona ha accettato esplicitamente | Nessuno |
| `BOTH_CONSENTED` | Due conferme distinte, valide e ancora revocabili | Può essere autorizzata **solo** una stanza nuova, isolata |
| `IN_SESSION` | Stanza nuova attivata con controlli server superati | Solo contenuti inseriti appositamente nella stanza mediata |
| `ENDED` | Rifiuto, ritiro del consenso, fine della sessione, blocco o chiusura | Nessun nuovo invio o lettura attiva |

`INVITED` non è consenso; `ONE_CONSENT` non autorizza l'apertura. `BOTH_CONSENTED` non ripristina `ACTIVE` nella chat privata. La fine della mediazione non cancella necessariamente i dati già visualizzati: conservazione e accessi successivi richiedono policy specifiche.

**Precedenza assoluta:** `BLOCKED` / `CLOSED` annullano inviti e mediazione anche se entrambi avevano accettato in precedenza. Una pausa blocca la chat privata; una mediazione separata può esistere durante la pausa **solo con due consensi espliciti attuali**. La pausa rimane tale dopo la mediazione finché il suo autore non la revoca.

## 3. Invito senza pressione

1. `Proponi Ponte360` è disponibile soltanto a un partecipante A/B autenticato quando lo stato della relazione lo permette. Ponte360 **non** invita autonomamente la coppia.
2. Quando A ha messo in pausa, B può usare **una sola volta per l'episodio** un gesto tra: `😔 Chiedi di riprendere`, `Ho sbagliato. Scusa.` oppure `Proponi Ponte360`. Inviare uno esclude gli altri nello stesso episodio; nessun cambio di schermata, retry o nuovo login azzera il limite.
3. L'invito non contiene testi liberi né l'intera cronologia della chat. A riceve una sola notifica discreta, senza solleciti o scadenze coercitive.
4. Il destinatario può scegliere `Valuta la proposta`, `Non desidero partecipare` o non rispondere. Non esiste un «sì» preselezionato.
5. L'invito, anche se ricevuto positivamente, richiede **due conferme ulteriori e separate** sulle condizioni della stanza: entrambi devono premere personalmente `Accetto di partecipare`.
6. `Non desidero partecipare` e mancata risposta **non** autorizzano altri inviti nel medesimo episodio di pausa. Nessuna punizione, colpa o pressione commerciale.
7. `Chiudi il match`, `Blocca` e un account non più autorizzato annullano invito e sessione; nessun gestore, mediatore o altro account può intervenire per eludere il divieto.
8. Un invito nato con relazione `ACTIVE` rimane subordinato agli stessi controlli e non rende facoltativo il consenso di uno dei due.

## 4. Consenso informato: cosa vede ogni persona

Prima della conferma, mostrare in linguaggio comprensibile:

- **Chi** media: operatore umano verificato oppure AI dichiarata; identità/funzione chiara.
- **A cosa** si acconsente: partecipare a una stanza nuova con Andrea, Bianca e Ponte360.
- **Quali dati** saranno visibili: soltanto ciò che viene scritto o condiviso volontariamente nella stanza nuova; **mai** import automatico della chat privata, foto, note, segnalazioni o profili riservati.
- **Come interrompere**: `Esci dalla mediazione` sempre disponibile; il ritiro di una sola persona interrompe il canale di entrambi e del mediatore.
- **Conservazione e tutela**: non promettere cancellazione retroattiva di messaggi già visualizzati; definire informativa, tempi di conservazione, accessi di sicurezza e diritti prima del rilascio.
- **Nessuna conseguenza**: rifiutare non riduce funzionalità essenziali, visibilità o dignità; niente paywall per accettare/rifiutare.

Testo UI proposto:
> «Ponte360 è uno spazio facoltativo per ritrovare il dialogo. Si apre solo se entrambi accettate. La chat privata non viene condivisa. Puoi interrompere in qualsiasi momento.»

Azioni: `Accetto di partecipare` / `Non desidero partecipare`. Le due conferme devono provenire da **due sessioni autenticabili distinte** dei partecipanti effettivi, mai da un amministratore o dal mediatore.

## 5. Invarianti di sicurezza lato server (requisiti, non implementazione)

**I1 — Ownership:** un'autorizzazione valida per A può essere concessa solo da A tramite identità verificata dal server. B non può confermare per A; Ponte360 non può confermare per nessuno. Non fidarsi di `user_id` passato dal client o di `user_metadata` modificabili.

**I2 — Due consensi attuali:** l'operazione `open_mediation` deve verificare, in modo atomico, che A e B abbiano accettato **la medesima istanza** e che nessuno abbia ritirato l'assenso. Un consenso precedente non si riusa per un nuovo episodio.

**I3 — Separazione dei dati:** il mediatore non riceve `SELECT` generale su `public.messaggi`, `match_scores`, `stanze_360`, `profili` o altre risorse private. La stanza mediata ha una propria autorizzazione per i tre partecipanti specifici. Il precedente `M01` privacy PASS deve rimanere PASS.

**I4 — Revoca effettiva:** un solo ritiro, anche con una sessione già aperta o una chiamata API diretta, deve bloccare nuovi invii e accessi attivi alla stanza. Nessuna conferma di ritiro se la transazione non è andata a buon fine. I client chiudono i canali Realtime interessati dopo la revoca, ma la protezione decisiva è backend.

**I5 — Anti-aggiramento:** `CLOSED` / `BLOCKED` prevalgono sempre; un like ripetuto, un retry, un invito nuovo o un token ancora valido non riaprono il contatto. L'invito Ponte360 con pausa consuma lo stesso limite dell'unico gesto.

**I6 — Concorrenza:** doppio click, due schede e richieste simultanee non devono produrre due inviti, due notifiche, autorizzazioni orfane o una sessione aperta dopo il ritiro. Idempotenza delle richieste e controllo transazionale del consenso.

**I7 — Privacy:** niente email, UUID, token, contenuti della chat o motivazioni del litigio nei log e negli analytics. Tracciare soltanto stati tecnici aggregati privi di identificativi.

**I8 — Consenso e minori:** accesso riservato ad adulti secondo la politica del servizio. Non trattare un'autodichiarazione in metadati modificabili come prova sufficiente per autorizzare azioni sensibili.

**I9 — Ruolo mediatore:** l'account Ponte360 non ha privilegi admin o `service_role`. Qualunque futura funzione privilegiata richiede revisione specifica di `auth.uid()`, `GRANT`, `RLS` e audit. Nessun bypass della chat privata.

## 6. Tabella di collaudo prevista, SOLO DOCKER LAB

| ID | Scenario | Esito atteso |
| --- | --- | --- |
| B01 | Andrea invita, Bianca non risponde | `INVITED`, nessuna stanza o lettura per il mediatore |
| B02 | Andrea ha accettato, Bianca no | `ONE_CONSENT`, accessi negati |
| B03 | Bianca tenta di confermare il consenso di Andrea | Operazione negata |
| B04 | Entrambi confermano la stessa istanza | `BOTH_CONSENTED`, stanza nuova autorizzabile dopo controllo dello stato |
| B05 | Ponte360 tenta di leggere messaggi precedenti anche con entrambi consenzienti | Accesso negato |
| B06 | Andrea revoca mentre Bianca e Ponte360 hanno la stanza aperta | Nuovi invii/letture attive negati a tutti |
| B07 | Andrea mette in pausa, Bianca invia 😔 e poi invita Ponte360 | Seconda richiesta negata |
| B08 | Bianca invia un invito Ponte360 durante la pausa e lo ripete da altra scheda | Solo prima richiesta accettata, nessuna notifica ulteriore |
| B09 | Andrea rifiuta o ignora l'invito | Nessuna apertura, nessuna pressione |
| B10 | Match chiuso o persona bloccata prima/durante l'invito | Invito e sessione disabilitati; nessun nuovo contatto |
| B11 | Le due persone partecipano a Ponte360 mentre la chat privata è in pausa | Stanza separata consentita, chat privata ancora bloccata |
| B12 | Ponte360 tenta di modificare match, pausa o consensi | Negato |
| B13 | Token valido ma sessione di mediazione ritirata; invio RPC diretto | Negato |
| B14 | Caduta rete durante conferma o ritiro | Stato non dichiarato come riuscito senza verifica server |
| B15 | Terzo/anon chiede accesso a stanza privata e nuova stanza mediata | Negato |
| B16 | Cleanup account sintetici temporanei | PASS, senza modifiche a Andrea/Bianca |

**Nessuno di questi test B01–B16 è ancora stato eseguito.** L'esito M01/M10 del test precedente conferma soltanto il blocco di accesso al terzo **prima** di qualsiasi consenso.

## 7. Vincolo di implementazione

L'audit di soli metadati del Docker (output comunicato il 17/11/2026) ha rilevato `MATCH_PAIR_COLUMNS_COMPLETE=YES`, `LIKE_PAIR_COLUMNS_COMPLETE=YES` e **zero indizi nominali** di strutture per pausa, chiusura, blocco e richieste. È un indizio, non prova dell'assenza di ogni logica.

**Non archiviare il consenso in `localStorage`, `match_scores.score`, `messaggi` o in un singolo flag condiviso.** Questi elementi non dimostrano separatamente chi abbia autorizzato, quando sia stato ritirato il consenso e se la stanza sia ancora accessibile. Non adattare la RLS solo per far passare i test.

Senza una persistenza server-side affidabile per coppia, istanza, consenso di A/B, consumo dell'unico gesto e revoca, questa funzione **rimane NON ATTIVABILE**. Il requisito potrebbe richiedere strutture dedicate: **nessuna nuova tabella o colonna è autorizzata né viene creata qui**. Prima serve una proposta minima e una verifica dello schema reale, poi un'approvazione esplicita e test locali.

## 8. Stato e prossima micro-azione

- **Confermato:** sincronizzazione del LAB al commit `a6dceca` riferita dal proprietario; prova privacy del terzo account sintetico `Ponte360 Test` PASS, cleanup PASS.
- **Definito oggi:** consenso bilaterale indipendente, invito non equiparato al consenso, revoca unilaterale, isolamento dei dati, test B01–B16.
- **Non implementato:** inviti, conferme, mediazione, gestione della pausa/chiusura definitiva, schema e API necessarie.
- **PR #27:** Draft; nessun merge/deploy, nessuna modifica al database locale o online, nessuna riattivazione Stripe.
- **Prossimo passo:** confrontare questa specifica con gli oggetti disponibili nel Docker e proporre il *minimo* modello persistente, **senza applicarlo finché non sia revisionato**.

**Principio:** un ponte esiste soltanto se entrambe le persone desiderano attraversarlo.
