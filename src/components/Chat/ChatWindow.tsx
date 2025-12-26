// src/components/Chat/ChatWindow.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatWindowProps {
  otherUserId: string;
}

export const ChatWindow = ({ otherUserId }: ChatWindowProps) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [isAdminOverride, setIsAdminOverride] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Verifica score match
      const { data: match } = await supabase
        .from('matches')
        .select('score')
        .or(`user1.eq.${user.id},user2.eq.${user.id}`)
        .eq('user1', user.id)
        .eq('user2', otherUserId)
        .single();

      // Verifica se è admin
      const { data: admin } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single();

      const isAllowed = (match?.score ?? 0) >= 90 || !!admin;
      setAllowed(isAllowed);
      setIsAdminOverride(!!admin && (match?.score ?? 0) < 90);
    };

    checkPermission();
  }, [otherUserId]);

  if (allowed === null) return <p style={{ color: '#fff' }}>Controllo 
accesso chat...</p>;
  if (!allowed) return <p style={{ color: '#fff' }}>Chat non disponibile. 
Serve match ≥ 90.</p>;

  return (
    <div style={{ background: '#1e1e1e', color: '#fff', padding: '1rem' 
}}>
      {isAdminOverride && (
        <p style={{ color: '#bb86fc', fontStyle: 'italic' }}>
          Questa conversazione è stata abilitata da un amministratore.
        </p>
      )}
      <MessageList otherUserId={otherUserId} />
      <MessageInput receiverId={otherUserId} />
    </div>
  );
};

