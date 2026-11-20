# LoveMatch360 — Audit navigazione e percorsi (14 novembre 2026)

**Ambito**: applicazione React/Vite/HashRouter nel repository `ciuval/lm360-admin-prod`, branch `integration/quality-gate-20261112`. **Non è un certificato di funzionamento live**. La landing separata `www.lovematch360.com` non è sotto questo repository e richiede una verifica distinta.

## Obiettivo utente

Chi arriva, anche senza account, deve trovare subito **incontri, come funziona, idee, libro, servizi web, FAQ, sicurezza e contatti**. La registrazione non deve essere il primo ostacolo alla scoperta. La funzione futura **«Una conversazione che conta»** si colloca dopo il match e non viene presentata come già disponibile.

## Risultati statici e modifiche nel branch

- **58 route uniche** dichiarate da `src/App.jsx` (incluse pagine riservate, varianti URL e route con ID). La build Vite copre gli import delle schermate, ma da sola non dimostra la loro funzionalità nel browser.
- `src/pages/Home.jsx`: otto card con percorsi accessibili; ospite che sceglie incontri va all'onboarding pubblico; utente autenticato viene indirizzato a Scopri persone.
- `src/AppShell.jsx`: menu principale ordinato per compito (Home, Come funziona, Scopri persone, Idee e articoli, Libro, Servizi web, FAQ, Sicurezza, Match/Profilo se autenticato, Regia se admin). Pulsanti di registrazione e accesso per gli ospiti.
- Navigazione mobile orizzontale scorrevole, target di menu 44 px, focus visibile e comando tastiera «Vai al contenuto».
- `src/components/SiteFooter.jsx`: link amministrativi assenti per visitatori non autorizzati; login e registrazione visibili agli ospiti; contenuti editoriali «Messaggi da leggere» collocati tra le risorse, non confusi con la chat.
- `src/pages/LoginPage.jsx`, `RegisterPage.jsx`, `NotFound.jsx`: ritorno a Home e collegamenti informativi.
- `src/pages/MessaggiPage.jsx`: riparati caratteri errati (accenti italiani e romeni) presenti nel testo editoriale; nessun pagamento riattivato.
- `tests/siteNavigation.test.js`: controlla destinazioni, voci del menu, protezione link admin, ritorni da auth e 404, focus/mobile, integrità dei link e codifica dei testi.

## Verifiche pubbliche già riportate

- L'utente ha eseguito da PowerShell `Invoke-WebRequest` sui documenti `/legal/termini`, `/legal/uso-accettabile`, `/manifesto-sicurezza`: HTTP 200 e titolo HTML atteso.
- L'utente ha aperto FAQ e Sicurezza nel browser e confermato che entrambe si aprono correttamente.
- Questa verifica **non** dimostra automaticamente funzionamento di tutte le 58 route, stato delle pagine dinamiche, clic di ogni link, disponibilità delle immagini, form di login, caricamenti Supabase o correttezza delle API.
- L'accesso esterno tramite crawler alle route HashRouter non rende il contenuto JavaScript: non usare HTTP 200 del documento HTML come prova di ciascuna pagina React.

## Gate mancanti, prioritizzati

1. **Backend**: chiudere e testare in isolamento le migrazioni RLS/like/match/chat e l'API minima `lm360_get_public_profiles`. Al 14/11/2026 la RPC non era presente su Supabase produzione: l'integrazione della PR non deve essere distribuita ora.
2. **Browser E2E**: con identità sintetiche su staging, prova integrale: Home → Registrati → conferma email → Profilo → foto → consenso → Scopri → primo like → like reciproco → Match → Stanza → Chat. Testa revoca, sospensione e errori di rete.
3. **Navigazione pubblica**: prova desktop e mobile (375 px/768 px/desktop), Tab/Shift+Tab, focus, menu orizzontale, 404, Home, FAQ, Sicurezza, Libro, Servizi, Contatti, pagine legali; verifica in ogni pagina un percorso per tornare o continuare.
4. **Dominio separato www**: controllare dall'inizio del percorso `www.lovematch360.com` verso l'app e il ritorno alle informazioni pubbliche. Il repository della landing non è stato verificato in questo audit.
5. **Monitoraggio release**: confermare build, test automatici e preview della PR senza distribuire il branch o effettuare merge.

## Principi e rollback

- Nessuna modifica a `main`, database produzione o Stripe.
- Il branch è in bozza; eliminando i commit del miglioramento UX dal branch si ripristinano i componenti originali.
- Non considerare «perfettamente funzionante» l'intero sito finché il gate E2E non è completato con evidenza reale.
