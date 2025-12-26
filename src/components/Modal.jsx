import { getJson, setJson } from '../lib/storage';
// src/components/Modal.jsx
import React, { useEffect, useRef } from 'react';

export default function Modal({ open, title = 'Finestra', onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const root = ref.current;
    const focusables = root.querySelectorAll(
      'a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0],
      last = focusables[focusables.length - 1];
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'Tab' && focusables.length) {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    first?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div ref={ref} className="bg-zinc-950 text-light rounded-xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-xl font-bold">
            {title}
          </h2>
          <button
            aria-label="Chiudi finestra"
            onClick={onClose}
            className="px-2 py-1 rounded hover:bg-zinc-800 focus-visible:ring-2 ring-primary"
          >
            âœ•
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
