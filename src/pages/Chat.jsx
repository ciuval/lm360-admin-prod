// src/pages/Chat.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchMatches, fetchThread, sendMessage, subscribeIncoming } from '../lib/actions/chat';
import { track } from '../lib/analytics';

const pane = { display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px', padding: '16px' };
const card = { background: '#12161b', border: '1px solid #1e252d', borderRadius: 12, padding: 12 };

export default function Chat() {
  const [matches, setMatches] = useState([]);
  const [active, setActive] = useState(null); // other_id
  const [msgs, setMsgs] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    (async () => {
      const m = await fetchMatches();
      setMatches(m);
      if (m[0]) setActive(m[0].other_id);
      track('chat_view');
    })();
  }, []);

  // carica thread quando cambia active
  useEffect(() => {
    if (!active) return;
    (async () => setMsgs(await fetchThread(active)))();
  }, [active]);

  // realtime: push nuovi messaggi in arrivo
  useEffect(() => {
    let unsub = () => {};
    (async () => {
      unsub = await subscribeIncoming((m) => {
        // se il nuovo messaggio riguarda il thread attivo, append
        if (active && (m.sender_id === active || m.receiver_id === active)) {
          setMsgs((prev) => [...prev, m]);
        }
      });
    })();
    return () => unsub();
  }, [active]);

  async function onSend(e) {
    e.preventDefault();
    if (!active) return;
    const v = inputRef.current?.value ?? '';
    try {
      await sendMessage(active, v);
      inputRef.current.value = '';
      // append ottimistico
      setMsgs((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender_id: 'me',
          receiver_id: active,
          content: v,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch {}
  }

  return (
    <section style={pane} aria-label="Chat">
      {/* Match list */}
      <aside style={card} aria-label="Match">
        <h3 style={{ margin: '0 0 8px' }}>I tuoi match</h3>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {matches.map((m) => {
            const p = m.profile;
            const label = p?.display_name || m.other_id.slice(0, 8);
            return (
              <li key={m.other_id}>
                <button
                  onClick={() => setActive(m.other_id)}
                  aria-label={`Apri chat con ${label}`}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px',
                    borderRadius: 8,
                    border: '1px solid #2b323b',
                    background: active === m.other_id ? '#1b2129' : 'transparent',
                    color: '#e8edf2',
                    cursor: 'pointer',
                    marginBottom: 8,
                  }}
                >
                  {p?.avatar_url ? (
                    <img
                      alt=""
                      src={p.avatar_url}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        marginRight: 8,
                        verticalAlign: 'middle',
                      }}
                    />
                  ) : null}
                  <span>{label}</span>
                </button>
              </li>
            );
          })}
          {matches.length === 0 && <li>Nessun match ancora.</li>}
        </ul>
      </aside>

      {/* Thread */}
      <main style={card} aria-label="Thread">
        <div style={{ height: '55vh', overflowY: 'auto', padding: '8px' }}>
          {msgs.map((m) => (
            <div
              key={m.id}
              style={{ margin: '6px 0', textAlign: m.sender_id === 'me' ? 'right' : 'left' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: '#1f2730',
                  padding: '8px 10px',
                  borderRadius: 10,
                }}
              >
                {m.content}
              </span>
            </div>
          ))}
          {msgs.length === 0 && <p>Inizia la conversazione.</p>}
        </div>
        <form onSubmit={onSend} style={{ display: 'flex', gap: 8 }}>
          <input
            ref={inputRef}
            aria-label="Scrivi un messaggio"
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: 8,
              border: '1px solid #2b323b',
              background: '#0b0d10',
              color: '#e8edf2',
            }}
            maxLength={500}
          />
          <button
            type="submit"
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              border: 'none',
              background: '#7C3AED',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Invia
          </button>
        </form>
      </main>
    </section>
  );
}
