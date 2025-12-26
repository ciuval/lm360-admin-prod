import { useEffect, useRef, useState } from 'react';

// Debounced autosave.
// usage: const { saving, error } = useAutoSave(values, async (v)=>{...}, 700);
export function useAutoSave(values, onSave, delay = 700) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const firstRunRef = useRef(true);
  const prevJSONRef = useRef(JSON.stringify(values));
  const latestValuesRef = useRef(values);
  const latestSaveRef = useRef(onSave);

  useEffect(() => { latestSaveRef.current = onSave; }, [onSave]);
  useEffect(() => { latestValuesRef.current = values; }, [values]);

  useEffect(() => {
    const curr = JSON.stringify(values);

    // 1) salta il primo render
    if (firstRunRef.current) {
      firstRunRef.current = false;
      prevJSONRef.current = curr;
      return;
    }
    // 2) niente richieste se non è cambiato nulla
    if (prevJSONRef.current === curr) return;
    prevJSONRef.current = curr;

    // 3) debounce
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        setSaving(true);
        setError(null);
        await latestSaveRef.current(latestValuesRef.current);
      } catch (e) {
        setError(e);
        try {
          // niente PII
          window.dispatchEvent(new CustomEvent('toast:show', {
            detail: { kind: 'err', msg: 'Errore salvataggio' }
          }));
        } catch {}
      } finally {
        setSaving(false);
      }
    }, Math.max(100, delay));

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [values, delay]);

  return { saving, error };
}

export default useAutoSave;
