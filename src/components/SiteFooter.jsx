import React from "react";
import { NavLink } from "react-router-dom";

function FooterLink({ to, children }) {
  return (
    <NavLink to={to} style={linkStyle}>
      {children}
    </NavLink>
  );
}

export default function SiteFooter() {
  return (
    <footer style={footerStyle}>
      <div style={innerStyle}>
        <div style={brandBlockStyle}>
          <div style={brandStyle}>LoveMatch360</div>
          <p style={textStyle}>
            Uno spazio più umano per scoprire profili, creare connessioni e
            costruire un percorso relazionale più chiaro.
          </p>
        </div>

        <div style={gridStyle}>
          <div>
            <h3 style={titleStyle}>Legale</h3>
            <div style={stackStyle}>
              <FooterLink to="/privacy">Privacy</FooterLink>
              <FooterLink to="/cookie">Cookie</FooterLink>
              <FooterLink to="/terms">Termini</FooterLink>
              <FooterLink to="/refunds">Rimborsi</FooterLink>
            </div>
          </div>

          <div>
            <h3 style={titleStyle}>Contatti</h3>
            <div style={stackStyle}>
              <a href="mailto:info@lovematch360.com" style={linkStyle}>
                info@lovematch360.com
              </a>
              <a href="mailto:servizioclienti@lovematch360.com" style={linkStyle}>
                servizioclienti@lovematch360.com
              </a>
            </div>
          </div>

          <div>
            <h3 style={titleStyle}>Stato</h3>
            <div style={stackStyle}>
              <span style={mutedStyle}>Piattaforma attiva</span>
              <span style={mutedStyle}>Checkout test verificato</span>
              <span style={mutedStyle}>Live payments in review Stripe</span>
            </div>
          </div>
        </div>
      </div>

      <div style={bottomBarStyle}>
        <span style={bottomTextStyle}>© {new Date().getFullYear()} LoveMatch360</span>
        <span style={bottomTextStyle}>Connessioni più vive, meno caos.</span>
      </div>
    </footer>
  );
}

const footerStyle = {
  marginTop: "32px",
  borderTop: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.02)",
};

const innerStyle = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "28px 16px 20px",
  display: "grid",
  gap: "20px",
};

const brandBlockStyle = {
  maxWidth: "720px",
};

const brandStyle = {
  fontSize: "1.6rem",
  fontWeight: 900,
  color: "#ffffff",
  letterSpacing: "-0.03em",
};

const textStyle = {
  marginTop: "10px",
  color: "rgba(255,255,255,0.72)",
  lineHeight: 1.7,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
};

const titleStyle = {
  margin: 0,
  marginBottom: "10px",
  color: "#ffffff",
  fontSize: "1rem",
};

const stackStyle = {
  display: "grid",
  gap: "8px",
};

const linkStyle = {
  color: "#ffd7ea",
  textDecoration: "none",
  lineHeight: 1.6,
};

const mutedStyle = {
  color: "rgba(255,255,255,0.66)",
  lineHeight: 1.6,
};

const bottomBarStyle = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "0 16px 18px",
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const bottomTextStyle = {
  color: "rgba(255,255,255,0.52)",
  fontSize: "0.92rem",
};