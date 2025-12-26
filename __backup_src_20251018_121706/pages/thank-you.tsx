// src/pages/thank-you.tsx

import React from 'react';
import Navbar from '../components/Navbar';

const ThankYouPage = () => {
  return (
    <>
      <Navbar />

      <div style={{
        padding: '3rem',
        fontFamily: 'system-ui',
        background: '#121212',
        color: '#fff',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', color: '#bb86fc' }}>
          🎉 Grazie per aver visitato LoveMatch360!
        </h1>
        <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
          Il tuo profilo è importante per trovare match reali. Completa il tuo profilo 
e ottieni subito il tuo primo 100/100!
        </p>
        <a
          href="/profile"
          style={{
            marginTop: '2rem',
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            background: '#bb86fc',
            color: '#000',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}
          aria-label="Vai al tuo profilo"
        >
          Completa il profilo
        </a>
      </div>
    </>
  );
};

export default ThankYouPage;

