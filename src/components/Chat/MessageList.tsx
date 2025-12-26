// src/components/Chat/MessageList.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export const MessageList = ({ otherUserId }: { otherUserId: string }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      setMessages(data ?? []);
    };

    init();
  }, [otherUserId]);

  return (
    <div style={{
      maxHeight: '300px',
      overflowY: 'auto',
      background: '#2a2a2a',
      padding: '1rem',
      borderRadius: '6px',
      marginBottom: '1rem'
    }}>
      {messages
        .filter(m =>
          (m.sender_id === userId && m.receiver_id === otherUserId) ||
          (m.sender_id === otherUserId && m.receiver_id === userId)
        )
        .map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.sender_id === userId ? 'right' : 'left',
            marginBottom: '0.5rem',
            color: '#fff'
          }}>
            <span style={{
              background: msg.sender_id === userId ? '#bb86fc' : '#444',
              padding: '0.5rem',
              borderRadius: '6px',
              display: 'inline-block'
            }}>
              {msg.content}
            </span>
          </div>
      ))}
    </div>
  );
};

