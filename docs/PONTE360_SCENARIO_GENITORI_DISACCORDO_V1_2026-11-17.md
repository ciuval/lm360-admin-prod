# Ponte360 — Scenario V1: quando mamma e papà non vanno d'accordo

**Data:** 17 novembre 2026  
**Tipo:** simulazione di prodotto e criteri di sicurezza per due adulti; **non un caso reale** né una funzionalità attiva.  
**Ambiente:** PR #27 Draft; nessuna modifica a Supabase, alle route, ai dati o alla produzione.

## 1. Obiettivo umano

Aiutare due genitori in disaccordo a comunicare con maggiore rispetto. Il risultato positivo **non deve coincidere necessariamente con la riconciliazione sentimentale**: può essere anche un modo più tranquillo di collaborare come genitori, oppure la decisione di mantenere una distanza sicura.

Ponte360 non decide chi abbia ragione, non assegna colpe, non costringe a perdonare e non sostituisce un mediatore familiare qualificato, uno psicologo o un servizio di protezione.

**I figli non fanno da mediatori:** niente account creati per minori, niente pressioni perché riferiscano messaggi o prendano posizione, niente raccolta di racconti privati dei figli nella stanza ordinaria. Se un bambino è coinvolto nel conflitto, il suo interesse e la sua sicurezza vengono prima del desiderio degli adulti di riavvicinarsi.

## 2. Simulazione: due adulti in una situazione non violenta

Persone sintetiche: **Mamma** e **Papà**. Nessun minore partecipa alla conversazione.

**Situazione dichiarata:** litigano sulla distribuzione degli impegni familiari. Entrambi vogliono provare un confronto e non dichiarano paura, minacce, coercizione o violenza.

1. Mamma propone Ponte360. **La proposta è soltanto un invito**; Papà può ignorarla o rifiutarla senza solleciti. Il servizio non apre automaticamente nessuna stanza.
2. Mamma e Papà vedono separatamente scopo, limiti, identità del mediatore, privacy e diritto di uscire. Ognuno preme volontariamente **«Accetto di partecipare»**.
3. Ponte360 apre una **nuova stanza separata**. Non può leggere le precedenti chat né usare informazioni di uno contro l'altro.
4. Ponte360 chiede un turno a ciascuno, ad esempio: «Qual è una cosa concreta che ti pesa e che vorresti fosse compresa, senza accusare l'altra persona?»
5. **Mamma:** «Mi sento sopraffatta quando organizzo tutto da sola».  
   **Papà:** «Quando torniamo a parlarne, mi sento giudicato e smetto di ascoltare».
6. **Ponte360:** «Sento due difficoltà: la gestione pratica e il modo in cui ne parlate. C'è un impegno piccolo e verificabile che ciascuno desidera proporre, senza obblighi?»
7. Se entrambi lo scelgono, possono accordarsi **per esempio** su un momento settimanale di 15 minuti per organizzare gli impegni. Ponte360 **non** inventa né registra un accordo accettato da uno soltanto.
8. Entrambi possono scegliere **«Continua», «Metti in pausa» o «Esci dalla mediazione»**. Il ritiro di uno interrompe l'accesso attivo alla stanza per tutti. La chat privata, se già in pausa, **rimane in pausa**.

**Esito legittimo anche senza accordo:** «Non siamo pronti a parlarne». Nessun punteggio negativo, nessun messaggio che attribuisca la colpa e nessuna nuova pressione.

## 3. Quattro condizioni prima di offrire un confronto congiunto

| Condizione | Comportamento di Ponte360 |
| --- | --- |
| **Due adulti, entrambi consenzienti** | Si può proporre una stanza nuova e limitata allo scopo dichiarato |
| **Solo uno vuole parlare** | Nessuna stanza congiunta; si può offrire soltanto un supporto informativo individuale, senza inoltrare messaggi all'altro |
| **Match chiuso o persona bloccata** | Nessun invito, nessun recapito, nessuna richiesta di ripresa tramite mediatore |
| **Paura, minacce, violenza o controllo coercitivo** | Non facilitare la mediazione congiunta; consentire uscita discreta, blocco, segnalazione e indicazioni verso aiuti umani qualificati |

Il test non deve chiedere a una persona vulnerabile di dimostrare che il conflitto sia abbastanza grave. Un eventuale percorso di supporto individuale non deve comunicare all'altro che è stato richiesto, se questo può creare rischi.

## 4. Differenza rispetto alla coppia di dating

La coppia di genitori **potrebbe non avere un match romantico** o potrebbe essere separata. Non chiedere loro di scambiarsi like, riattivare `match_scores.score=100`, creare profili dating o dichiarare interesse sentimentale per accedere a una futura mediazione familiare.

**Conseguenza tecnica:** il modello `relationship_controls` + `mediation_invites` scritto per la relazione dating **non si estende automaticamente ai genitori**. Serve prima una specifica di spazio familiare separato con autorizzazioni proprie; non usare dati o permessi del circuito dating come scorciatoia.

Se la funzione verrà proposta ad adulti che si conoscono già, deve essere esplicitamente facoltativa, chiaramente separata dagli incontri e non dovrebbe presentare un assistente AI come mediatore umano accreditato.

## 5. Criteri di accettazione da simulare, non ancora eseguiti

| ID | Prova sintetica | Esito richiesto |
| --- | --- | --- |
| F01 | Solo Mamma accetta | Stanza non attivata; Papà non è contattato di nuovo |
| F02 | Entrambi accettano la medesima sessione | Stanza nuova e separata, senza importazione dello storico |
| F03 | Papà rifiuta, ignora o ritira il consenso | Nessun sollecito o ulteriore accesso |
| F04 | Mamma o Papà chiede pausa | Nessun nuovo messaggio di mediazione fino a nuova autorizzazione valida |
| F05 | Una persona segnala paura o coercizione | Percorso congiunto interrotto; uscita e sicurezza prioritarie |
| F06 | Ponte360 tenta di leggere chat private | Sempre negato, anche con due consensi alla stanza nuova |
| F07 | Una persona tenta di usare Ponte360 dopo blocco/chiusura | Negato |
| F08 | Si cerca di creare un account per un minore o usarlo come intermediario | Nessun percorso di mediazione ordinaria abilitato |
| F09 | I genitori sono separati, senza un match romantico | Nessun obbligo di like o ripresa del rapporto |
| F10 | Un partecipante propone un accordo non accettato dall'altro | Non presentarlo come patto di entrambi |
| F11 | Un account terzo tenta di confermare il consenso per un genitore | Negato |
| F12 | La stanza termina senza riconciliazione | Esito neutro, nessuna penalizzazione |

## 6. Scelta di avanzamento

**Ora:** salvare questa simulazione e i criteri di prova; **non creare account genitori o minori**, non aggiungere RLS o tabelle e non attivare una terza chat. I test F01–F12 **non sono stati eseguiti**.

**Prima di procedere:** completare Gate 2.1-D (pausa/chiusura definitiva e consenso bilaterale) con account adulti sintetici nel Docker LAB; poi progettare separatamente il caso familiare e valutarne sicurezza, privacy e necessità di operatori umani qualificati.

**Principio:** aiutare mamma e papà a comprendersi senza chiedere ai figli di portare il peso del loro conflitto.
