// src/pages/ChatPage.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ChatWindow } from '../components/Chat/ChatWindow';

const ChatPage = () => {
  const [otherUserId, setOtherUserId] = useState('');
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setMe(user);
    };
    getUser();
  }, []);

  return (
    <div style={{ padding: '2rem', color: '#fff', background: '#121212', 
fontFamily: 'system-ui' }}>
      <h1>Test Chat Page</h1>

      {me && (
        <p>Sei loggato come: <code>{me.email}</code></p>
      )}

      <label style={{ display: 'block', marginTop: '1rem' }}>
        Inserisci l'ID dell'altro utente:
        <input
          type="text"
          value={otherUserId}
          onChange={e => setOtherUserId(e.target.value)}
          placeholder="uuid dell'altro utente"
          style={{
            width: '100%',
            padding: '0.5rem',
            marginTop: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #555',
            background: '#2a2a2a',
            color: '#fff'
          }}
        />
      </label>

      {otherUserId && <ChatWindow otherUserId={otherUserId} />}
    </div>
  );
};

export default ChatPage;

