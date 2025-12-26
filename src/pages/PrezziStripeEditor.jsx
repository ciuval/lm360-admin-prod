import { getJson, setJson } from '../lib/storage';
// âœ… File: src/pages/PrezziStripeEditor.jsx
import React, { useEffect, useState } from 'react';

export default function PrezziStripeEditor() {
  const [prezzi, setPrezzi] = useState([]);
  const [caricamento, setCaricamento] = useState(true);
  const [nickname, setNickname] = useState('');
  const [importo, setImporto] = useState('');
  const [valuta, setValuta] = useState('eur');
  const [productId, setProductId] = useState('');

  useEffect(() => {
    const fetchPrezzi = async () => {
      try {
        const res = await fetch('/api/get-prices');
        const data = await res.json();
        setPrezzi(data);
      } catch (err) {
        console.error('Errore nel caricamento prezzi:', err);
      } finally {
        setCaricamento(false);
      }
    };
    fetchPrezzi();
  }, []);

  const handleCreatePrice = async () => {
    if (!importo || !productId) return;
    try {
      const res = await fetch('/api/create-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          unit_amount: parseFloat(importo) * 100,
          currency: valuta,
          product: productId,
        }),
      });
      const data = await res.json();
      alert('âœ… Prezzo creato: ' + data.id);
    } catch (err) {
      alert('âŒ Errore nella creazione del prezzo');
    }
  };

  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <h2 style={{ color: '#f08fc0' }}>ðŸ› ï¸ Editor Prezzi Stripe</h2>

      <div style={{ marginBottom: '2rem' }}>
        <h4>Crea un nuovo prezzo</h4>
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={input}
        />
        <input
          type="number"
          placeholder="Importo (â‚¬)"
          value={importo}
          onChange={(e) => setImporto(e.target.value)}
          style={input}
        />
        <input
          type="text"
          placeholder="Valuta (es. eur)"
          value={valuta}
          onChange={(e) => setValuta(e.target.value)}
          style={input}
        />
        <input
          type="text"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          style={input}
        />
        <button onClick={handleCreatePrice} style={button}>
          âž• Crea Prezzo
        </button>
      </div>

      <h4>Prezzi esistenti</h4>
      {caricamento ? (
        <p>Caricamento...</p>
      ) : (
        <ul>
          {prezzi.map((p, i) => (
            <li key={i} style={{ marginBottom: '1rem' }}>
              ðŸ’¶{' '}
              <strong>
                {(p.unit_amount / 100).toFixed(2)} {p.currency.toUpperCase()}
              </strong>{' '}
              - {p.nickname || '(senza nome)'}
              <br />
              ðŸ†” <code>{p.id}</code> â€“ ðŸ›’ Product: {p.product}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const input = {
  display: 'block',
  margin: '0.5rem 0',
  padding: '0.6rem 1rem',
  borderRadius: '6px',
  width: '100%',
  backgroundColor: '#1e1e1e',
  color: '#fff',
  border: '1px solid #555',
};

const button = {
  marginTop: '0.5rem',
  padding: '0.6rem 1.4rem',
  backgroundColor: '#f08fc0',
  color: 'black',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};
