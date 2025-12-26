import { getJson, setJson } from '../lib/storage';
import React, { useEffect } from 'react';
import { logEvent } from '../lib/telemetry';

export default function Paywall() {
  useEffect(() => {
    logEvent('paywall_view', { source: 'chat' });
  }, []);
  return (
    <div className="container">
      <h1>Premium</h1>
      <p>Sblocca chat illimitate, prioritÃ  nei match e badge profilo.</p>
    </div>
  );
}
