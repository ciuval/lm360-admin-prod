// src/pages/ChatBox.tsx

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { trackEvent } from '../lib/analytics';

const ChatBox = ({ currentUser, destinatarioId }) => {
  const [messaggio, setMessaggio] = useState('');

  const handleInvia = async () => {
    if (!messaggio.trim()) return;

    const { error } = await supabase.from('messaggi').insert({
      contenuto: messaggio,
      mittente_id: currentUser.id,
      destinatario_id: destinatarioId
    });

    if (!error) {
      trackEvent('message_sent', {
        from: currentUser.id,
        to: destinatarioId
      });
      setMessaggio('');
    }
  };

  return (
    <div>
      <textarea
        value={messaggio}
        onChange={(e) => setMessaggio(e.target.value)}
        placeholder="Scrivi un messaggio..."
        rows={4}
        style={{ width: '100%', padding: '1rem' }}
      />
      <button onClick={handleInvia}>Invia</button>
    </div>
  );
};

export default ChatBox;
