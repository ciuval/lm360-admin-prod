import { getJson, setJson } from './storage';
import { sb } from './supabaseClient';
export async function nearMatches({ me, lat, lon, radius = 30000, limit = 50 }) {
  const { data, error } = await sb.rpc('near_matches', {
    me,
    p_lat: lat,
    p_lon: lon,
    radius_m: radius,
    limit_n: limit,
  });
  if (error) throw error;
  return data || [];
}
