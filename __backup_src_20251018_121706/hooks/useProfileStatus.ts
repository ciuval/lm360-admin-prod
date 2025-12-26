// src/hooks/useProfileStatus.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useProfileStatus() {
  const [isComplete, setIsComplete] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsComplete(null);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('photo, bio, interests')
        .eq('id', user.id)
        .single();

      const complete = !!data?.photo && !!data?.bio && (data?.interests?.length ?? 0) >= 3;
      setIsComplete(complete);
    };

    check();
  }, []);

  return { isComplete };
}

