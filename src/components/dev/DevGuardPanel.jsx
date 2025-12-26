import { getJson, setJson } from '../lib/storage';
// src/components/dev/DevGuardPanel.jsx
import { useEffect, useState } from 'react';
import { getBuffer, isOpen } from '../../agent/devguard';

export default function DevGuardPanel({ diagUrl = '/api/diag' }) {
  const [open, setOpen] = useState(isOpen());
  const [events, setEvents] = useState(getBuffer());
  const [perf, setPerf] = useState(null);

  useEffect(() => {
    const upd = () => setEvents(getBuffer());
    const tog = (e) => setOpen(!!e.detail);
    window.addEventListener('devguard:update', upd);
    window.addEventListener('devguard:toggle', tog);
    return () => {
      window.removeEventListener('devguard:update', upd);
      window.removeEventListener('devguard:toggle', tog);
    };
  }, []);

  useEffect(() => {
    const nav = navigator;
    setPerf({
      time: new Date().toISOString(),
      conn: nav.connection?.effectiveType,
      mem: nav.deviceMemory ? nav.deviceMemory + 'GB' : null,
    });
  }, [open]);

  if (!open) return null;

  return (
    <aside className="devguard">
      <header>
        <strong>DevGuard</strong>
        <span className="muted"> (Shift+D per chiudere)</span>
        <a className="diag" href={diagUrl} target="_blank" rel="noreferrer">
          /api/diag
        </a>
      </header>

      <div className="grid">
        <div>
          <h4>Performance</h4>
          <pre>{JSON.stringify(perf, null, 2)}</pre>
        </div>
        <div>
          <h4>Errori recenti</h4>
          {events.length === 0 && <div className="muted">Niente errori. âœ¨</div>}
          <ul>
            {events.map((e, i) => (
              <li key={i}>
                <div className={`tag ${e.level || 'error'}`}>{e.level || 'error'}</div>
                <code>{e.message}</code>
                {e.stack && (
                  <details>
                    <summary>stack</summary>
                    <pre>{e.stack}</pre>
                  </details>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .devguard {
          position: fixed;
          inset: auto 1rem 1rem 1rem;
          z-index: 9999;
          background: #0b0b12ee;
          color: #e7e7ef;
          border: 1px solid #222436;
          border-radius: 12px;
          padding: 12px;
          backdrop-filter: blur(6px);
          max-height: 60vh;
          overflow: auto;
        }
        header {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .muted {
          color: #9aa0a6;
        }
        .diag {
          margin-left: auto;
          text-decoration: none;
          background: #1d1f2b;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          color: #9ab;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 12px;
          margin-top: 8px;
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        li {
          background: #10121a;
          border: 1px solid #1e2030;
          border-radius: 8px;
          padding: 8px;
        }
        .tag {
          display: inline-block;
          font-size: 0.75rem;
          padding: 0.1rem 0.4rem;
          border-radius: 999px;
          margin-bottom: 4px;
          background: #2b2e3f;
        }
        .tag.error {
          background: #7f1d1d;
          color: #fff;
        }
        .tag.warn {
          background: #7c3aed;
          color: #fff;
        }
        code {
          white-space: pre-wrap;
        }
        pre {
          white-space: pre-wrap;
          overflow: auto;
        }
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </aside>
  );
}
