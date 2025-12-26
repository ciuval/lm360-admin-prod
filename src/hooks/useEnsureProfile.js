import { getJson, setJson } from '../lib/storage';
// src/hooks/useEnsureProfile.js
import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-hot-toast';

export default function useEnsureProfile() {
  useEffect(() => {
    const ensureProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profili')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!data && !error) {
        const { error: insertErr } = await supabase.from('profili').insert({
          id: user.id,
          nome: user.email.split('@')[0],
          bio: '',
          interessi: '',
          foto_url: '',
        });
        if (!insertErr) toast.success('âœ… Profilo creato automaticamente');
      }
    };

    ensureProfile();
  }, []);
}
