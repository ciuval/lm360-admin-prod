import { getJson, setJson } from './storage';
export const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'https://app.lovematch360.com'
    : '';
