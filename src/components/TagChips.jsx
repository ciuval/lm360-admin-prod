import { getJson, setJson } from '../lib/storage';
export default function TagChips({ tags = [], onClick }) {
  if (!tags.length) return null;
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
      {tags.map((t) => (
        <button
          key={t}
          onClick={() => onClick?.(t)}
          aria-label={`Tag ${t}`}
          style={{
            padding: '4px 8px',
            borderRadius: 9999,
            border: '1px solid #1f2937',
            background: '#0b1220',
            color: '#e5e7eb',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          #{t}
        </button>
      ))}
    </div>
  );
}
