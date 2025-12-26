// src/hooks/usePageViewTracker.ts

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';

/**
 * Traccia automaticamente ogni cambio pagina come "page_view"
 */
export const usePageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackEvent('page_view', { path: location.pathname });
  }, [location]);
};

