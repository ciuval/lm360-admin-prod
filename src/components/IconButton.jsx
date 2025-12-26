import { getJson, setJson } from '../lib/storage';
// src/components/IconButton.jsx
export default function IconButton({ label, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 ring-offset-2 ring-primary ring-offset-dark ${className}`}
    >
      {children}
    </button>
  );
}
