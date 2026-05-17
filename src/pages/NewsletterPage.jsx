export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-[#07070b] px-6 py-12 text-white">
      <section
        className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl"
        aria-labelledby="newsletter-title"
      >
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-pink-300">
          LoveMatch360
        </p>

        <h1
          id="newsletter-title"
          className="mt-4 text-3xl font-black tracking-tight text-white"
        >
          Newsletter non disponibile
        </h1>

        <p className="mt-4 text-base leading-7 text-white/75">
          La funzione newsletter legacy è stata disattivata dal client per
          proteggere dati, consensi e tracciabilità operativa. Le comunicazioni
          agli utenti verranno gestite solo tramite flussi validati e sicuri.
        </p>

        <div
          className="mt-6 rounded-2xl border border-pink-300/20 bg-black/20 p-5"
          aria-live="polite"
        >
          <h2 className="text-lg font-extrabold text-white">
            Stato sicurezza
          </h2>

          <ul className="mt-3 space-y-2 text-sm leading-6 text-white/70">
            <li>Nessuna email viene letta dal browser.</li>
            <li>Nessun log newsletter viene scritto dal browser.</li>
            <li>Nessuna informazione personale viene mostrata in pagina.</li>
            <li>Le funzioni admin newsletter restano fuori dal client pubblico.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
