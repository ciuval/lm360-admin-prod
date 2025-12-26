import { getJson, setJson } from './storage';
export function makeThread(a, b) {
  return a < b ? `${a}_${b}` : `${b}_${a}`;
}
