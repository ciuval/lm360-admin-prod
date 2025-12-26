import { getJson, setJson } from '../lib/storage';
import React from 'react';
import { toast } from '../lib/toast';
import { supabase } from '../lib/supabaseClient';

export function usePremiumRealtime() {
  const lastActiveRef = React.useRef(null);
  const subCleanupRef = React.useRef(null);
  const pollRef = React.useRef(null);

  React.useEffect(() => {
    let stopped = false;

    async function getUserId() {
      try {
        const r = await fetch('/api/dev-get-access-token');
        const j = await r.json();
        return j?.user_id || null;
      } catch {
        return null;
      }
    }

    async function fetchPremium() {
      try {
        const tok = await (await fetch('/api/dev-get-access-token')).json();
        const r = await fetch('/api/my-premium', {
          headers: { Authorization: `Bearer ${tok?.access_token || ''}` },
        });
        const j = await r.json();
        return !!j?.premium;
      } catch {
        return null;
      }
    }

    function startPolling() {
      if (pollRef.current) return;
      toast('👂 Monitoraggio Premium attivo (fallback).', 'info', { duration: 2500 });
      pollRef.current = setInterval(async () => {
        if (stopped) return;
        const curr = await fetchPremium();
        if (curr == null) return;
        if (lastActiveRef.current === null) {
          lastActiveRef.current = curr;
          return;
        }
        if (curr !== lastActiveRef.current) {
          lastActiveRef.current = curr;
          if (curr) toast('⭐ Premium attivato! Benvenutə nella zona VIP.', 'success');
          else toast('ℹ️ Abbonamento cambiato.', 'info');
        }
      }, 4000);
    }

    async function startRealtime() {
      const user_id = await getUserId();
      if (!user_id || !supabase?.channel) {
        startPolling();
        return;
      }

      try {
        const ch = supabase.channel('abbonamenti_user_' + user_id);
        let subscribed = false;
        const debRef = { t: 0 };

        ch.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'abbonamenti',
            filter: `utente_id=eq.${user_id}`,
          },
          (payload) => {
            const now = Date.now();
            if (now - debRef.t < 1500) return; // debounce
            debRef.t = now;

            const row = payload.new || {};
            const active =
              row?.status === 'active' && row?.scadenza && new Date(row.scadenza) > new Date();
            if (active) toast('⭐ Premium attivato! Benvenutə nella zona VIP.', 'success');
            else toast(`ℹ️ Abbonamento aggiornato: ${row?.status ?? '—'}.`, 'info');
          }
        );

        const sub = await ch.subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            subscribed = true;
            toast('🔔 Ascolto aggiornamenti Premium attivo.', 'info', { duration: 2200 });
          }
        });

        // safety‑net: se non subscribe entro 1.6s → fallback
        setTimeout(() => {
          if (!subscribed) startPolling();
        }, 1600);

        subCleanupRef.current = () => {
          try {
            supabase.removeChannel(ch);
          } catch {}
        };
      } catch {
        startPolling();
      }
    }

    (async () => {
      const init = await fetchPremium();
      if (init != null) lastActiveRef.current = init;
      await startRealtime();
    })();

    return () => {
      stopped = true;
      if (subCleanupRef.current) subCleanupRef.current();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);
}
