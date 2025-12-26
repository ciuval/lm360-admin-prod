/** Click universale per pulsanti/anchor "Consigli" */
function wire() {
  const els = Array.from(document.querySelectorAll('a,button'));
  els.forEach((el) => {
    const t = (el.textContent || '').trim().toLowerCase();
    if (t.startsWith('consigli')) {
      el.setAttribute('data-nav-consigli', '1');
      el.addEventListener(
        'click',
        (e) => {
          try {
            e.preventDefault();
            window.location.hash = '#/consigli';
          } catch {}
        },
        { once: false }
      );
    }
  });
}
document.addEventListener('DOMContentLoaded', wire);
setTimeout(wire, 600);
