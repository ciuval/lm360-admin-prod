import { getJson, setJson } from './storage';
export async function shareLink({ title, text, url }) {
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return true;
    }
  } catch (_) {}
  try {
    await navigator.clipboard.writeText(url);
    alert('Link copiato negli appunti');
  } catch (_) {
    alert('Copia il link: ' + url);
  }
  return false;
}
