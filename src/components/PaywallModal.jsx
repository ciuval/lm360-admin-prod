import { getJson, setJson } from '../lib/storage';
import React from 'react';
export default function PaywallModal({ open, onClose, onProceed }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="p-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.55)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0B0F14',
          color: '#fff',
          border: '1px solid #334155',
          borderRadius: 12,
          padding: 18,
          width: 'min(92vw,560px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="p-title" style={{ marginTop: 0 }}>
          Premium: più filtri, più risultati
        </h2>
        <ul style={{ opacity: 0.9, marginTop: 8 }}>
          <li>Filtri avanzati</li>
          <li>Boost profilo 1/settimana</li>
          <li>Read receipts</li>
          <li>Supporto prioritario</li>
        </ul>
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button
            onClick={onProceed}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: 'none',
              background: '#7C3AED',
              color: '#fff',
            }}
          >
            Procedi al pagamento
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid #CBD5E1',
              background: 'transparent',
            }}
          >
            Più tardi
          </button>
        </div>
      </div>
    </div>
  );
}
