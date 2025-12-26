import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="nav-inner">
      <div className="brand" aria-label="LoveMatch360">
        <span className="logo-dot" aria-hidden="true" />
        <span>LoveMatch360</span>
      </div>

      <nav className="nav-links" aria-label="Navigazione principale">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/premium">Premium</NavLink>
        <NavLink to="/scopri">Scopri</NavLink>
        <NavLink to="/profilo">Profilo</NavLink>
      </nav>
    </div>
  );
}
