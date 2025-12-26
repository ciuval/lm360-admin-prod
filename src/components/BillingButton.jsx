import { getJson, setJson } from '../lib/storage';
// src/components/BillingButton.jsx
import { useState } from 'react';
import { openBillingPortal } from '../api/payments';
import { useAuthUserId } from '../hooks/useAuthUserId';

export default function BillingButton({ className = '' }) {
  const userId = useAuthUserId();
  const [busy, setBusy] = useState(false);

  async function goPortal() {
    try {
      setBusy(true);
      const url = await openBillingPortal({ userId });
      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert('Non riesco ad aprire il Billing Portal.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button onClick={goPortal} className={className} disabled={busy} aria-busy={busy}>
      {busy ? 'Apro il portaleâ€¦' : 'Gestisci abbonamento'}
    </button>
  );
}
