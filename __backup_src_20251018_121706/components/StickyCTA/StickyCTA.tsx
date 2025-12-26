// src/components/StickyCTA/StickyCTA.tsx

import React, { useState, useEffect } from 'react';
import './sticky-cta.css';

export const StickyCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="sticky-cta">
      <span>Pronto per il tuo match perfetto?</span>
      <button
        onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Iscriviti alla piattaforma"
      >
        Iscriviti
      </button>
    </div>
  );
};

