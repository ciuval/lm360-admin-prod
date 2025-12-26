// src/pages/Home.tsx

import React from 'react';
import NavBar from '../components/NavBar.jsx';
import { StickyCTA } from '../components/StickyCTA/StickyCTA';
import '../styles/sticky-cta.css';
import '../styles/a11y.css'; // âœ… Import stile accessibilitÃ 

const Home = () => {
  return (
    <>
      {/* Banner visivo di lancio */}
      <div style={{
        background: '#00e676',
        color: '#000',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        ðŸš€ LoveMatch360 Ã¨ ora online! Scopri i nuovi match perfetti!
      </div>

      <NavBar />

      <div style={{
        padding: '2rem',
        fontFamily: 'system-ui',
        color: '#fff',
        background: '#121212'
      }}>
        <header>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            Match perfetto. Storie vere.
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
            Iscriviti gratis, completa il tuo profilo e inizia a ricevere match a 
100/100.
          </p>
          <button
            aria-label="Inizia la registrazione gratuita"
            style={{
              background: '#bb86fc',
              color: 'black',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Inizia ora
          </button>
        </header>

        <section style={{ marginTop: '4rem' }}>
          <p>Qui puoi inserire altri elementi della homepage o componenti 
successivi.</p>
        </section>
      </div>

      <StickyCTA />
    </>
  );
};

export default Home;



