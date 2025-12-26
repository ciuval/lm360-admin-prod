import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supaUrl  = import.meta.env.VITE_SUPABASE_URL;
const supaAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supaUrl, supaAnon);

export default function PremiumBadge() {
  const [st, setSt] = useState({ loading: true, isPremium: false, until: null });

  useEffect(() => {
    let ok = true;
    (async () => {
      // Legge la vista abbonamenti_api (legata all’utente via RLS)
      const { data, error } = await supabase
        .from('abbonamenti_api')
        .select('scadenza')
        .order('scadenza', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!ok) return;
      if (error) return setSt({ loading: false, isPremium: false, until: null });

      const until = data?.scadenza ?? null;
      const isPremium = until ? new Date(until) > new Date() : false;
      setSt({ loading: false, isPremium, until });
    })();
    return () => { ok = false; };
  }, []);

  if (st.loading || !st.isPremium) return null;

  const dateStr = st.until ? new Date(st.until).toLocaleDateString() : '';
  return (
    <div role="status" aria-live="polite"
         style={{margin:'1rem 0', padding:'.6rem .8rem', borderRadius:'10px',
                 background:'#0c3b2e', color:'#d8fff2', display:'inline-block' }}>
      <strong>✅ Premium attivo</strong>{st.until ? <> • fino al <span>{dateStr}</span></> : null}
    </div>
  );
}
