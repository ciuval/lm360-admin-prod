import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadCurrentAccountTier } from "../lib/accountTier";
import { track } from "../lib/analytics.js";

const journey = [
  {
    number: "01",
    title: "Raccontati con sostanza",
    text: "Una bio, interessi veri e immagini scelte bene: il profilo diventa un invito, non una vetrina vuota.",
  },
  {
    number: "02",
    title: "Scopri con intenzione",
    text: "Leggi prima di scegliere. Ogni like ha più senso quando nasce da qualcosa che hai davvero notato.",
  },
  {
    number: "03",
    title: "Lascia spazio alla reciprocità",
    text: "Il match arriva solo quando l'interesse è reciproco. Da lì può iniziare una conversazione reale.",
  },
];

function hasProfileSignal(profile) {
  const interests = Array.isArray(profile?.interessi)
    ? profile.interessi.filter(Boolean)
    : String(profile?.interessi || "").trim();

  return Boolean(
    String(profile?.nome || "").trim() &&
      String(profile?.bio || "").trim().length >= 20 &&
      interests &&
      (profile?.foto_url || profile?.avatar_url)
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    loading: true,
    isAuthed: false,
    tier: "free",
    profile: null,
  });

  useEffect(() => {
    let alive = true;

    loadCurrentAccountTier()
      .then((result) => {
        if (!alive) return;
        setAccount({
          loading: false,
          isAuthed: Boolean(result?.isAuthed),
          tier: result?.tier || "free",
          profile: result?.profile || null,
        });
      })
      .catch(() => {
        if (!alive) return;
        setAccount({ loading: false, isAuthed: false, tier: "free", profile: null });
      });

    return () => {
      alive = false;
    };
  }, []);

  const profileReady = useMemo(
    () => hasProfileSignal(account.profile),
    [account.profile]
  );

  const displayName = String(account.profile?.nome || "").trim();

  const hero = useMemo(() => {
    if (account.loading) {
      return {
        eyebrow: "LoveMatch360",
        title: "Stiamo preparando il tuo spazio.",
        description: "Un istante per riconoscere il percorso giusto.",
        primary: "Attendi…",
        primaryRoute: null,
        secondary: null,
        secondaryRoute: null,
      };
    }

    if (!account.isAuthed) {
      return {
        eyebrow: "Relazioni con più contesto",
        title: "Non devi sapere cosa stai cercando. Qui iniziamo da te.",
        description:
          "LoveMatch360 è uno spazio per presentarti meglio, scoprire persone con calma e lasciare che l'interesse diventi reciproco senza rumore.",
        primary: "Crea il tuo spazio",
        primaryRoute: "/register",
        secondary: "Scopri come funziona",
        secondaryRoute: "/welcome",
      };
    }

    if (account.tier === "admin") {
      return {
        eyebrow: "Regia LoveMatch360",
        title: displayName ? `${displayName}, il progetto è nelle tue mani.` : "Il progetto è nelle tue mani.",
        description:
          "Controlla il sistema oppure attraversa il percorso come una persona reale: ogni dettaglio deve meritare il prossimo passo.",
        primary: "Apri la regia",
        primaryRoute: "/admin",
        secondary: "Prova Scopri persone",
        secondaryRoute: "/scopri-profili",
      };
    }

    if (!profileReady) {
      return {
        eyebrow: "Il tuo primo passo",
        title: displayName ? `${displayName}, fatti riconoscere prima di farti trovare.` : "Fatti riconoscere prima di farti trovare.",
        description:
          "Completa nome, bio, interessi e foto. Bastano pochi minuti per trasformare un account in una presenza autentica.",
        primary: "Completa il profilo",
        primaryRoute: "/profilo",
        secondary: "Vedi il percorso",
        secondaryRoute: "/welcome",
      };
    }

    return {
      eyebrow: "Il tuo spazio è pronto",
      title: displayName ? `${displayName}, ora puoi incontrare ciò che non avevi previsto.` : "Ora puoi incontrare ciò che non avevi previsto.",
      description:
        "Il profilo racconta già qualcosa di te. Entra in Scopri persone, osserva con cura e lascia che il prossimo gesto abbia un significato.",
      primary: "Scopri persone",
      primaryRoute: "/scopri-profili",
      secondary: "I tuoi match",
      secondaryRoute: "/match",
    };
  }, [account, displayName, profileReady]);

  function go(path, action) {
    if (!path) return;
    track("home_cta", { action }).catch(() => {});
    navigate(path);
  }

  return (
    <div className="lm-home">
      <style>{`
        .lm-home {
          --rose: #f08fc0;
          --rose-soft: #ffd6ea;
          --sky: #8ddcff;
          --ink: #07080d;
          --panel: rgba(19, 20, 29, 0.84);
          color: #f8fafc;
          padding: 8px 0 36px;
        }

        .lm-home * { box-sizing: border-box; }

        .lm-home-hero {
          position: relative;
          overflow: hidden;
          min-height: 620px;
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(310px, 0.85fr);
          gap: 24px;
          align-items: center;
          padding: clamp(28px, 6vw, 72px);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 32px;
          background:
            radial-gradient(circle at 84% 16%, rgba(141,220,255,.22), transparent 30%),
            radial-gradient(circle at 18% 82%, rgba(240,143,192,.20), transparent 34%),
            linear-gradient(145deg, #11121a 0%, #090a10 60%, #11101a 100%);
          box-shadow: 0 32px 90px rgba(0,0,0,.38);
        }

        .lm-home-hero::after {
          content: "";
          position: absolute;
          width: 360px;
          height: 360px;
          right: -120px;
          bottom: -180px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.1);
          box-shadow: 0 0 0 56px rgba(255,255,255,.018), 0 0 0 112px rgba(255,255,255,.012);
          pointer-events: none;
        }

        .lm-home-copy { position: relative; z-index: 1; max-width: 760px; }

        .lm-home-eyebrow {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding: 0 13px;
          border: 1px solid rgba(240,143,192,.3);
          border-radius: 999px;
          color: var(--rose-soft);
          background: rgba(240,143,192,.09);
          font-size: .76rem;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .lm-home h1 {
          max-width: 13ch;
          margin: 22px 0 0;
          color: #fff;
          font-size: clamp(2.75rem, 7vw, 6.4rem);
          line-height: .94;
          letter-spacing: -.065em;
          text-wrap: balance;
        }

        .lm-home-lead {
          max-width: 62ch;
          margin: 24px 0 0;
          color: rgba(248,250,252,.82);
          font-size: clamp(1.05rem, 2vw, 1.28rem);
          line-height: 1.72;
        }

        .lm-home-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .lm-home-button {
          min-height: 52px;
          padding: 0 21px;
          border-radius: 16px;
          font: inherit;
          font-weight: 900;
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
        }

        .lm-home-button:hover { transform: translateY(-2px); }
        .lm-home-button:focus-visible { outline: 3px solid var(--sky); outline-offset: 3px; }
        .lm-home-button:disabled { cursor: wait; opacity: .6; transform: none; }

        .lm-home-button--primary {
          border: 0;
          color: #180d14;
          background: linear-gradient(135deg, #ffd6ea, var(--rose));
          box-shadow: 0 14px 34px rgba(240,143,192,.22);
        }

        .lm-home-button--secondary {
          border: 1px solid rgba(255,255,255,.18);
          color: #fff;
          background: rgba(255,255,255,.055);
        }

        .lm-home-proof {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 12px;
          align-content: center;
        }

        .lm-home-proof-card {
          padding: 21px;
          border: 1px solid rgba(255,255,255,.11);
          border-radius: 22px;
          background: rgba(5,7,12,.46);
          backdrop-filter: blur(10px);
        }

        .lm-home-proof-card strong {
          display: block;
          color: #fff;
          font-size: 1.05rem;
        }

        .lm-home-proof-card span {
          display: block;
          margin-top: 7px;
          color: rgba(248,250,252,.68);
          line-height: 1.55;
        }

        .lm-home-section {
          padding: clamp(48px, 8vw, 88px) 8px 0;
        }

        .lm-home-section-head {
          max-width: 760px;
          margin-bottom: 24px;
        }

        .lm-home-section-head p {
          margin: 10px 0 0;
          color: rgba(248,250,252,.68);
          line-height: 1.65;
        }

        .lm-home h2 {
          margin: 0;
          color: #fff;
          font-size: clamp(1.9rem, 4vw, 3.2rem);
          letter-spacing: -.035em;
          line-height: 1.05;
        }

        .lm-home-journey {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .lm-home-step {
          min-height: 260px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 24px;
          background: linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.025));
        }

        .lm-home-step-number {
          color: var(--rose);
          font-size: .78rem;
          font-weight: 900;
          letter-spacing: .14em;
        }

        .lm-home-step h3 {
          margin: 54px 0 0;
          color: #fff;
          font-size: 1.35rem;
          line-height: 1.15;
        }

        .lm-home-step p {
          margin: 14px 0 0;
          color: rgba(248,250,252,.7);
          line-height: 1.65;
        }

        .lm-home-callout {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
          margin-top: clamp(48px, 8vw, 88px);
          padding: clamp(25px, 5vw, 46px);
          border: 1px solid rgba(141,220,255,.18);
          border-radius: 28px;
          background: linear-gradient(135deg, rgba(141,220,255,.09), rgba(240,143,192,.08));
        }

        .lm-home-callout p {
          max-width: 66ch;
          margin: 12px 0 0;
          color: rgba(248,250,252,.72);
          line-height: 1.65;
        }

        @media (max-width: 820px) {
          .lm-home-hero {
            min-height: auto;
            grid-template-columns: 1fr;
            padding: 32px 22px;
            border-radius: 24px;
          }

          .lm-home h1 { max-width: 15ch; }
          .lm-home-proof { grid-template-columns: 1fr; }
          .lm-home-journey { grid-template-columns: 1fr; }
          .lm-home-step { min-height: 0; }
          .lm-home-step h3 { margin-top: 28px; }
          .lm-home-callout { grid-template-columns: 1fr; }
        }

        @media (prefers-reduced-motion: reduce) {
          .lm-home-button { transition: none; }
        }
      `}</style>

      <section className="lm-home-hero" aria-labelledby="home-title">
        <div className="lm-home-copy">
          <span className="lm-home-eyebrow">{hero.eyebrow}</span>
          <h1 id="home-title">{hero.title}</h1>
          <p className="lm-home-lead">{hero.description}</p>

          <div className="lm-home-actions">
            <button
              type="button"
              className="lm-home-button lm-home-button--primary"
              disabled={account.loading}
              onClick={() => go(hero.primaryRoute, "primary")}
            >
              {hero.primary}
            </button>

            {hero.secondary ? (
              <button
                type="button"
                className="lm-home-button lm-home-button--secondary"
                onClick={() => go(hero.secondaryRoute, "secondary")}
              >
                {hero.secondary}
              </button>
            ) : null}
          </div>
        </div>

        <aside className="lm-home-proof" aria-label="Principi LoveMatch360">
          <div className="lm-home-proof-card">
            <strong>Prima la persona</strong>
            <span>Il profilo serve a farti capire, non a ridurti a una fotografia.</span>
          </div>
          <div className="lm-home-proof-card">
            <strong>Scelte meno casuali</strong>
            <span>Bio e interessi danno contesto prima del like.</span>
          </div>
          <div className="lm-home-proof-card">
            <strong>Reciprocità visibile</strong>
            <span>Il match nasce soltanto quando l'interesse si incontra.</span>
          </div>
        </aside>
      </section>

      <section className="lm-home-section" aria-labelledby="journey-title">
        <div className="lm-home-section-head">
          <h2 id="journey-title">Non più swipe. Un percorso.</h2>
          <p>
            LoveMatch360 non promette chimica a comando. Costruisce condizioni migliori
            perché una connessione possa cominciare.
          </p>
        </div>

        <div className="lm-home-journey">
          {journey.map((step) => (
            <article className="lm-home-step" key={step.number}>
              <span className="lm-home-step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lm-home-callout" aria-labelledby="resources-title">
        <div>
          <h2 id="resources-title">Anche quando non cerchi un match, puoi trovare valore.</h2>
          <p>
            Idee, messaggi, articoli e metodo: risorse pubbliche per capire meglio relazioni,
            presenza digitale e scelte quotidiane.
          </p>
        </div>
        <button
          type="button"
          className="lm-home-button lm-home-button--secondary"
          onClick={() => go("/scopri", "resources")}
        >
          Esplora le risorse
        </button>
      </section>
    </div>
  );
}
