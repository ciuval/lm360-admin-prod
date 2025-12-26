import { NavLink } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" aria-label="Footer">
      <div className="footer-grid">
        <div>
          <div className="footer-links">
            <NavLink to="/privacy">Privacy</NavLink>
            <NavLink to="/cookie">Cookie</NavLink>
            <NavLink to="/termini">Termini</NavLink>
            <NavLink to="/rimborsi">Rimborsi</NavLink>
          </div>

          <p className="mini" style={{ marginTop: 10 }}>
            LoveMatch360 è un servizio di incontro e networking. Manteniamo un ambiente responsabile: niente contenuti espliciti,
            niente molestie, niente PII nei log. Qui non si scherza.
          </p>
        </div>

        <div className="mini" style={{ textAlign: "right" }}>
          © {year} LoveMatch360
        </div>
      </div>
    </footer>
  );
}
