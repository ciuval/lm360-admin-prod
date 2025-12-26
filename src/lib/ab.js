import { getJson, setJson } from './storage';
import { track } from './analytics';

function safeRandomNibble() {
  try {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const a = new Uint8Array(1);
      crypto.getRandomValues(a);
      return a[0] & 15;
    }
  } catch {}
  return Math.floor(Math.random() * 16);
}
function uuid4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = safeRandomNibble();
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function getDeviceId() {
  try {
    const k = 'lm360_device_id';
    let id = getJson(k);
    if (!id) {
      id = uuid4();
      setJson(k, id);
    }
    return id;
  } catch {
    return 'anon';
  }
}
function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function assign(exp, variants = ['A', 'B']) {
  const id = getDeviceId();
  const idx = hash(id + ':' + exp) % variants.length;
  const variant = variants[idx];
  try {
    const key = 'ab_exp_' + exp;
    if (sessionStorage.getItem(key) !== variant) {
      track('ab_exposure', { exp, variant, did: id });
      sessionStorage.setItem(key, variant);
    }
  } catch {}
  return variant;
}
export function abClick(exp, variant, where) {
  try {
    track('ab_click', {
      exp,
      variant,
      where,
      did: typeof localStorage !== 'undefined' ? getJson('lm360_device_id') || 'anon' : 'anon',
    });
  } catch {}
}
