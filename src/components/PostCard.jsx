import React from "react";

export default function PostCard({ post = {} }) {
  const {
    title = "Senza titolo",
    excerpt,
    summary,
    image_url,
    created_at,
  } = post;

  const card = {
    background: "#12161b",
    border: "1px solid #1e252d",
    borderRadius: 12,
    padding: 12,
  };

  return (
    <article style={card} aria-label={title}>
      {image_url && (
        <img
          src={image_url}
          alt={title ? `Immagine: ${title}` : "Immagine del post"}
          loading="lazy"
          style={{ width: "100%", height: "auto", borderRadius: 8, marginBottom: 10 }}
        />
      )}
      <h3 style={{ margin: "0 0 6px" }}>{title}</h3>
      <p style={{ opacity: 0.85, margin: 0 }}>
        {excerpt ?? summary ?? ""}
      </p>
      {created_at && (
        <small style={{ opacity: 0.6, display: "block", marginTop: 8 }}>
          {new Date(created_at).toLocaleDateString()}
        </small>
      )}
    </article>
  );
}


