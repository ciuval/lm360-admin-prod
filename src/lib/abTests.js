import { getJson, setJson } from './storage';
import { supabase } from './supabaseClient';
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
export async function getAbVariant(userId, key, variants) {
  const LS = `ab:${key}`;
  try {
    // prova fetch da tabella ab_assignments (userId+key -> variant)
    if (userId) {
      const { data } = await supabase
        .from('ab_assignments')
        .select('variant')
        .eq('user_id', userId)
        .eq('key', key)
        .maybeSingle();
      if (data?.variant) {
        setJson(LS, data.variant);
        return data.variant;
      }
    }
  } catch {}
  // fallback stabile locale
  try {
    const saved = getJson(LS);
    if (saved) return saved;
    const v = pick(variants);
    setJson(LS, v);
    return v;
  } catch {}
  return variants[0];
}
