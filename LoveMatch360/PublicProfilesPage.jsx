const AVATAR_FALLBACK = "/avatar.svg";

// ...
<img
  src={p.foto_url || AVATAR_FALLBACK}
  alt={p.nome || "Utente"}
  onError={(e) => { e.currentTarget.src = AVATAR_FALLBACK; }}
  style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
/>
