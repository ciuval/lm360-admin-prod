import React from 'react';

/**
 * Card UI semplice, riutilizzabile.
 * Props:
 *  - padding: "sm" | "md" | "lg"
 *  - elevation: 0 | 1 | 2
 */
export default function Card({ children, padding = 'md', elevation = 0, style = {}, ...rest }) {
  const pad = padding === 'lg' ? 24 : padding === 'sm' ? 8 : 16;

  const shadow =
    elevation === 2
      ? '0 16px 40px rgba(0,0,0,.45)'
      : elevation === 1
        ? '0 10px 24px rgba(0,0,0,.35)'
        : 'none';

  return (
    <section
      className="card"
      style={{
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,.08)',
        background: 'rgba(15,23,42,0.9)',
        padding: pad,
        boxShadow: shadow,
        ...style,
      }}
      {...rest}
    >
      {children}
    </section>
  );
}

Card.Header = function CardHeader({ title, subtitle }) {
  return (
    <header style={{ marginBottom: 8 }}>
      {title && <h2 style={{ fontSize: '1.1rem', margin: 0 }}>{title}</h2>}
      {subtitle && (
        <p
          style={{
            margin: 0,
            fontSize: 13,
            opacity: 0.75,
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
};

Card.Body = function CardBody({ children }) {
  return <div>{children}</div>;
};

Card.Footer = function CardFooter({ children }) {
  return <footer style={{ marginTop: 12 }}>{children}</footer>;
};
