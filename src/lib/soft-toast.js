import { getJson, setJson } from './storage';
(function () {
  if (window.toast) return;
  const id = 'lm360-toast';
  function ensure() {
    let c = document.getElementById(id);
    if (c) return c;
    c = document.createElement('div');
    c.id = id;
    c.setAttribute('aria-live', 'polite');
    c.setAttribute('aria-atomic', 'true');
    c.style.position = 'fixed';
    c.style.bottom = '16px';
    c.style.right = '16px';
    c.style.display = 'flex';
    c.style.flexDirection = 'column';
    c.style.gap = '8px';
    c.style.zIndex = '2147483647';
    c.style.pointerEvents = 'none';
    document.body.appendChild(c);
    const style = document.createElement('style');
    style.textContent = `
      .lm360-toast-item{pointer-events:auto; min-width:260px; max-width:340px; padding:12px 14px; border-radius:10px;
        box-shadow:0 6px 24px rgba(0,0,0,.18); font: 500 14px/1.4 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        color:#fff; display:flex; gap:10px; align-items:flex-start; }
      .lm360-success{ background:#16a34a; }
      .lm360-info{    background:#2563eb; }
      .lm360-error{   background:#dc2626; }
      .lm360-title{ font-weight:700; margin:0 0 2px 0; }
      .lm360-close{ background:transparent; border:0; color:inherit; margin-left:auto; cursor:pointer; }
    `;
    document.head.appendChild(style);
    return c;
  }
  window.toast = function (title, body, kind = 'info', ms = 4000) {
    try {
      const c = ensure();
      const el = document.createElement('div');
      el.className = `lm360-toast-item lm360-${kind}`;
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.innerHTML = `
        <div style="display:flex; flex-direction:column">
          <strong class="lm360-title"></strong>
          <div class="lm360-body"></div>
        </div>
        <button class="lm360-close" aria-label="Chiudi notifica">âœ•</button>
      `;
      el.querySelector('.lm360-title').textContent = title ?? '';
      el.querySelector('.lm360-body').textContent = body ?? '';
      el.querySelector('.lm360-close').onclick = () => el.remove();
      c.appendChild(el);
      setTimeout(() => el.remove(), ms);
    } catch (e) {}
  };
})();
