
import React from 'react';
import { useProfileStatus } from '../hooks/useProfileStatus';
import { Badge } from './Badge/Badge';

export const Navbar = () => {
  const { isComplete } = useProfileStatus();

  return (
    <nav style={{
      background: '#1e1e1e',
      color: '#fff',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'system-ui'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        LoveMatch360
      </div>

      <div>
        <a
          href="/profile"
          aria-label="Vai al tuo profilo utente"
          style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          Il mio profilo
          {isComplete === false && <Badge label="Incompleto" />}
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
