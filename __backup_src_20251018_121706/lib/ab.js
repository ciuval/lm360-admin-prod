// src/lib/ab.js
// Assegna variante stabile e traccia eventi su Supabase (tabella: ab_events)
export function abAssign(test, variants = ["A","B"]) {
  const k = `ab:${test}`;
  let v = localStorage.getItem(k);
  if (!v) { v = variants[Math.floor(Math.random() * variants.length)]; localStorage.setItem(k, v); }
  return v;
}

import { supabase } from "../lib/supabaseClient";
export async function abTrack({ test, variant, event, user_id = null, meta = {} }) {
  try { await supabase.from("ab_events").insert({ test, variant, event, user_id, meta }); } catch {}
}
