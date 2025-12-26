import { getJson, setJson } from '../lib/storage';
import React, { useEffect, useMemo } from 'react';

const VARIANTS = {
  A: {
    h1: 'Match intelligenti. Ambiente sicuro.',
    sub: 'Consigli puliti, zero caos. Il primo passo giusto, oggi.',
    cta: { text: 'Iscriviti gratis', href: '#/signup', kind: 'primary' },
  },
  B: {
    h1: 'Relazioni migliori, meno rumore.',
    sub: 'Scopri persone affini e dritte utili â€” elegante e sereno.',
    cta: { text: 'Sblocca Premium', href: import.meta.env.VITE_PAYMENT_LINK_URL, kind: 'outline' },
  },
};

function assignVariant() {
  try {
    const k = 'ab_hero';
    const ex = getJson(k);
    if (ex === 'A' || ex === 'B') return ex;
    const v = Math.random() < 0.5 ? 'A' : 'B';
    setJson(k, v);
    return v;
  } catch {
    return 'A';
  }
}

async function logEvent(variant, event, meta) {
  try {
    const cidKey = 'cid';
    let cid = getJson(cidKey);
    if (!cid) {
      cid = Math.random().toString(16).slice(2) + Date.now().toString(36);
      setJson(cidKey, cid);
    }
    await fetch('/api/ab-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        variant,
        event,
        path: location.hash || location.pathname,
        client_id: cid,
        meta,
      }),
    });
  } catch {}
}

export default function HeroAB() {
  const variant = useMemo(assignVariant, []);
  const v = VARIANTS[variant];

  useEffect(() => {
    logEvent(variant, 'impression');
  }, [variant]);

  return (
    <section className="hero">
      <div className="hero__inner">
        <h1 className="hero__title">{v.h1}</h1>
        <p className="hero__sub">{v.sub}</p>
        <div className="hero__cta">
          <a
            className={'btn ' + (v.cta.kind === 'outline' ? 'btn--outline' : '')}
            href={v.cta.href}
            target={v.cta.href.startsWith('http') ? '_blank' : undefined}
            rel={v.cta.href.startsWith('http') ? 'noreferrer' : undefined}
            onClick={() => logEvent(variant, 'cta_click')}
          >
            {v.cta.text}
          </a>
        </div>
      </div>
    </section>
  );
}
