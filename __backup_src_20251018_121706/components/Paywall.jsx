// src/components/Paywall.jsx
import { useEffect, useMemo, useState } from 'react';
import { getPrices, startCheckout } from '../api/payments';
import { useAuthUserId } from '../hooks/useAuthUserId';

function fmtCurrency(amount, currency) {
  if (amount == null) return '—';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount / 100);
}

export default function Paywall() {
  const userId = useAuthUserId();
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState([]);
  const [cycle, setCycle] = useState('month'); // 'month'|'year'
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { items } = await getPrices();
        // tieni solo ricorrenti; sort: Premium in alto, poi mensile prima dell’annuale
        const filtered = items.filter(p => p.interval === 'month' || p.interval === 'year');
        filtered.sort((a,b) => {
          if (a.product.name !== b.product.name) return a.product.name.localeCompare(b.product.name);
          const w = { month: 0, year: 1 };
          return (w[a.interval] ?? 9) - (w[b.interval] ?? 9);
        });
        setPrices(filtered);
      } catch (e) {
        setErr('Impossibile caricare i piani.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const products = useMemo(() => {
    const map = new Map();
    for (const p of prices) {
      const arr = map.get(p.product.name) || [];
      arr.push(p);
      map.set(p.product.name, arr);
    }
    return Array.from(map.entries());
  }, [prices]);

  async function handleBuy(priceId) {
    try {
      setBusy(priceId);
      const url = await startCheckout({ priceId, userId });
      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert('Errore durante la creazione della sessione di pagamento.');
    } finally {
      setBusy(null);
    }
  }

  if (loading) return <div className="lm-paywall">Caricamento piani…</div>;
  if (err) return <div className="lm-paywall error">{err}</div>;

  return (
    <section className="lm-paywall">
      <header className="lm-paywall__hdr">
        <h1>Match veri, non swipe infiniti</h1>
        <p className="sub">Sblocca compatibilità pro, chat prioritaria, boost visibilità.</p>

        <div className="toggle">
          <button
            className={cycle === 'month' ? 'on' : ''}
            onClick={() => setCycle('month')}
            aria-pressed={cycle === 'month'}
          >Mensile</button>
          <button
            className={cycle === 'year' ? 'on' : ''}
            onClick={() => setCycle('year')}
            aria-pressed={cycle === 'year'}
          >Annuale</button>
        </div>
      </header>

      <div className="lm-plans">
        {products.map(([name, plans]) => {
          const plan = plans.find(p => p.interval === cycle) ?? plans[0];
          if (!plan) return null;
          return (
            <article className="plan" key={name}>
              <h2>{name}</h2>
              <p className="desc">{plan.product.description || 'Compatibilità intelligente, niente teatrini.'}</p>
              <div className="price">
                <span className="big">{fmtCurrency(plan.unit_amount, plan.currency)}</span>
                <span className="per">/ {plan.interval}</span>
              </div>
              <ul className="bullets">
                <li>Chat reciproca prioritaria</li>
                <li>Boost visibilità nel feed</li>
                <li>Match Score avanzato</li>
              </ul>
              <button
                disabled={!!busy}
                onClick={() => handleBuy(plan.id)}
                className="cta"
              >
                {busy === plan.id ? 'In corso…' : 'Attiva Premium'}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
