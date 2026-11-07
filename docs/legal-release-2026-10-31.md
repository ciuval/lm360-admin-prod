# Documenti pubblici LoveMatch360 - proposta del 31 ottobre 2026

## Stato e ambito

Questa modifica prepara Termini e condizioni completi, Policy di utilizzo accettabile (AUP) e Protocollo per le richieste delle autorità. Il riferimento di partenza è `main` al commit `f8698ceb6e7861b31921893c7a7860669b175333` del repository `ciuval/lm360-admin-prod`.

Il codice e i testi sono una proposta per revisione. La loro presenza nel branch o in un'anteprima non significa che siano già pubblicati, accettati dagli utenti, approvati da Stripe o verificati da un professionista. Il rilascio richiede l'adozione reale delle procedure riportate qui sotto e la conferma delle informazioni del gestore. Non inviare il questionario Stripe dichiarando pubbliche pagine ancora soltanto in anteprima.

La modifica non attiva Premium, checkout o rinnovi, non modifica database, autorizzazioni o webhook e non invia documenti a Stripe. Le prove di pagamento con carte reali descritte dal gestore non vanno presentate come sole prove in sandbox o come assenza assoluta di transazioni.

## Contenuti e percorsi

La fonte unica dei testi è `src/content/legalDocuments.js`. Il renderer React è condiviso con il generatore delle copie HTML, per impedire divergenze fra ciò che legge l'utente e ciò che riceve un revisore.

| Documento | URL pubblico previsto dopo il rilascio | Percorso nell'app |
| --- | --- | --- |
| Termini e condizioni | `https://www.lovematch360.com/legal/termini` | `/#/termini` e `/#/terms` |
| Policy di utilizzo accettabile | `https://www.lovematch360.com/legal/uso-accettabile` | `/#/uso-accettabile` |
| Protocollo richieste delle autorità | `https://www.lovematch360.com/legal/richieste-autorita` | `/#/richieste-autorita` |

Le copie in `public/legal/` contengono il testo intero, senza richiedere login, script o risorse esterne. `vercel.json` assegna esplicitamente i tre URL prima del fallback dell'app. L'indicazione `noindex, follow` conserva l'impostazione prudente del sito: la reperibilità tramite motore di ricerca è distinta dall'accessibilità pubblica tramite URL diretto. Le route e i redirect di `/libro` restano presenti.

I testi descrivono le funzioni riscontrate nel codice: profili, interessi reciproci e chat; maggiore età autodichiarata; nuovi acquisti Premium sospesi. Non dichiarano verifiche documentali dell'identità, moderazione continua, bot di controllo, un pulsante di segnalazione o un portale di disdetta non riscontrati.

## Conferme necessarie prima di pubblicare

1. **Gestore e dati professionali.** Confermare che Valeriu Ciubotaru sia la corretta controparte del servizio e che il recapito già presente nella dashboard Stripe possa essere usato per le comunicazioni legali pubbliche. Verificare con un consulente la qualifica professionale, gli obblighi informativi e gli eventuali dati fiscali richiesti. Non inventare una ragione sociale, partita IVA o iscrizione. L'assenza di nuovi acquisti non sostituisce questa verifica.
2. **Caselle e presidio.** Verificare ricezione e invio di `servizioclienti@lovematch360.com` e `info@lovematch360.com`, proteggere gli accessi e assegnare una persona responsabile della lettura e delle risposte. La presenza degli indirizzi nel codice non prova che siano operativi. Eseguire eventuali messaggi di prova solo con autorizzazione del gestore. Stabilire controlli regolari coerenti con i termini legali, senza promettere reperibilità continua.
3. **Italiano e inglese.** Il punto di contatto per le autorità accetta italiano e inglese. Il gestore deve poter comprendere e gestire le richieste, anche con assistenza linguistica o professionale appropriata. Non trasferire documenti d'indagine o dati personali reali in strumenti pubblici di traduzione o AI senza averne valutato autorizzazione e protezione.
4. **Interventi effettivi.** Prima di promettere sospensione, rimozione o chiusura, provare su account sintetici l'effetto concreto delle operazioni disponibili. Definire chi può eseguirle e come confermarne l'esito. Le osservazioni tecniche sotto non attestano vulnerabilità della produzione: individuano verifiche ancora necessarie.
5. **Privacy e conservazione.** Riesaminare insieme Informativa Privacy, Cookie e Rimborsi, che non sono stati riscritti da questa modifica. Definire categorie di dati, finalità, basi giuridiche, fornitori, tempi o criteri di conservazione, richieste di cancellazione e misure effettive. Non inserire periodi arbitrari. Questi tre testi non attestano la conformità complessiva al GDPR.
6. **Adozione e utenti esistenti.** Approvare una data di efficacia, conservare la versione effettivamente pubblicata e comunicare le modifiche sostanziali agli utenti interessati. Valutare quando occorra una nuova accettazione. Il campo `legal_version` della registrazione registra la versione per i nuovi account; i metadati utente sono modificabili e non costituiscono una registrazione immutabile del consenso. Non presumere che gli utenti preesistenti abbiano accettato la nuova versione.
7. **Verifica giuridica mirata.** Far verificare le clausole e l'inquadramento del servizio, inclusi gli obblighi applicabili del DSA e delle prove elettroniche europee. Confermare eventuali destinatari designati, notifiche, sistemi di trasmissione e termini di legge. La casella ordinaria pubblicata non sostituisce gli adempimenti previsti da strumenti specifici.

## Procedura operativa per segnalazioni e riesame

Questa procedura deve essere adottata dal gestore prima che le dichiarazioni pubbliche sulla gestione delle segnalazioni siano effettive. Il codice non implementa un sistema di gestione dei casi.

1. **Ricezione.** Leggere la richiesta, assegnare un riferimento interno e annotare data, categoria, stato e persona responsabile in un archivio protetto. Conservare soltanto informazioni necessarie. Non usare repository, commenti GitHub o log tecnici per nomi, messaggi privati o prove sensibili.
2. **Urgenza.** Valutare subito rischi per minori, vita o sicurezza. Le richieste incomplete non giustificano l'ignorare un pericolo identificabile. Per un'emergenza immediata indirizzare ai servizi competenti; valutare gli obblighi di segnalazione alle autorità senza ritardi indebiti.
3. **Riscontro e identificazione.** Quando esiste un recapito, confermare la ricezione e chiedere solo gli elementi indispensabili mancanti. Individuare con precisione profilo, foto, messaggio o evento; non chiedere password, carte complete o documenti d'identità per una normale segnalazione. Non richiedere l'inoltro di materiale sessuale riguardante minori.
4. **Valutazione.** Esaminare elementi e contesto, regola eventualmente violata e diritti di tutte le persone coinvolte. Limitare l'accesso ai soli incaricati. Il riesame è umano; non attribuire la decisione a un sistema automatico inesistente.
5. **Decisione e misura.** Registrare motivazione, ambito e durata. Usare soltanto interventi autorizzati e proporzionati. Verificare che la misura abbia prodotto l'effetto desiderato, anche su sessioni già aperte. Non dichiarare un account integralmente bloccato sulla sola base di un'etichetta amministrativa.
6. **Comunicazione.** Fornire a segnalante e persona interessata i riscontri e le motivazioni dovuti, con indicazione del riesame, rispettando riservatezza e limiti legali. Non rivelare automaticamente l'identità del segnalante o messaggi estranei al caso.
7. **Riesame.** Ricevere gratuitamente le contestazioni via email, rivalutare ragioni ed elementi nuovi, correggere eventuali errori e comunicare l'esito. Annotare chi ha riesaminato e quando, senza inventare un secondo ufficio o un responsabile indipendente inesistente.
8. **Chiusura.** Registrare l'esito e il motivo della conservazione residua. Eliminare copie superflue e riesaminare vincoli e accessi secondo la politica effettivamente adottata e gli obblighi applicabili.

### Verifiche tecniche che rendono reale la procedura

- Nel codice controllato, la visibilità di un destinatario dipende anche da `status_account`, mentre `RequireAuth` verifica principalmente la sessione. La catena di invio messaggi esaminata non prova che una sospensione impedisca ogni azione del mittente. Provare il blocco delle azioni pertinenti su due account di test e documentare il risultato; non cambiare policy o dati di produzione per dimostrarlo.
- La rimozione di una foto dalla galleria e l'aggiornamento di `profili.foto_url` non sono la stessa operazione. Verificare galleria, immagine di copertina, riferimenti alternativi e oggetto in storage, secondo il provvedimento e gli obblighi di conservazione. Non considerare completata una rimozione perché la sola riga della galleria è scomparsa.
- Non è stato verificato un flusso automatico completo di cancellazione dell'account. La richiesta via email deve avere una procedura concreta che distingua chiusura, eventuali contratti, dati e conservazioni dovute.
- Tutte queste prove devono usare account e contenuti sintetici in un ambiente adatto. Non usare dati reali degli utenti o addebiti con carte reali per il collaudo.

## Procedura operativa per richieste delle autorità

1. Registrare la ricezione e gli eventuali termini legali, con accesso limitato. Distinguere richiesta informativa, ordine di conservazione, produzione di dati e rimozione.
2. Verificare autorità e referente tramite un recapito istituzionale ricavato da fonte indipendente, non soltanto dal messaggio ricevuto. Evitare link di autenticazione o allegati sospetti.
3. Verificare atto, competenza, base giuridica, destinatario, ambito, categorie di dati e periodo. Chiedere chiarimenti quando necessario, senza ignorare scadenze o rimedi dello strumento applicabile. Coinvolgere assistenza legale qualificata in caso di dubbio.
4. Accertare quali dati esistano davvero e siano sotto il controllo del gestore. Preservare quelli oggetto di un valido ordine, con accessi e scadenze documentati. Conservazione e comunicazione sono decisioni distinte.
5. Per richieste estere, valutare lo strumento di cooperazione e, quando pertinenti, base del trattamento e condizioni di trasferimento previste dal GDPR. Non trattare una richiesta di un'autorità di un paese terzo come autorizzazione automatica.
6. Preparare soltanto i dati necessari e consentiti, verificare destinatario e canale sicuro e controllare l'assenza di dati estranei. Non effettuare esportazioni indiscriminate dell'intero database.
7. Comunicare secondo il canale previsto, annotare il contenuto trasmesso e informare l'utente quando richiesto o consentito, rispettando divieti validi e tutela delle persone.
8. Riesaminare conservazione, rinnovi e cessazione dei vincoli. Non promettere ricostruzioni di dati inesistenti, una conservazione perpetua o sistemi di intercettazione non disponibili.

## Prima di riprendere i nuovi acquisti

Questa proposta conserva gli acquisti sospesi. La loro riattivazione richiede un lavoro separato: informazioni professionali e fiscali complete; funzionalità e prezzo effettivi; imposte, durata, rinnovo e disdetta; recesso e rimborsi; conferma del contratto; gestione server dei diritti e webhook; verifica delle sessioni di pagamento e degli abbonamenti eventualmente esistenti.

Per i contratti conclusi tramite interfaccia online, verificare la funzione di recesso introdotta dalla direttiva (UE) 2023/2673 e la normativa nazionale applicabile dal 19 giugno 2026. Non confondere questa funzione con la sola cessazione del rinnovo. Implementare le modalità dovute prima di aprire gli acquisti. Riprendere le prove in sandbox, senza usare carte reali come collaudo tecnico.

Restano applicabili i controlli già documentati in `docs/billing-security-gates.md`. La revisione di Stripe è distinta sia dalla funzionalità dei pagamenti sia dalle verifiche normative del servizio.

## Verifica tecnica e rilascio

Usare Node 22.x, come richiesto dal progetto. Eseguire dalla cartella del repository anche su PowerShell:

```powershell
npm ci
npm test
npm run build
npm run check:legal
git diff --check
```

`prebuild` rigenera le tre copie HTML. Dopo una modifica a testi o CSS, includere nel commit anche le copie aggiornate. `check:legal` segnala copie assenti o diverse dalla fonte condivisa.

Prima di pubblicare, verificare in anteprima da visitatore non autenticato:

- I tre URL statici puliti, i redirect `.html` e con slash finale, e le route dell'app sopra elencate.
- Testi interi, link fra documenti, Privacy e Contatti; mailto, indice, focus da tastiera, leggibilità mobile e stampa.
- Assenza di richiesta di accesso alle pagine legali; registrazione, checkbox e link in nuova scheda; pagine di checkout ancora sospese.
- Funzionamento di `/libro` e delle route preesistenti interessate dai redirect.

Il server locale Vite serve i file `/legal/<nome>.html`; gli URL puliti e i relativi redirect dipendono dalle regole Vercel e vanno provati nell'anteprima distribuita. Il collaudo automatico del repository non equivale a una verifica delle caselle, delle procedure del gestore o delle impostazioni di produzione.

Confermare l'autorizzazione a pubblicare solo dopo aver reso disponibili diff, testi e risultati di verifica. Usare una PR dedicata e non mescolare la modifica con attivazione pagamenti o cambi al database. Per annullare il rilascio, ripristinare tramite un commit di revert la PR dedicata e verificare nuovamente percorsi e build: evitare reset distruttivi della cronologia o cambi manuali divergenti al solo HTML.

Dopo il rilascio, aprire i tre URL dal dominio pubblico senza autenticazione e verificare che mostrino la versione approvata. Soltanto allora fornire a Stripe i link richiesti, previa istruzione del gestore. La risposta di Stripe resta necessaria per chiarire se il questionario sia inviato o integrabile e come riprenderne la compilazione.

## Fonti principali consultate

Le fonti sono riferimento per la revisione; l'applicabilità concreta richiede la valutazione del servizio e dell'organizzazione effettivi. Verifica delle fonti: 31 ottobre 2026.

- [Regolamento (UE) 2022/2065, Digital Services Act](https://eur-lex.europa.eu/eli/reg/2022/2065/oj/ita): in particolare punti di contatto, condizioni d'uso, segnalazioni, motivazioni e obblighi relativi a minacce alla vita o alla sicurezza. Non tutte le sezioni si applicano indistintamente a ogni impresa.
- [Direttiva 2011/83/UE, testo consolidato al 27 settembre 2026](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02011L0083-20260927): informazioni precontrattuali, contratti a distanza e recesso.
- [Direttiva (UE) 2023/2673](https://eur-lex.europa.eu/eli/dir/2023/2673/oj?locale=it): funzione online di recesso e decorrenza delle disposizioni, da verificare con il recepimento nazionale.
- [Commissione europea, e-evidence](https://home-affairs.ec.europa.eu/policies/internal-security/cybercrime/e-evidence_en): quadro delle prove elettroniche applicabile dal 18 agosto 2026 e strumenti pertinenti.
- [EDPB, Guidelines 02/2024 on Article 48 GDPR, versione finale 2025](https://www.edpb.europa.eu/system/files/documents/2025-06/edpb_guidelines_202402_article48_v2_en.pdf): richieste di autorità di paesi terzi e condizioni del trattamento e trasferimento.
- [Stripe, Prohibited and Restricted Businesses](https://stripe.com/legal/restricted-businesses): servizi di incontri soggetti a valutazione e restrizioni; la pubblicazione delle policy non costituisce approvazione del conto.
- Il questionario Stripe mostrato dal gestore richiede Termini, AUP e protocollo autorità pubblicamente accessibili e contiene una dichiarazione specifica sui pagamenti per chat a crediti o per messaggio. Questa richiesta documentale non prova che ogni risposta sia già stata inviata o accettata.
