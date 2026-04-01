import React from "react";

const MAX_PHOTOS = 5;

export default function ProfilePhotoGallery({
  photos = [],
  onSetPrimary,
  onRemove,
  onAdd,
  disabled = false,
}) {
  const normalizedPhotos = Array.isArray(photos) ? photos.slice(0, MAX_PHOTOS) : [];
  const primaryPhoto =
    normalizedPhotos.find((photo) => photo?.isPrimary) || normalizedPhotos[0] || null;

  const secondaryPhotos = normalizedPhotos
    .filter((photo) => primaryPhoto && photo.id !== primaryPhoto.id)
    .slice(0, MAX_PHOTOS - 1);

  return (
    <section style={sectionStyle} aria-labelledby="profile-gallery-title">
      <div style={headerRowStyle}>
        <div>
          <h3 id="profile-gallery-title" style={titleStyle}>
            Foto profilo
          </h3>
          <p style={subtitleStyle}>
            Le tue immagini devono parlare bene di te, senza rumore e senza spazi morti.
          </p>
        </div>

        <div style={counterBadgeStyle}>
          {normalizedPhotos.length}/{MAX_PHOTOS}
        </div>
      </div>

      {primaryPhoto ? (
        <div style={mainGridStyle}>
          <div style={heroWrapStyle}>
            <div style={heroCardStyle}>
              <img
                src={primaryPhoto.url}
                alt={primaryPhoto.alt || "Foto principale del profilo"}
                style={heroImageStyle}
              />

              <div style={heroOverlayStyle}>
                <span style={primaryBadgeStyle}>Principale</span>

                <div style={heroActionsStyle}>
                  <button
                    type="button"
                    style={{
                      ...overlayButtonStyle,
                      ...(disabled ? disabledButtonStyle : null),
                    }}
                    onClick={() => onRemove?.(primaryPhoto.id)}
                    disabled={disabled}
                  >
                    Rimuovi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {secondaryPhotos.length > 0 ? (
            <div style={thumbsWrapStyle}>
              {secondaryPhotos.map((photo, index) => (
                <div key={photo.id || `${photo.url}-${index}`} style={thumbCardStyle}>
                  <button
                    type="button"
                    style={thumbImageButtonStyle}
                    onClick={() => onSetPrimary?.(photo.id)}
                    disabled={disabled}
                    aria-label="Imposta come foto principale"
                  >
                    <img
                      src={photo.url}
                      alt={photo.alt || `Foto secondaria ${index + 1}`}
                      style={thumbImageStyle}
                    />
                  </button>

                  <div style={thumbMetaStyle}>
                    <button
                      type="button"
                      style={{
                        ...thumbActionStyle,
                        ...(disabled ? disabledButtonStyle : null),
                      }}
                      onClick={() => onSetPrimary?.(photo.id)}
                      disabled={disabled}
                    >
                      Metti al centro
                    </button>

                    <button
                      type="button"
                      style={{
                        ...thumbDangerStyle,
                        ...(disabled ? disabledButtonStyle : null),
                      }}
                      onClick={() => onRemove?.(photo.id)}
                      disabled={disabled}
                    >
                      Rimuovi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {!primaryPhoto ? (
        <div style={emptyGalleryStyle}>
          <p style={emptyTextStyle}>
            Nessuna foto caricata ancora. Appena ne aggiungi una, qui comparirà la tua immagine principale.
          </p>
          <button
            type="button"
            style={{
              ...addFirstButtonStyle,
              ...(disabled ? disabledButtonStyle : null),
            }}
            onClick={() => onAdd?.()}
            disabled={disabled}
          >
            Carica la prima foto
          </button>
        </div>
      ) : null}

      <p style={footerNoteStyle}>
        Mostriamo solo ciò che esiste davvero: il profilo deve sembrare vivo, non incompleto.
      </p>
    </section>
  );
}

const sectionStyle = {
  marginTop: "1.5rem",
  padding: "1.25rem",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
};

const headerRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  flexWrap: "wrap",
};

const titleStyle = {
  margin: 0,
  fontSize: "1.2rem",
  color: "#fff",
};

const subtitleStyle = {
  margin: "0.45rem 0 0",
  color: "rgba(255,255,255,0.72)",
  lineHeight: 1.6,
  maxWidth: "62ch",
};

const counterBadgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 34,
  minWidth: 54,
  padding: "0 12px",
  borderRadius: 999,
  background: "rgba(240,143,192,0.14)",
  border: "1px solid rgba(240,143,192,0.25)",
  color: "#ffd7ea",
  fontWeight: 800,
};

const mainGridStyle = {
  marginTop: "1rem",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.6fr) minmax(260px, 1fr)",
  gap: "1rem",
};

const heroWrapStyle = {
  minWidth: 0,
};

const heroCardStyle = {
  position: "relative",
  minHeight: 420,
  borderRadius: "22px",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
};

const heroImageStyle = {
  width: "100%",
  height: "100%",
  minHeight: 420,
  objectFit: "cover",
  display: "block",
  transform: "scale(1.02)",
};

const heroOverlayStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "14px",
  background:
    "linear-gradient(180deg, rgba(5,7,11,0.22) 0%, rgba(5,7,11,0.02) 35%, rgba(5,7,11,0.38) 100%)",
};

const primaryBadgeStyle = {
  alignSelf: "flex-start",
  display: "inline-flex",
  alignItems: "center",
  minHeight: 34,
  padding: "0 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.16)",
  border: "1px solid rgba(255,255,255,0.20)",
  color: "#ffffff",
  fontWeight: 800,
  backdropFilter: "blur(10px)",
};

const heroActionsStyle = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
};

const overlayButtonStyle = {
  minHeight: 40,
  padding: "0 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(5,7,11,0.42)",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
  backdropFilter: "blur(10px)",
};

const thumbsWrapStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
  alignContent: "start",
};

const thumbCardStyle = {
  borderRadius: "16px",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
};

const thumbImageButtonStyle = {
  width: "100%",
  border: "none",
  padding: 0,
  background: "transparent",
  cursor: "pointer",
  display: "block",
};

const thumbImageStyle = {
  width: "100%",
  aspectRatio: "1 / 1",
  objectFit: "cover",
  display: "block",
};

const thumbMetaStyle = {
  display: "grid",
  gap: "8px",
  padding: "10px",
};

const thumbActionStyle = {
  minHeight: 38,
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};

const thumbDangerStyle = {
  minHeight: 38,
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(240,143,192,0.14)",
  color: "#ffd7ea",
  fontWeight: 700,
  cursor: "pointer",
};

const emptyGalleryStyle = {
  marginTop: "1rem",
  padding: "20px",
  borderRadius: "18px",
  border: "1px dashed rgba(255,255,255,0.16)",
  background: "rgba(255,255,255,0.02)",
  textAlign: "center",
};

const emptyTextStyle = {
  margin: 0,
  color: "rgba(255,255,255,0.72)",
  lineHeight: 1.7,
};

const addFirstButtonStyle = {
  marginTop: "14px",
  minHeight: 42,
  padding: "0 18px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(240,143,192,0.14)",
  color: "#ffd7ea",
  fontWeight: 800,
  cursor: "pointer",
};

const footerNoteStyle = {
  marginTop: "1rem",
  color: "rgba(255,255,255,0.64)",
  lineHeight: 1.6,
  fontSize: "0.95rem",
};

const disabledButtonStyle = {
  opacity: 0.6,
  cursor: "not-allowed",
};