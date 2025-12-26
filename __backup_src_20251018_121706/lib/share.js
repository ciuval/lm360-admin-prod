export async function shareLink({ title, text, url }) {
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return { ok: true, method: "web-share" };
    }
  } catch (e) {
    if (e?.name === "AbortError") return { ok: false, cancelled: true };
  }
  try {
    await navigator.clipboard?.writeText(url);
    alert("Link copiato negli appunti ✅");
    return { ok: true, method: "clipboard" };
  } catch {
    window.prompt("Copia il link:", url);
    return { ok: true, method: "prompt" };
  }
}
