import { getJson, setJson } from '../lib/storage';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { makeThread } from '../lib/chat-utils';
import { getMutualMatches } from '../data/getMutualMatches';

export default function Chat() {
  const [session, setSession] = useState(null);
  const [matches, setMatches] = useState([]);
  const [activePeer, setActivePeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const sub = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => sub.data.subscription.unsubscribe();
  }, []);

  const uid = session?.user?.id || null;
  const threadId = useMemo(
    () => (uid && activePeer ? makeThread(uid, activePeer) : null),
    [uid, activePeer]
  );

  // carica la lista match
  useEffect(() => {
    if (!uid) return;
    getMutualMatches(uid).then(setMatches).catch(console.error);
  }, [uid]);

  // carica i messaggi del thread selezionato (paginazione 30 per volta)
  async function loadMessages({ nextPage = 0, append = false } = {}) {
    if (!threadId) return;
    const PAGE_SIZE = 30;
    const from = nextPage * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data, error, count } = await supabase
      .from('messaggi')
      .select('*', { count: 'exact' })
      .eq('thread_id', threadId)
      .order('created_at', { ascending: false })
      .range(from, to);
    if (error) {
      console.error(error);
      return;
    }
    const newList = append ? [...messages, ...data.reverse()] : data.reverse();
    setMessages(newList);
    setPage(nextPage);
    setHasMore(from + data.length < (count || 0));
    setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight }), 0);
  }

  // subscribe realtime al thread corrente
  useEffect(() => {
    if (!threadId) return;
    loadMessages({ nextPage: 0, append: false });
    const channel = supabase
      .channel(`room:${threadId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messaggi',
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          // (opzionale) suono/toast se payload.new.sender !== uid
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  async function sendMessage(e) {
    e?.preventDefault();
    const content = text.trim();
    if (!content || !uid || !activePeer) return;
    setText('');

    const row = {
      thread_id: makeThread(uid, activePeer),
      sender: uid,
      recipient: activePeer,
      content,
    };

    // Ottimistico
    const temp = { ...row, id: `tmp_${Date.now()}`, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, temp]);

    const { error } = await supabase.from('messaggi').insert(row);
    if (error) {
      console.error(error);
      // rollback ottimistico se vuoi
      setMessages((prev) => prev.filter((m) => m.id !== temp.id));
      setText(content);
      return;
    }
  }

  async function markRead() {
    if (!uid || !threadId) return;
    await supabase
      .from('messaggi')
      .update({ read_at: new Date().toISOString() })
      .eq('thread_id', threadId)
      .is('read_at', null)
      .eq('recipient', uid);
  }

  useEffect(() => {
    markRead();
  }, [messages.length]); // semplice

  return (
    <div
      className="chat-grid"
      style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 16 }}
    >
      {/* Sidebar matches */}
      <aside style={{ borderRight: '1px solid var(--line, #333)', padding: 12 }}>
        <h2 style={{ margin: '8px 0' }}>Match</h2>
        <ul
          style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: '70vh', overflow: 'auto' }}
        >
          {matches.map((m) => (
            <li key={m.peer_id}>
              <button
                onClick={() => setActivePeer(m.peer_id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 8px',
                  background: activePeer === m.peer_id ? 'var(--sel, #222)' : 'transparent',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  borderRadius: 6,
                }}
              >
                <strong>{m.profile?.display_name || m.peer_id}</strong>
                <br />
                <small>match: {m.score}</small>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Area conversazione */}
      <section style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 170px)' }}>
        {!activePeer ? (
          <div style={{ padding: 24, opacity: 0.8 }}>
            Seleziona un match per iniziare a chattare.
          </div>
        ) : (
          <>
            <header style={{ padding: '8px 12px', borderBottom: '1px solid var(--line, #333)' }}>
              <strong>
                Chat con{' '}
                {matches.find((x) => x.peer_id === activePeer)?.profile?.display_name || activePeer}
              </strong>
            </header>

            <div ref={listRef} style={{ flex: '1 1 auto', overflow: 'auto', padding: 12 }}>
              {hasMore && (
                <button onClick={() => loadMessages({ nextPage: page + 1, append: true })}>
                  Carica precedenti…
                </button>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    justifyContent: m.sender === uid ? 'flex-end' : 'flex-start',
                    margin: '6px 0',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '8px 10px',
                      borderRadius: 8,
                      background:
                        m.sender === uid ? 'var(--bubble-out,#6c3bff33)' : 'var(--bubble-in,#222)',
                    }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
                    <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                      {new Date(m.created_at).toLocaleTimeString()}
                      {m.sender === uid && (m.read_at ? ' • letto' : ' • inviato')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={sendMessage}
              style={{
                display: 'flex',
                gap: 8,
                padding: 12,
                borderTop: '1px solid var(--line,#333)',
              }}
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Scrivi un messaggio…"
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #444',
                  background: 'transparent',
                  color: 'inherit',
                }}
              />
              <button
                type="submit"
                disabled={!text.trim()}
                style={{ padding: '10px 16px', borderRadius: 8 }}
              >
                Invia
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
