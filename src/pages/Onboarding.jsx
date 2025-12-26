import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTelemetry } from '../lib/telemetry';
import { getJson, setJson } from '../lib/storage';
import { supabase, currentUser } from '../lib/supabase';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const DRAFT_KEY = 'lm360_onboarding_v1';

const INITIAL = {
  display_name: '',
  bio: '',
  intent: '',
  interests: [],
  distance_km: 25,
  photo_url: '',
};

function calcScore(d) {
  let s = 0;
  if ((d.display_name || '').trim().length >= 2) s += 20;
  if ((d.bio || '').trim().length >= 80) s += 30;
  if (d.photo_url) s += 30;
  if (Array.isArray(d.interests) && d.interests.filter(Boolean).length >= 3) s += 10;
  if (d.intent) s += 10;
  return Math.min(100, s);
}

export default function Onboarding() {
  // Telemetria pagina
  useTelemetry('onboarding_view', { source: 'spa' }, []);

  const [draft, setDraft] = useState(INITIAL);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // calcolo score derivato
  const score = useMemo(() => calcScore(draft), [draft]);

  const saveTimerRef = useRef(null);

  // Carica bozza locale + profilo da Supabase
  useEffect(() => {
    try {
      const cached = getJson(DRAFT_KEY);
      if (cached && typeof cached === 'object') {
        setDraft({ ...INITIAL, ...cached });
      }
    } catch {
      // ignora
    }

    (async () => {
      try {
        const user = await currentUser();
        if (!user) return;
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name,bio,photo_url,intent,interests,distance_km')
          .eq('id', user.id)
          .maybeSingle();

        if (!error && data) {
          const next = {
            display_name: data.full_name || '',
            bio: data.bio || '',
            photo_url: data.photo_url || '',
            intent: data.intent || '',
            interests: Array.isArray(data.interests) ? data.interests : [],
            distance_km: data.distance_km ?? 25,
          };
          setDraft((prev) => ({ ...prev, ...next }));
        }
      } catch (e) {
        console.warn('Onboarding load profile error:', e);
      }
    })();

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Salvataggio debounced (locale + remoto)
  const scheduleSave = (next) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      setSaving(true);
      try {
        // salva bozza in localStorage
        try {
          setJson(DRAFT_KEY, next);
        } catch {}
        // salva su Supabase se loggato
        const user = await currentUser();
        if (user) {
          const row = {
            id: user.id,
            full_name: next.display_name || null,
            bio: next.bio || null,
            photo_url: next.photo_url || null,
            intent: next.intent || null,
            interests: Array.isArray(next.interests) ? next.interests : null,
            distance_km: next.distance_km ?? null,
            profile_score: calcScore(next),
            updated_at: new Date().toISOString(),
          };
          const { error } = await supabase.from('profiles').upsert(row, { onConflict: 'id' });
          if (error) {
            console.warn('Onboarding upsert error:', error);
          }
        }
      } catch (e) {
        console.warn('Onboarding save error:', e);
      } finally {
        setSaving(false);
      }
    }, 700);
  };

  const updateDraft = (patch) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    scheduleSave(next);
  };

  async function handlePhoto(file) {
    if (!file) return;
    // preview locale
    try {
      const preview = URL.createObjectURL(file);
      updateDraft({ photo_url: preview });
    } catch {}

    try {
      const user = await currentUser();
      if (!user) return;
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const path = 'avatars/' + user.id + '-' + Date.now() + '.' + ext;
      const { error } = await supabase.storage.from('avatars').upload(path, file, {
        upsert: true,
        cacheControl: '3600',
        contentType: file.type || 'image/jpeg',
      });
      if (!error) {
        const { data } = supabase.storage.from('avatars').getPublicUrl(path);
        if (data?.publicUrl) {
          updateDraft({ photo_url: data.publicUrl });
        }
      } else {
        console.warn('upload avatar error', error);
      }
    } catch (e) {
      console.warn('upload avatar fail', e);
    }
  }

  function handleFinish() {
    if (score < 80) {
      window.toast?.(
        'Completa il profilo',
        'Aggiungi una bio più ricca (min 80 caratteri), una foto chiara e almeno 3 interessi.',
        'info'
      );
      return;
    }
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    window.toast?.('Profilo pronto', 'Benvenutə! Iniziamo a cercare i match giusti.', 'success');
    window.location.hash = '/consigli';
  }

  const Stepper = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            height: 8,
            borderRadius: 999,
            background:
              i <= step ? 'linear-gradient(90deg,#7c3aed,#60a5fa)' : 'rgba(255,255,255,.15)',
          }}
        />
      ))}
    </div>
  );

  return (
    <main
      className="min-h-screen"
      style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px' }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Completa il tuo profilo</h1>
        <span aria-live="polite" style={{ opacity: 0.75 }}>
          {saving ? 'Salvataggio…' : 'Salvato'}
        </span>
      </header>

      <Card elevation={1} padding="lg">
        <Card.Header
          title={'Step ' + step + '/3'}
          subtitle={'Punteggio profilo: ' + score + '/100'}
        />
        <Card.Body>
          <Stepper />

          {step === 1 && (
            <section>
              <h2 style={{ fontSize: '1.15rem', marginBottom: 8 }}>Foto profilo</h2>
              <p className="ui-hint" style={{ marginBottom: 12 }}>
                Carica un primo piano nitido. Niente filtri pesanti, niente occhiali scuri.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr',
                  gap: 16,
                  alignItems: 'center',
                }}
              >
                <div>
                  {draft.photo_url ? (
                    <img
                      src={draft.photo_url}
                      alt="Anteprima foto profilo"
                      style={{
                        width: 160,
                        height: 160,
                        objectFit: 'cover',
                        borderRadius: 12,
                        border: '1px solid rgba(255,255,255,.15)',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 160,
                        height: 160,
                        borderRadius: 12,
                        border: '1px dashed rgba(255,255,255,.25)',
                        display: 'grid',
                        placeItems: 'center',
                        opacity: 0.7,
                      }}
                    >
                      Nessuna foto
                    </div>
                  )}
                </div>
                <div>
                  <label className="ui-label" htmlFor="photo">
                    Carica una foto
                  </label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhoto(e.target.files && e.target.files[0])}
                    aria-describedby="photo-hint"
                  />
                  <div id="photo-hint" className="ui-hint">
                    JPG/PNG fino a 5MB. Una sola foto è sufficiente per iniziare.
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section>
              <h2 style={{ fontSize: '1.15rem', marginBottom: 8 }}>Nome & Bio</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                <Input
                  label="Come vuoi essere chiamatə"
                  placeholder="Es. Vale"
                  value={draft.display_name}
                  onChange={(e) => updateDraft({ display_name: e.target.value })}
                  required
                />
                <div>
                  <Input
                    label="Raccontaci chi sei"
                    as="textarea"
                    placeholder="Scrivi qualcosa di te, di ciò che cerchi, dei tuoi interessi (min 80 caratteri)…"
                    value={draft.bio}
                    onChange={(e) => updateDraft({ bio: e.target.value })}
                    inputClassName="ui-textarea"
                  />
                  <div className="ui-hint">{(draft.bio || '').length}/300 caratteri</div>
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section>
              <h2 style={{ fontSize: '1.15rem', marginBottom: 8 }}>Preferenze</h2>
              <div style={{ display: 'grid', gap: 12 }}>
                <Select
                  label="Cosa stai cercando?"
                  placeholder="Seleziona…"
                  value={draft.intent}
                  onChange={(e) => updateDraft({ intent: e.target.value })}
                  options={[
                    { value: 'seria', label: 'Relazione seria' },
                    { value: 'conoscenze', label: 'Conoscenze' },
                    { value: 'aperta', label: 'Relazione aperta' },
                    { value: 'non_so', label: 'Non lo so ancora' },
                  ]}
                  required
                />
                <div>
                  <label className="ui-label" htmlFor="dist">
                    Distanza massima
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <input
                      id="dist"
                      type="range"
                      min="5"
                      max="100"
                      value={draft.distance_km}
                      onChange={(e) => updateDraft({ distance_km: Number(e.target.value) })}
                    />
                    <span className="ui-hint">{draft.distance_km} km</span>
                  </div>
                </div>
                <Input
                  label="Interessi (separati da virgola)"
                  placeholder="es. musica, viaggi, cucina, escursioni…"
                  value={Array.isArray(draft.interests) ? draft.interests.join(', ') : ''}
                  onChange={(e) => {
                    const arr = (e.target.value || '')
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean);
                    updateDraft({ interests: arr });
                  }}
                />
              </div>
            </section>
          )}
        </Card.Body>

        <Card.Footer>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Button
              variant="secondary"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Indietro
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(Math.min(3, step + 1))}>Avanti</Button>
            ) : (
              <Button onClick={handleFinish} variant="primary">
                Concludi
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>
    </main>
  );
}
