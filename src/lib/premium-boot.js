import { getJson, setJson } from './storage';
import { setPremium } from './premium';
if (typeof window !== 'undefined') {
  window.__LM360_SET_PREMIUM__ = (v) => setPremium(!!v);
}
