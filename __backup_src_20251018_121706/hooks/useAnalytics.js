import { useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export function useAnalytics() {
  const trackEvent = useCallback(async (eventName: string, metadata: Record<string, any> = {}) => {
    const consent = localStorage.getItem('tracking_consent') === 'true';
    if (!consent) return;

    const { data, error } = await supabase.auth.getUser();
    const user_id = data?.user?.id;
    if (!user_id) return;

    await supabase.from('analytics_events').insert([
      { user_id, event_name: eventName, metadata }
    ]);
  }, []);

  return {
    trackSignUp: () => trackEvent('sign_up', { method: 'email' }),
    trackProfileComplete: () => trackEvent('profile_complete'),
    trackLikeSent: (toUserId: string) => trackEvent('like_sent', { toUserId }),
    trackMutualMatch: () => trackEvent('mutual_match'),
    trackMessageSent: (chatId: string) => trackEvent('message_sent', { chatId }),
    trackPaywallView: () => trackEvent('paywall_view'),
    trackPurchase: (plan: string) => trackEvent('purchase', { plan }),
  };
}
