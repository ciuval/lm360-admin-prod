import { getJson, setJson } from '../lib/storage';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent } from '../lib/telemetry';

export default function RouteTracker() {
  const loc = useLocation();
  useEffect(() => {
    const route = (loc.pathname || '') + (loc.hash || '');
    logEvent('page_view', { route });
  }, [loc]);
  return null;
}
