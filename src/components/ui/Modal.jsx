import { getJson, setJson } from '../lib/storage';
import React, { useEffect, useId } from 'react';

/** Modal accessibile (ESC chiude, click backdrop chiude) */
export default function Modal({ open, onClose, title, children, footer, className = '' }) {
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="ui-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <section
        className={`ui-modal ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`m-title-${id}`}
      >
        <header id={`m-title-${id}`}>{title}</header>
        <div className="ui-modal-body">{children}</div>
        <footer>{footer}</footer>
      </section>
    </div>
  );
}
