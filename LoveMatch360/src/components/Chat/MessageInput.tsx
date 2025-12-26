// src/components/Chat/MessageInput.tsx

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export const MessageInput = ({ receiverId }: { receiverId: string }) => {
  const [content, setContent] = useState('');

  const sendMessage = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !content.trim()) return;

    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: receiverId,
      content: content.trim()
    });

    if (!error) setContent('');
    else console.error('Errore invio:', error);
  };

  return (
    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
      <input
        type="text"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Scrivi un messaggio..."
        aria-label="Scrivi un messaggio"
        onKeyDown={(e) => {
          if (e.key === 'Enter') sendMessage();
        }}
        style={{
          flex: 1,
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #555',
          background: '#2a2a2a',
          color: '#fff'
        }}
      />
      <button
        onClick={(e) => {
          e.preventDefault(); // evita ricarica pagina se è in un form
          sendMessage();
        }}
        aria-label="Invia il messaggio"
        style={{
          background: '#bb86fc',
          color: '#000',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Invia
      </button>
    </div>
  );
};

