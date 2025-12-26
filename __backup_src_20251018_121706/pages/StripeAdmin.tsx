import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const StripeAdmin = () => {
  const [utenti, setUtenti] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('stripe_customers')
        .select('user_id, stripe_customer_id, profiles(is_premium)')
        .order('created_at', { ascending: false });

      if (!error && data) setUtenti(data);
      setLoading(false);
    };

    load();
  }, []);

  const exportCSV = () => {
    const headers = ['user_id', 'stripe_customer_id', 'is_premium'];
    const rows = utenti.map(u => [
      u.user_id,
      u.stripe_customer_id,
      u.profiles?.is_premium ? '1' : '0'
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'utenti_stripe.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', background: '#121212', color: '#fff' }}>
      <h2 style={{ color: '#bb86fc' }}>💳 Utenti Stripe collegati</h2>

      <button
        onClick={exportCSV}
        style={{ margin: '1rem 0', padding: '0.5rem 1rem', background: '#00e676', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
      >
        📥 Esporta CSV
      </button>

      {loading ? (
        <p>Caricamento in corso...</p>
      ) : utenti.length === 0 ? (
        <p>Nessun cliente registrato.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#222' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>User ID</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Customer ID</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Premium</th>
            </tr>
          </thead>
          <tbody>
            {utenti.map((u) => (
              <tr key={u.user_id} style={{ borderBottom: '1px solid #444' }}>
                <td style={{ padding: '0.5rem' }}>{u.user_id}</td>
                <td style={{ padding: '0.5rem' }}>{u.stripe_customer_id}</td>
                <td style={{ padding: '0.5rem' }}>{u.profiles?.is_premium ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StripeAdmin;
