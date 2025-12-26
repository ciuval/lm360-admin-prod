import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <main id="main" className="section">
      <div className="card card-pad">
        <h1 style={{ margin: 0 }}>Pagina non trovata</h1>
        <p className="lead" style={{ marginTop: 10 }}>
          Qui non c’è niente. Ma puoi tornare a casa.
        </p>
        <NavLink className="btn" to="/">Torna alla Home</NavLink>
      </div>
    </main>
  );
}
