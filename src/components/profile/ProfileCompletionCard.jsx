import React from "react";

export default function ProfileCompletionCard({ completion, disabled = false, onPrimaryAction }) {
  const safeCompletion = completion || {
    score: 0,
    completedCount: 0,
    totalCount: 4,
    isComplete: false,
    items: [],
    missingItems: [],
  };

  const title = safeCompletion.isComplete
    ? "Profilo completo. Ora puoi farti trovare meglio."
    : "Completa il profilo per sbloccare più valore.";

  const subtitle = safeCompletion.isComplete
    ? "Hai le basi giuste per entrare in Scopri con più contesto."
    : "Nome, bio, interessi e foto aiutano le altre persone a capire chi sei davvero.";

  const actionLabel = safeCompletion.isComplete ? "Vai a Scopri" : "Completa il prossimo passo";

  return (
    <section style={cardStyle} aria-labelledby="profile-completion-title">
      <div style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>Onboarding profilo</p>
          <h3 id="profile-completion-title" style={titleStyle}>
            {title}
          </h3>
          <p style={subtitleStyle}>{subtitle}</p>
        </div>

        <div style={scoreBoxStyle} aria-label={`Profilo completato al ${safeCompletion.score}%`}>
          <strong style={scoreStyle}>{safeCompletion.score}%</strong>
          <span style={scoreLabelStyle}>completo</span>
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeCompletion.score}
        aria-label="Avanzamento completamento profilo"
        style={progressTrackStyle}
      >
        <div style={{ ...progressBarStyle, width: `${safeCompletion.score}%` }} />
      </div>

      <ul style={checklistStyle} aria-label="Checklist completamento profilo">
        {safeCompletion.items.map((item) => (
          <li key={item.key} style={checkItemStyle}>
            <span
              aria-hidden="true"
              style={{
                ...checkIconStyle,
                ...(item.completed ? checkIconDoneStyle : checkIconTodoStyle),
              }}
            >
              {item.completed ? "✓" : "•"}
            </span>
            <span>
              <strong>{item.label}</strong>
              <br />
              <span style={itemDescriptionStyle}>{item.description}</span>
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onPrimaryAction}
        disabled={disabled}
        style={{
          ...buttonStyle,
          ...(disabled ? disabledButtonStyle : {}),
        }}
      >
        {actionLabel}
      </button>
    </section>
  );
}

const cardStyle = {
  border: "1px solid rgba(240, 143, 192, 0.32)",
  borderRadius: "24px",
  padding: "1.25rem",
  margin: "1.5rem 0",
  background: "linear-gradient(180deg, rgba(240, 143, 192, 0.14), rgba(255, 255, 255, 0.035))",
  boxShadow: "0 18px 60px rgba(0,0,0,0.28)",
};

const headerStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle = {
  margin: "0 0 0.35rem",
  color: "#f3b4d4",
  fontSize: "0.74rem",
  fontWeight: 900,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const titleStyle = {
  margin: 0,
  color: "#fff",
  fontSize: "1.25rem",
  lineHeight: 1.25,
};

const subtitleStyle = {
  margin: "0.6rem 0 0",
  color: "#d7d7e3",
  lineHeight: 1.55,
};

const scoreBoxStyle = {
  minWidth: "88px",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: "18px",
  padding: "0.75rem",
  textAlign: "center",
  backgroundColor: "rgba(0,0,0,0.22)",
};

const scoreStyle = {
  display: "block",
  color: "#f08fc0",
  fontSize: "1.45rem",
  lineHeight: 1,
};

const scoreLabelStyle = {
  display: "block",
  marginTop: "0.25rem",
  color: "#c9c9d6",
  fontSize: "0.78rem",
};

const progressTrackStyle = {
  height: "10px",
  margin: "1rem 0",
  borderRadius: "999px",
  overflow: "hidden",
  backgroundColor: "rgba(255,255,255,0.12)",
};

const progressBarStyle = {
  height: "100%",
  borderRadius: "999px",
  backgroundColor: "#f08fc0",
  transition: "width 220ms ease",
};

const checklistStyle = {
  display: "grid",
  gap: "0.8rem",
  margin: "0 0 1rem",
  padding: 0,
  listStyle: "none",
};

const checkItemStyle = {
  display: "grid",
  gridTemplateColumns: "28px 1fr",
  gap: "0.75rem",
  alignItems: "start",
  color: "#fff",
};

const checkIconStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "999px",
  display: "inline-grid",
  placeItems: "center",
  fontWeight: 900,
};

const checkIconDoneStyle = {
  color: "#07120b",
  backgroundColor: "#86efac",
};

const checkIconTodoStyle = {
  color: "#f08fc0",
  backgroundColor: "rgba(240, 143, 192, 0.15)",
};

const itemDescriptionStyle = {
  color: "#c9c9d6",
  fontSize: "0.92rem",
};

const buttonStyle = {
  width: "100%",
  border: "none",
  borderRadius: "16px",
  padding: "0.9rem 1rem",
  cursor: "pointer",
  fontWeight: 900,
  backgroundColor: "#f08fc0",
  color: "#050508",
};

const disabledButtonStyle = {
  opacity: 0.58,
  cursor: "wait",
};
