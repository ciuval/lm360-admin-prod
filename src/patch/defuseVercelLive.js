/* Kill overlay Vercel Live e affini in produzione */
if (import.meta.env.PROD) {
  const kill = () => {
    const sel = ['vercel-live-feedback', '#vercel-live-feedback', '[class*=vercel-live-feedback]'];
    document.querySelectorAll(sel.join(',')).forEach((el) => {
      try {
        el.style.pointerEvents = 'none';
        el.style.zIndex = '0';
        el.style.opacity = '0';
      } catch {}
    });
    // Rimuovi eventuali <script src="https://vercel.live/...">
    document.querySelectorAll('script[src*="vercel.live"]').forEach((s) => {
      try {
        s.remove();
      } catch {}
    });
  };
  kill();
  new MutationObserver(kill).observe(document.documentElement, { childList: true, subtree: true });
}
