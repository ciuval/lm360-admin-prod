import { Link } from "react-router-dom";

const sectionStyle = { marginTop: 24 };
const textStyle = { lineHeight: 1.75 };
const linkStyle = { color: "#ffd7ea", textDecoration: "underline" };

// Unica fonte delle regole: riusata nei Termini e nella pagina pubblica /aup.
export default function AupPolicy({ headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return (
    <div style={textStyle}>
      <p><strong>Acceptable Use Policy — versione AUP-2026-10-31.</strong></p>
      <p>
        Queste regole si applicano a profili, foto, bio, messaggi, link e a ogni
        interazione su LoveMatch360, comprese le aree professionali eventualmente
        disponibili. Integrano i <Link to="/terms" style={linkStyle}>Termini e Condizioni</Link>.
        Le funzioni utilizzabili dipendono dallo stato effettivo del servizio.
      </p>

      <section style={sectionStyle} aria-labelledby="aup-age">
        <Heading id="aup-age">Età minima e autenticità</Heading>
        <ul>
          <li>Il servizio è riservato a persone di almeno 18 anni. È vietato creare account per minori o aiutarli ad accedere.</li>
          <li>Fornisci informazioni veritiere sull’età e sulla tua identità. Sono vietati profili falsi, impersonificazione, uso non autorizzato di foto altrui e account creati per ingannare.</li>
          <li>Proteggi le credenziali; non accedere ad account altrui e non cedere o vendere l’account. Non aggirare sospensioni o limitazioni creando nuovi profili.</li>
        </ul>
        <p>La dichiarazione di maggiore età non certifica l’identità degli utenti. Segnala un sospetto account minorenne senza contattarlo per ottenere documenti o prove.</p>
      </section>

      <section style={sectionStyle} aria-labelledby="aup-conduct">
        <Heading id="aup-conduct">Rispetto, consenso e comportamenti vietati</Heading>
        <ul>
          <li>Sono vietati molestie, minacce, stalking, ricatti, estorsioni, bullismo, incitamento alla violenza e all’odio e attacchi discriminatori.</li>
          <li>Rispetta il rifiuto e i confini altrui: niente contatti insistenti, pressioni sessuali o tentativi di ricontatto dopo una richiesta di interrompere. Un like o un match non costituisce consenso sessuale né consenso a condividere dati o immagini.</li>
          <li>Sono vietati nudità esplicita, pornografia, atti sessuali e contenuti sessualmente espliciti, anche nei messaggi o attraverso link. Sono sempre vietati contenuti intimi non consensuali, manipolazioni sessuali dell’immagine di persone reali e minacce di diffonderli.</li>
          <li>Tolleranza zero per sfruttamento e abuso sessuale dei minori, materiale che li rappresenti o sessualizzi, adescamento, tratta e coercizione. Non caricare, richiedere o condividere tali contenuti.</li>
          <li>Sono vietati offerta, ricerca o promozione di prostituzione, escort, prestazioni sessuali a pagamento e relazioni condizionate a compensi o vantaggi economici (compreso il cosiddetto compensated o sugar dating).</li>
          <li>Sono vietati truffe sentimentali, richieste di denaro ingannevoli, phishing, schemi di investimento fraudolenti, vendita di beni o servizi illegali e attività contrarie alla legge.</li>
          <li>Non inviare spam, pubblicità o sollecitazioni commerciali non richieste; non usare profili e messaggi come catalogo o canale di vendita abusivo.</li>
          <li>Condividi solo contenuti che puoi legittimamente usare. Non pubblicare dati personali, recapiti, posizione, conversazioni o immagini di altri senza autorizzazione o altra valida base giuridica; sono vietati doxxing e violazioni della proprietà intellettuale.</li>
          <li>Non distribuire malware, estrarre in massa dati o profili, usare bot non autorizzati, compromettere il servizio o aggirare controlli di accesso e sicurezza.</li>
        </ul>
      </section>

      <section style={sectionStyle} aria-labelledby="aup-safety">
        <Heading id="aup-safety">Proteggi te e le altre persone</Heading>
        <p>Non inviare denaro a persone conosciute sulla piattaforma e non condividere password, codici di accesso, dati bancari o documenti in chat. Diffida di richieste urgenti e link sospetti. Per un incontro scegli un luogo pubblico e avvisa una persona fidata. Interrompi l’interazione se ti senti sotto pressione.</p>
        <p>Un profilo, un match o un abbonamento non garantiscono identità, affidabilità o sicurezza di una persona. Non è garantito il controllo preventivo di ogni contenuto o messaggio. Il supporto non è un servizio di emergenza: in caso di pericolo immediato contatta i servizi di emergenza locali.</p>
      </section>

      <section style={sectionStyle} aria-labelledby="aup-reports">
        <Heading id="aup-reports">Come segnalare un abuso o un contenuto illecito</Heading>
        <p>Chiunque, anche senza account, può scrivere a <a href="mailto:servizioclienti@lovematch360.com?subject=Segnalazione%20sicurezza%20LoveMatch360" style={linkStyle}>servizioclienti@lovematch360.com</a> con oggetto “Segnalazione sicurezza LoveMatch360”. Questo canale email non richiede un pulsante di segnalazione nell’app.</p>
        <ul>
          <li>Indica il link preciso o l’identificativo del profilo o contenuto; se non disponibile, descrivi dove trovarlo e la data e l’ora dell’episodio.</li>
          <li>Spiega i fatti e perché ritieni violata questa policy o perché il contenuto sarebbe illecito. Includi solo gli elementi necessari a individuare e valutare il problema.</li>
          <li>Fornisci un recapito email per la risposta e, per segnalazioni di contenuti illeciti, nome e cognome, salvo le eccezioni di legge a tutela di chi segnala abusi sessuali su minori.</li>
          <li>Conferma di ritenere in buona fede esatte e complete le informazioni fornite. Non usare le segnalazioni per intimidire o colpire altre persone.</li>
        </ul>
        <p>Non allegare materiale di abuso sessuale su minori e non scaricarlo né inoltrarlo. Per immagini intime o dati sensibili, descrivi il problema e la sua posizione senza duplicare il contenuto. Non inviare password, codici OTP, documenti di identità o dati bancari. Se occorrono ulteriori elementi, il supporto indicherà come procedere.</p>
        <p>La procedura prevede conferma di ricezione e comunicazione dell’esito al recapito disponibile, senza indebito ritardo e nel rispetto della riservatezza e dei limiti di legge. Non è garantita assistenza continuativa né un tempo fisso di risposta. Le segnalazioni sono valutate in base ai fatti e alla gravità, con priorità ai rischi per minori e all’incolumità delle persone.</p>
      </section>

      <section style={sectionStyle} aria-labelledby="aup-enforcement">
        <Heading id="aup-enforcement">Interventi, sospensione e riesame</Heading>
        <p>In caso di violazioni, LoveMatch360 può richiedere la correzione di contenuti, limitarne la visibilità o rimuoverli, limitare funzioni, sospendere temporaneamente o chiudere l’account. La misura tiene conto della gravità, del rischio, della reiterazione e delle informazioni disponibili; una segnalazione non comporta automaticamente una sanzione.</p>
        <p>Abusi gravi, sospetti fondati di accesso di minori, frodi o rischi immediati possono richiedere restrizioni cautelative senza preavviso. Negli altri casi può essere richiesto di correggere la condotta. Gli interventi sono effettuati nei limiti delle funzioni disponibili e degli obblighi applicabili, senza presumere sistemi automatici di moderazione.</p>
        <p>L’utente interessato riceve, nei limiti consentiti dalla legge e compatibilmente con la tutela delle persone e delle indagini, la motivazione, la misura adottata, la sua durata se determinata e le modalità per contestarla. Può chiedere un riesame rispondendo alla comunicazione o scrivendo all’assistenza, indicando account, decisione contestata e motivi. La richiesta è valutata alla luce degli elementi forniti; eventuali errori possono portare alla revisione della misura.</p>
        <p>Restano salvi i rimedi previsti dalla legge e gli eventuali obblighi di collaborazione con le autorità competenti. Una sospensione non comporta rinuncia ai diritti inderogabili né esclude automaticamente eventuali diritti di rimborso.</p>
      </section>

      <section style={sectionStyle} aria-labelledby="aup-privacy">
        <Heading id="aup-privacy">Dati personali e aggiornamenti</Heading>
        <p>Le informazioni nelle segnalazioni sono trattate per sicurezza, valutazione degli abusi e tutela dei diritti secondo l’<Link to="/privacy" style={linkStyle}>Informativa Privacy</Link>. La riservatezza è tutelata nei limiti di legge; non è promesso anonimato assoluto. Condividi solo dati pertinenti.</p>
        <p>La versione applicabile è quella pubblicata sul sito. Le modifiche sostanziali sono comunicate agli utenti interessati con modalità adeguate e nel rispetto degli obblighi applicabili. Questa policy non attiva servizi a pagamento e non modifica le condizioni di eventuali acquisti già effettuati.</p>
      </section>
    </div>
  );
}
