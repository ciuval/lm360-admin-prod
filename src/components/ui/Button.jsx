import React from 'react';

/**
 * Button UI
 * Props:
 *  - variant: "primary" | "secondary" | "ghost"
 *  - disabled, onClick, type, children, className, style
 */
export default function Button({ variant = 'primary', className = '', style = {}, ...rest }) {
  const base = {
    borderRadius: 10,
    padding: '8px 14px',
    border: '1px solid rgba(255,255,255,.12)',
    fontSize: 14,
    cursor: 'pointer',
    background: 'rgba(15,23,42,0.9)',
    color: '#e5e7eb',
  };

  const variants = {
    primary: {
      background: 'linear-gradient(90deg,#7c3aed,#6366f1)',
      borderColor: 'transparent',
      color: '#fff',
    },
    secondary: {
      background: 'transparent',
      borderColor: 'rgba(148,163,184,.6)',
    },
    ghost: {
      background: 'transparent',
      borderColor: 'transparent',
    },
  };

  const styles = { ...base, ...(variants[variant] || {}), ...style };

  return <button className={`btn ${className}`.trim()} style={styles} {...rest} />;
}
