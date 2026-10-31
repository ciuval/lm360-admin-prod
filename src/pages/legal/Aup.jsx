import { Link } from "react-router-dom";
import AupPolicy from "./AupPolicy.jsx";

export default function AupPage() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px 56px" }} aria-labelledby="aup-title">
      <h1 id="aup-title">Regole di uso accettabile (AUP)</h1>
      <p style={{ lineHeight: 1.75 }}>LoveMatch360: regole per interazioni rispettose e sicurezza degli utenti.</p>
      <AupPolicy headingLevel={2} />
      <p><Link to="/terms" style={{ color: "#ffd7ea" }}>Leggi tutti i Termini e Condizioni</Link></p>
    </main>
  );
}
