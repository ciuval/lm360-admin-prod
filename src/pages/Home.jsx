import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadCurrentAccountTier } from "../lib/accountTier";

const FACEBOOK_VIDEO_URL = "https://www.facebook.com/";

function createClickSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    const ctx = new AudioContextClass();

    return () => {
      try {
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(740, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.06);

        gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.09);
      } catch {
        // no-op
      }
    };
  } catch {
    return null;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [tier, setTier] = useState("free");
  const [profile, setProfile] = useState(null);

  const clickSoundRef = useRef(null);

  useEffect(() => {
    clickSoundRef.current = createClickSound();
  }, []);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);

        const result = await loadCurrentAccountTier();

        if (!alive) return;

        setIsAuthed(Boolean(result?.isAuthed));
        setTier(result?.tier || "free");
        setProfile(result?.profile || null);
      } catch {
        if (!alive) return;
        setIsAuthed(false);
        setTier("free");
        setProfile(null);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, []);

  const displayName = useMemo(() => {
    if (profile?.nome && String(profile.nome).trim()) return String(profile.nome).trim();
    return isAuthed ? "Bentornato" : "Benvenuto";
  }, [profile, isAuthed]);

  const heroContent = useMemo(() => {
    if (loading) {
      return {
        title: "LoveMatch360 sta accendendo il tuo spazio.",
        description:
          "Un attimo ancora: stiamo leggendo il tuo stato account per mostrarti il percorso giusto.",
        primaryLabel: "Attendi",
        secondaryLabel: "Home",
      };
    }

    if (!isAuthed) {
      return {
        title: "Connessioni vere, profili più umani, meno caos.",
        description:
          "LoveMatch360 è uno spazio collaborativo e relazionale: scopri, entra in contatto, costruisci presenza e muoviti con più chiarezza.",
        primaryLabel: "Accedi",
        secondaryLabel: "Guarda il video",
      };
    }

    if (tier === "admin") {
      return {
        title: `Ciao ${displayName}, il sistema è vivo.`,
        description:
          "Hai accesso amministrativo e una vista completa del progetto. Puoi orientarti subito, controllare i percorsi reali e tenere il sito sotto guida.",
        primaryLabel: "Apri Admin",
        secondaryLabel: "Vai al profilo",
      };
    }

    if (tier === "super") {
      return {
        title: `${displayName}, hai già il massimo accesso.`,
        description:
          "Il tuo profilo è attivo al livello più alto del flusso commerciale. Ora conta usare bene visibilità, scoperta e qualità della presenza.",
        primaryLabel: "Scopri i profili",
        secondaryLabel: "Vai al profilo",
      };
    }

    if (tier === "premium") {
      return {
        title: `${displayName}, il tuo Premium è acceso.`,
        description:
          "Hai già accesso alle funzioni sbloccate. Adesso il valore sta nel modo in cui usi scoperta, immagini, bio e presenza.",
        primaryLabel: "Scopri i profili",
        secondaryLabel: "Vai al profilo",
      };
    }

    return {
      title: `${displayName}, il tuo profilo può brillare molto di più.`,
      description:
        "Completa immagini, bio e interessi. Entra in scoperta e costruisci un percorso più vivo, più chiaro e più attraente.",
      primaryLabel: "Scopri i profili",
      secondaryLabel: "Diventa Premium",
    };
  }, [loading, isAuthed, tier, displayName]);

  const statusLabel = useMemo(() => {
    if (loading) return "Caricamento stato account...";
    if (!isAuthed) return "Accesso ospite";
    if (tier === "admin") return "Account admin attivo";
    if (tier === "super") return "Account super attivo";
    if (tier === "premium") return "Account premium attivo";
    return "Account base attivo";
  }, [loading, isAuthed, tier]);

  const profileImage = useMemo(() => {
    return profile?.foto_url || profile?.avatar_url || null;
  }, [profile]);

  const playClick = () => {
    clickSoundRef.current?.();
  };

  const go = (path) => {
    playClick();
    navigate(path);
  };

  const openExternal = (url) => {
    playClick();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handlePrimary = () => {
    if (loading) return;

    if (!isAuthed) {
      go("/login");
      return;
    }

    if (tier === "admin") {
      go("/admin");
      return;
    }

    go("/scopri");
  };

  const handleSecondary = () => {
    if (loading) return;

    if (!isAuthed) {
      openExternal(FACEBOOK_VIDEO_URL);
      return;
    }

    if (tier === "admin" || tier === "premium" || tier === "super") {
      go("/profilo");
      return;
    }

    go("/premium");
  };

  return (
    <section style={pageStyle}>
      <div style={heroGridStyle}>
        <div style={heroTextCardStyle}>
          <span style={eyebrowStyle}>LoveMatch360 · progetto vivo</span>

          <h1 style={titleStyle}>{heroContent.title}</h1>

          <p style={descriptionStyle}>{heroContent.description}</p>

          <div style={actionsStyle}>
            <button
              type="button"
              style={primaryButtonStyle}
              onClick={handlePrimary}
              disabled={loading}
            >
              {heroContent.primaryLabel}
            </button>

            <button
              type="button"
              style={secondaryButtonStyle}
              onClick={handleSecondary}
              disabled={loading}
            >
              {heroContent.secondaryLabel}
            </button>
          </div>

          <div style={statusRowStyle}>
            <span style={statusBadgeStyle}>{statusLabel}</span>
            <span style={mutedInlineStyle}>Sai sempre dove sei e cosa puoi fare davvero.</span>
          </div>
        </div>

        <div style={identityPanelStyle}>
          <div style={identityHeroStyle}>
            {profileImage ? (
              <img
                src={profileImage}
                alt={displayName}
                style={identityImageStyle}
              />
            ) : (
              <div style={identityPlaceholderStyle}>💖</div>
            )}

            <div style={identityCopyStyle}>
              <div style={identityKickerStyle}>Il tuo spazio</div>
              <div style={identityNameStyle}>{displayName}</div>
              <div style={identityMetaStyle}>
                {isAuthed
                  ? "Profilo vivo, presenza modificabile, accesso reale."
                  : "Entra per costruire il tuo profilo e iniziare il percorso."}
              </div>
            </div>
          </div>

          <div style={quickGridStyle}>
            <button type="button" style={quickCardStyle} onClick={() => go("/profilo")}>
              <span style={quickTitleStyle}>Profilo</span>
              <span style={quickTextStyle}>Foto, bio, interessi e identità.</span>
            </button>

            <button type="button" style={quickCardStyle} onClick={() => go("/scopri")}>
              <span style={quickTitleStyle}>Scopri</span>
              <span style={quickTextStyle}>Profili pubblici, like e incontri.</span>
            </button>

            <button type="button" style={quickCardStyle} onClick={() => go("/premium")}>
              <span style={quickTitleStyle}>Premium</span>
              <span style={quickTextStyle}>Valore, accesso e percorso chiaro.</span>
            </button>

            <button type="button" style={quickCardStyle} onClick={() => openExternal(FACEBOOK_VIDEO_URL)}>
              <span style={quickTitleStyle}>Video Facebook</span>
              <span style={quickTextStyle}>Apri il video esterno del progetto.</span>
            </button>
          </div>
        </div>
      </div>

      <div style={infoGridStyle}>
        <article style={infoCardStyle}>
          <h2 style={cardTitleStyle}>Chi siamo</h2>
          <p style={cardTextStyle}>
            Un sito relazionale e collaborativo: più umano, più diretto, meno tecnico da sentire,
            più chiaro da vivere.
          </p>
        </article>

        <article style={infoCardStyle}>
          <h2 style={cardTitleStyle}>Dove puoi andare</h2>
          <p style={cardTextStyle}>
            Profilo, Scopri, Premium, Billing, Admin: solo percorsi vivi. Niente pulsanti fantasma,
            niente strade senza uscita.
          </p>
        </article>

        <article style={infoCardStyle}>
          <h2 style={cardTitleStyle}>Come si usa</h2>
          <p style={cardTextStyle}>
            Entri, sistemi il profilo, scopri persone, metti like, crei match e costruisci una
            presenza più forte nel tempo.
          </p>
        </article>
      </div>
    </section>
  );
}

const pageStyle = {
  padding: "20px 16px 40px",
};

const heroGridStyle = {
  maxWidth: "1180px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.25fr) minmax(320px, 0.95fr)",
  gap: "16px",
};

const heroTextCardStyle = {
  padding: "28px 24px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(28,28,34,0.96) 0%, rgba(16,16,22,0.96) 100%)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.24)",
};

const eyebrowStyle = {
  display: "inline-block",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.62)",
  fontWeight: 800,
};

const titleStyle = {
  margin: "12px 0 0",
  color: "#f08fc0",
  fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
  lineHeight: 1.02,
};

const descriptionStyle = {
  marginTop: "18px",
  marginBottom: 0,
  color: "rgba(255,255,255,0.88)",
  fontSize: "1.16rem",
  lineHeight: 1.85,
  maxWidth: "64ch",
};

const actionsStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "24px",
};

const primaryButtonStyle = {
  padding: "15px 22px",
  border: "none",
  borderRadius: "14px",
  backgroundColor: "#e48abb",
  color: "#111111",
  fontWeight: 800,
  fontSize: "1rem",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "15px 22px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.05)",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
};

const statusRowStyle = {
  marginTop: "18px",
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  alignItems: "center",
};

const statusBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 34,
  padding: "0 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.10)",
  color: "#ffffff",
  fontWeight: 700,
};

const mutedInlineStyle = {
  color: "rgba(255,255,255,0.66)",
  fontSize: "0.95rem",
};

const identityPanelStyle = {
  display: "grid",
  gap: "16px",
};

const identityHeroStyle = {
  padding: "18px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  boxShadow: "0 18px 36px rgba(0,0,0,0.22)",
};

const identityImageStyle = {
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "cover",
  borderRadius: "22px",
  display: "block",
};

const identityPlaceholderStyle = {
  width: "100%",
  aspectRatio: "1 / 1",
  borderRadius: "22px",
  display: "grid",
  placeItems: "center",
  fontSize: "4rem",
  background: "linear-gradient(180deg, rgba(240,143,192,0.18), rgba(125,211,252,0.10))",
  border: "1px solid rgba(255,255,255,0.08)",
};

const identityCopyStyle = {
  marginTop: "14px",
};

const identityKickerStyle = {
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.62)",
  fontWeight: 800,
};

const identityNameStyle = {
  marginTop: "8px",
  fontSize: "1.7rem",
  fontWeight: 900,
  color: "#ffffff",
  lineHeight: 1.08,
};

const identityMetaStyle = {
  marginTop: "10px",
  color: "rgba(255,255,255,0.76)",
  lineHeight: 1.7,
};

const quickGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
};

const quickCardStyle = {
  textAlign: "left",
  padding: "16px",
  borderRadius: "18px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
  color: "#ffffff",
  cursor: "pointer",
};

const quickTitleStyle = {
  display: "block",
  fontWeight: 800,
  fontSize: "1rem",
};

const quickTextStyle = {
  display: "block",
  marginTop: "8px",
  color: "rgba(255,255,255,0.70)",
  lineHeight: 1.55,
  fontSize: "0.94rem",
};

const infoGridStyle = {
  maxWidth: "1180px",
  margin: "16px auto 0",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "16px",
};

const infoCardStyle = {
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
};

const cardTitleStyle = {
  margin: 0,
  color: "#ffffff",
  fontSize: "1.15rem",
};

const cardTextStyle = {
  marginTop: "12px",
  marginBottom: 0,
  color: "rgba(255,255,255,0.78)",
  lineHeight: 1.75,
};