import { getJson, setJson } from '../lib/storage';
export default function Loader() {
  return (
    <div role="status" aria-label="Caricamento" style={{ padding: 16 }}>
      <div
        style={{
          width: 24,
          height: 24,
          border: '3px solid #1f2937',
          borderTop: '3px solid #60a5fa',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto',
        }}
      />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
