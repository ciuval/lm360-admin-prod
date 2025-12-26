import { getJson, setJson } from '../lib/storage';
import { useState, useEffect, useCallback } from 'react';

export function useTrackingConsent() {
  const [consentGiven, setConsentGiven] = (useState < boolean) | (null > null);

  useEffect(() => {
    const stored = getJson('tracking_consent');
    if (stored === 'true') setConsentGiven(true);
    else if (stored === 'false') setConsentGiven(false);
    else setConsentGiven(null);
  }, []);

  const acceptConsent = useCallback(() => {
    setJson('tracking_consent', 'true');
    setConsentGiven(true);
  }, []);

  const rejectConsent = useCallback(() => {
    setJson('tracking_consent', 'false');
    setConsentGiven(false);
  }, []);

  return {
    consentGiven,
    acceptConsent,
    rejectConsent,
  };
}
