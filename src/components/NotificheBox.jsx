import { getJson, setJson } from '../lib/storage';
// âœ… File: src/components/NotificheBox.jsx (con suono notifica)
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const notifySound = new Audio('/notify.mp3'); // Assicurati che notify.mp3 sia in /public

export default function NotificheBox() {
  const [notifiche, setNotifiche] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      caricaNotifiche(user.id);

      const channel = supabase
        .channel('notifiche-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifiche',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            setNotifiche((prev) => [payload.new, ...prev]);
            toast.success(`ðŸ”” ${payload.new.titolo}`);
            try {
              notifySound.play();
            } catch {} // ðŸ”Š riproduce suono se possibile
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    fetch();
  }, []);

  const caricaNotifiche = async (id) => {
    const { data, error } = await supabase
      .from('notifiche')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error) setNotifiche(data);
  };

  const segnaTutteComeLette = async () => {
    if (!userId) return;
    await supabase
      .from('notifiche')
      .update({ letto: true })
      .eq('user_id', userId)
      .eq('letto', false);

    setNotifiche((prev) => prev.map((n) => ({ ...n, letto: true })));
  };

  const eliminaTutte = async () => {
    if (!userId) return;
    await supabase.from('notifiche').delete().eq('user_id', userId);

    setNotifiche([]);
    toast('ðŸ—‘ï¸ Notifiche eliminate');
  };

  if (!notifiche.length) return null;

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        marginTop: '2rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ color: '#f08fc0' }}>ðŸ”” Le tue notifiche</h4>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={segnaTutteComeLette} style={buttonStyle}>
            ðŸ§¹ Segna come letto
          </button>
          <button onClick={eliminaTutte} style={{ ...buttonStyle, backgroundColor: '#e74c3c' }}>
            ðŸ—‘ï¸ Elimina tutto
          </button>
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notifiche.map((n) => (
          <li
            key={n.id}
            style={{
              marginBottom: '1rem',
              backgroundColor: coloreNotifica(n.tipo),
              borderRadius: '6px',
              padding: '0.8rem',
              color: n.tipo === 'danger' ? '#fff' : '#000',
              opacity: n.letto ? 0.5 : 1,
            }}
          >
            <strong>{n.titolo}</strong>
            <p style={{ margin: 0 }}>{n.messaggio}</p>
            <small style={{ fontSize: '0.75rem', opacity: 0.7 }}>
              {format(new Date(n.created_at), 'dd/MM/yyyy HH:mm')}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

function coloreNotifica(tipo) {
  switch (tipo) {
    case 'success':
      return '#c8e6c9';
    case 'warning':
      return '#fff9c4';
    case 'danger':
      return '#f44336';
    default:
      return '#eeeeee';
  }
}

const buttonStyle = {
  padding: '0.4rem 0.8rem',
  fontSize: '0.8rem',
  backgroundColor: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};
