# AUP per DDQ — proposta da revisionare, non pubblicata

Baseline: `f8698ceb6e7861b31921893c7a7860669b175333` (main).
Verifica del 31 ottobre 2026. Nessun invio a Stripe, merge o deploy richiesto.

## Prove e lacune

- `src/pages/legal/Terms.jsx`: maggiore età già prevista; sezione 3 con soli tre obblighi generici; introduzione con testo provvisorio.
- Produzione: HTML pubblico e asset `index-u098jWag.js` → `application-WL9tTI5s.js` contengono lo stesso testo provvisorio e i tre obblighi generici. Nessuna AUP dedicata trovata nella ricerca pubblica o nel codice corrente. Questa verifica degli asset non equivale a un test visivo delle pagine.
- `src/pages/Contatti.jsx`: servizioclienti@lovematch360.com già pubblicato per supporto; ricezione e presidio non verificati.
- `src/pages/Sicurezza.jsx`: checkout e pagamenti dichiarati sospesi.
- `src/pages/legal/Privacy.jsx`: tratta segnalazioni e sicurezza, ma identificazione del titolare incompleta e conservazione generica.
- `src/pages/legal/Refunds.jsx`: ancora sintesi con testo provvisorio. Non modificata in questo intervento.
- `docs/billing-security-gates.md`: controlli età server-side, evidenze di accettazione e procedura di moderazione ancora da verificare. Non dichiararli operativi nel DDQ.

| Area | Integrazione preparata |
| --- | --- |
| Età e autenticità | 18+, divieto account di minori, profili falsi, impersonificazione e aggiramento sospensioni; autodichiarazione non presentata come identità certificata |
| Condotte | Molestie, discriminazione, stalking, minacce, ricatti, consenso e rispetto del rifiuto |
| Contenuti e sfruttamento | Divieto espliciti sessuali, immagini intime non consensuali, abusi su minori, tratta, escort e relazioni compensate |
| Frodi e sicurezza tecnica | Truffe sentimentali, spam, phishing, malware, scraping e accessi abusivi |
| Privacy e diritti | Doxxing, uso non autorizzato di immagini, dati e proprietà intellettuale |
| Segnalazioni | Email pubblica senza login, localizzazione del contenuto, motivazione, buona fede, dati minimi e cautele per materiale illecito |
| Interventi | Proporzionalità, gravità, reiterazione, misure cautelative, motivazione e riesame, diritti di legge e rimborsi preservati |

## Implementazione

`AupPolicy.jsx` è l'unica fonte delle regole. `Aup.jsx` le espone nella route pubblica HashRouter `/#/aup`; `Terms.jsx` include lo stesso componente nella sezione 3 e rinvia ad esso per sospensioni e riesame. Footer, Contatti e Sicurezza espongono il collegamento. Nessuna variazione a registrazione, consensi memorizzati, ruoli, DB, API, configurazione Vercel o pagamenti.

L'identificativo AUP-2026-10-31 identifica questa revisione del testo, non una data di entrata in vigore già avvenuta. Prima del merge confermare data/versione e comunicazione delle modifiche agli iscritti; `legal_version: v2` nella registrazione non viene cambiato né qualificato come prova di accettazione della nuova AUP.

## Prima della pubblicazione e dell'uso nel DDQ

1. Confermare che la casella pubblica riceva messaggi e abbia un responsabile operativo; stabilire presa in carico, priorità minori/pericolo, motivazione, risposta e riesame, accesso limitato alle prove e conservazione. Nessuna email di prova è stata inviata.
2. Verificare che rimozioni, restrizioni e sospensioni siano effettivamente eseguibili e applicate sul server. Questa patch documentale non implementa moderazione, blocco utenti o verifica dell'età.
3. Far verificare dal gestore e da un professionista competente la coerenza legale dei testi e gli obblighi applicabili. Riferimento per segnalazioni e motivazioni: Regolamento (UE) 2022/2065, artt. 14, 16 e 17: https://eur-lex.europa.eu/eli/reg/2022/2065/oj/ita . Non si dichiara conformità legale complessiva.
4. Prima della pubblicazione verificare da anonimo `/#/aup`, `/#/terms`, `/#/termini`, footer, Contatti e Sicurezza, refresh, tastiera e layout mobile. Dopo il deploy confermare URL effettivamente pubblico, versione e contatto funzionante prima di inserirli nel DDQ.
5. Nel DDQ distinguere policy pubblicata, procedure realmente presidiate e controlli ancora mancanti. Non dichiarare revisione preventiva, assistenza 24/7, verifica identità o moderazione automatica. La disponibilità della AUP non garantisce approvazione Stripe.

## Verifiche

- `npm run build`: riuscita.
- `npm test`: 91 test esistenti superati, inclusi i controlli sui pagamenti sospesi.
- `git diff --check`: superato.
- Rendering statico React di AUP e Termini: superato; link, identificativi unici e presenza del testo condiviso verificati.
- Ambiente di verifica Node 24.22.1; il progetto dichiara Node 22.x. Build da ripetere nella CI Node 22 prima del merge.
- Nessun test visivo/browser, nessun invio email e nessuna verifica runtime della moderazione o dei controlli età.

## Rollback

Finché la proposta non è unita: chiudere la PR senza merge; produzione invariata.
Dopo eventuale merge: revert della PR tramite GitHub e verifica dei link pubblici. Non occorrono rollback SQL o Stripe.
