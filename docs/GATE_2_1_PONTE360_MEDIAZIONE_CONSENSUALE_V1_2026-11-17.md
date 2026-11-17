# LoveMatch360 — Ponte360 · terzo soggetto neutrale (proposta V1)

**Data:** 17 novembre 2026  
**Stato:** proposta di laboratorio. **Non implementata**; non esiste alcun account Ponte360 creato da questa specifica.  
**Collegamento:** `docs/GATE_2_1_STATI_PAUSA_RIPRESA_SCUSE_CHIUSURA_V1_2026-11-17.md` e Gate 2.1-D ancora aperto.

## 1. Intuizione di prodotto

Un terzo soggetto neutrale può aiutare due persone adulte a ritrovare il dialogo dopo un litigio, **soltanto se entrambe lo desiderano**. Non deve decidere chi ha ragione, convincere qualcuno a restare o negoziare il consenso al posto suo.

**Nome di lavoro:** `Ponte360` — alias riconoscibile, dichiaratamente dedicato alla mediazione. La sua presenza non deve essere nascosta o confusa con un profilo di dating reale.

**Per la prima prova nel Docker LAB:** account sintetico `Ponte360 Test` indipendente da Andrea e Bianca, con ruolo utente ordinario e nessun privilegio admin/service_role. Il terzo account serve a testare *prima* che un estraneo non legga nulla; non dà accesso ai messaggi A/B.

**Per il prodotto reale:** definire prima se la mediazione sarà guidata da una persona verificata oppure da un assistente AI esplicitamente dichiarato. Non fingere che un'AI sia una persona o che l'alias rappresenti un essere umano che non esiste. Se AI, una funzione di servizio controllata può essere più appropriata di un finto account Auth.

## 2. Invito e consenso

1. Andrea o Bianca vede `Proponi Ponte360` soltanto quando le protezioni consentono un segnale. Non è un nuovo percorso per forzare il contatto.
2. **Entrambe le persone devono confermare separatamente**: «Accetto di partecipare a una conversazione guidata con Ponte360». Nessun consenso predefinito o dedotto dal match.
3. In una **pausa** disposta da Andrea, Bianca può proporre Ponte360 **solo come alternativa all'unico gesto** già previsto per quell'episodio: 😔, scuse *oppure* invito Ponte360, mai una sequenza di tre contatti. Andrea può ignorare, rifiutare o accettare. Una richiesta respinta/ignorata non si ripete nello stesso episodio.
4. Anche dopo l'accettazione dell'invito, nessun intervento è avviato finché entrambi non confermano la partecipazione e le condizioni di privacy.
5. L'esperienza è sempre volontaria e interrompibile unilateralmente. Un rifiuto o un'uscita ferma la stanza mediata e le notifiche associate.
6. Con match `CLOSED` o `BLOCKED`, Ponte360 **non può invitare, ricevere inviti per riaprire, inoltrare scuse, notificare o aggirare il divieto di contatto**.

## 3. Confini della stanza mediata

- **Due spazi separati:** la chat privata Andrea/Bianca rimane indipendente; la stanza Ponte360 contiene soltanto ciò che i partecipanti decidono di comunicare **dentro la stanza**. Nessun import automatico di cronologia, audio, foto, profilo privato, segnalazioni o motivi del litigio.
- Il terzo account parte da **zero diritti** sulle righe `messaggi`, `match_scores`, `stanze_360` della coppia, e non ottiene permessi generali su di esse.
- Se la mediazione ha un assistente AI, esplicitare il suo ruolo prima del consenso; raccogliere il minimo necessario, senza dedurre colpe, manipolare o usare la conversazione per profilazione commerciale.
- **Nessun messaggio diretto a uno solo dei due** da parte di Ponte360: niente recapiti esterni, contatto fuori piattaforma o richieste di denaro.
- Il percorso facilita il confronto: «Cosa vorresti che l'altra persona capisse?», «Quale limite desideri rispettare?», «C'è qualcosa che preferisci non condividere?». Non decide compatibilità, fedeltà o responsabilità.
- Se emergono minacce, coercizione, persecuzione o rischi di abuso: **non sollecitare riconciliazione**; dare priorità a blocco, segnalazione, uscita e risorse di supporto adeguate.

## 4. Modello tecnico da validare, non ancora implementato

- Identità del mediatore: terzo `auth.uid()` per il test sintetico; non deve essere elevato a `service_role`, `admin` o proprietario di righe appartenenti ad Andrea/Bianca.
- **Solo dopo consenso bilaterale verificabile lato server**: uno spazio di interazione separato, con autorizzazione per partecipanti specifici, scopo limitato e revoca immediata.
- Controllare esplicitamente appartenenza della persona richiedente, idempotenza e rate limit degli inviti; non usare soltanto `TO authenticated` come policy.
- Non aggiungere ora colonne, tabelle, trigger, RPC, route, account permanenti o privilegi. L'audit read-only del modello di stato del LAB è la dipendenza immediata.
- La sola revoca di like oggi collaudata non basta per attivare la stanza mediata: mancano persistenza della pausa, chiusura definitiva e contratti di consenso.
- I dati della mediazione, se in futuro conservati, richiedono una valutazione privacy/GDPR specifica, separazione dalla chat, controllo di accesso, conservazione definita e procedure di cancellazione/limitazione lecite.

## 5. Test negativi da aggiungere prima della funzione

| ID | Scenario con Andrea, Bianca e `Ponte360 Test` | Atteso |
| --- | --- | --- |
| M01 | Terzo account tenta SELECT messaggi, match e stanza privata A/B senza consenso | **Negato** |
| M02 | Solo Andrea accetta; Bianca non risponde | Nessuna stanza mediata, nessun accesso a dati condivisi |
| M03 | Andrea e Bianca accettano; Ponte360 prova a leggere la vecchia chat privata | **Negato** |
| M04 | Entrambi accettano; scambiano soltanto contenuti scelti nella stanza mediata | Accesso limitato ai partecipanti autorizzati di quella stanza |
| M05 | Andrea revoca il consenso durante la mediazione | Invii/letture della stanza mediata bloccati secondo policy; nessuna prosecuzione forzata |
| M06 | Bianca aveva già usato il gesto 😔 nello stesso episodio di pausa | Invito Ponte360 negato; non aggira il limite |
| M07 | `CLOSED` oppure `BLOCKED` | Nessun invito e nessuna nuova comunicazione |
| M08 | Terzo account tenta di alzare `match_scores`, cambiare una pausa o inviare una scusa per conto altrui | **Negato** |
| M09 | Un partecipante segnala pressione o comportamento abusivo | Nessun automatismo di riconciliazione, possibilità di uscita e tutela |
| M10 | Test conclude con cleanup dei soli account sintetici temporanei | PASS, nessuna alterazione degli utenti esistenti |

## 6. Stato e micro-passo

- **Già verificato in LAB:** revoca del like con negazione delle RPC e della cronologia ai due membri della coppia (Gate 2.1-C).
- **Non verificato:** creazione di Ponte360, consenso bilaterale, stanza mediata, chiusura persistente o comportamento UI.
- **Prima attività:** eseguire `scripts/local-only/check-gate21-state-model-readonly.ps1` nel LAB aggiornato e leggere soltanto i flag di metadati. Non creare ancora il terzo account, non allargare RLS e non usare Supabase cloud.
- **Ambito:** PR #27 Draft. Nessun deploy, Stripe sospeso, produzione invariata.

**Principio:** un mediatore può offrire un ponte, ma non può attraversarlo al posto di nessuno.


## 7. Checkpoint privacy Ponte360 — 17/11/2026

**Evidenza:** output PowerShell del proprietario, eseguito nel Docker Supabase \`LM360_FASE2_LAB\` tramite \`scripts/local-only/check-third-account-privacy.ps1\`, dopo sincronizzazione del branch a \`33273ab\`. Il test temporaneo di terzo account, precedentemente denominato Carlo, ora usa **\`Ponte360 Test\`** come alias sintetico.

Esito riportato:
- \`ANON_DB_GUARD=PASS\`, \`ANON_DENIED_HTTP=401\` con gateway e privilegi/RLS locali verificati.
- \`PASS account anonimo: accesso ai messaggi negato\`.
- \`PASS terzo account sintetico autenticato e profilo proprio leggibile\`.
- \`PASS terzo account: lettura globale, per ID e per coppia negate\`.
- \`PASS terzo account: match, Stanza 360 e profili riservati non visibili\`.
- \`PASS terzo account: stanza e invio negati; conversazione originale intatta\`.
- \`PASS privacy RLS/IDOR: 3 account nel Supabase locale\`.
- \`CLEANUP solo account C locale: PASS\`; \`COLLAUDO PRIVACY LOCALE SUPERATO\`.

**Interpretazione:** **M01 PASS nei limiti del test locale** (assenza di accesso del terzo a chat/match/stanza A/B), **M10 PASS** (account C temporaneo eliminato, A/B invariati secondo i controlli). L'invio via RPC del terzo è negato. Non certifica M02–M09, né tutte le possibili vie di modifica dei match, né alcuna funzione di mediazione. Nessun consenso bilaterale è stato acquisito o simulato. Il PASS non equivale a verifica dello schema cloud.

**Stato effettivo:** Ponte360 Test era un account di prova temporaneo ed è stato eliminato: **non esiste ora un mediatore autorizzato**. Le sezioni precedenti del documento descrivono il piano prima di questa prova. PR #27 ancora Draft; niente deploy, Stripe o produzione.

**Prossimo passo:** progettare in modo testabile il consenso esplicito e separato dei due partecipanti, con revoca indipendente e stanza mediata distinta dalla chat. Non aggiungere ancora tabelle/colonne o permessi al DB: completare prima il modello di autorizzazione e le prove negative.
