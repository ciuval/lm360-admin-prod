import { getJson, setJson } from '../lib/storage';
export default function BadgePremium({ scadenza }) {
  const active = !!scadenza;
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 24,
    padding: '0 10px',
    borderRadius: 999,
    background: active ? '#34d399' : '#555',
    color: '#111',
    fontWeight: 700,
  };
  const label = active
    ? `Premium attivo. Scade il: ${new Date(scadenza).toLocaleDateString()}`
    : 'Premium attivo';

  return (
    <span style={style} aria-label={label} title={label}>
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#111" d="M12 2l3 7h7l-5.7 4.1L18.6 21 12 16.8 5.4 21l2.3-7.9L2 9h7z" />
      </svg>
      Premium
    </span>
  );
}
