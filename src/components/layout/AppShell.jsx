import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function AppShell({ children }) {
  return (
    <>
      <a className="skip-link" href="#main">Salta al contenuto</a>
      <div className="nav">
        <div className="container">
          <Navbar />
        </div>
      </div>

      <div className="container">
        {children}
        <Footer />
      </div>
    </>
  );
}
