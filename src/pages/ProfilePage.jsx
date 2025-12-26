import { getJson, setJson } from '../lib/storage';
// src/pages/ProfilePage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Toaster, toast } from 'react-hot-toast';
import PremiumStatusBox from '../components/PremiumStatusBox';
import StoricoAbbonamenti from '../components/StoricoAbbonamenti';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState(null);
  const [profilo, setProfilo] = useState(null);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [photo, setPhoto] = useState('');
  const [preview, setPreview] = useState('');

  const isPremium = useMemo(() => (profilo?.ruolo || '').toLowerCase() === 'premium', [profilo]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data: u } = await supabase.auth.getUser();
        const user = u?.user;
        if (!user) {
          setLoading(false);
          return;
        }
        setUserId(user.id);

        // Selezione "sicura": prendi tutto ciò che esiste
        const { data, error } = await supabase
          .from('profili')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (alive && data) {
          setProfilo(data);
          setName(String(data?.nome || ''));
          setBio(String(data?.bio || ''));
          setInterests(String(data?.interessi || ''));
          const f = String(data?.foto_url || '');
          setPhoto(f);
          setPreview(f);
        }
      } catch (e) {
        console.error('[ProfilePage] load error:', e?.message);
        toast.error('Impossibile caricare il profilo.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    try {
      setJson('userProfile', JSON.stringify({ name, bio, interests, photo, premium: isPremium }));
    } catch {}
  }, [name, bio, interests, photo, isPremium]);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const b64 = String(reader.result || '');
      setPhoto(b64);
      setPreview(b64);
      toast.success('📸 Foto caricata');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      // Aggiorna SOLO le colonne che esistono davvero nel profilo caricato
      const payload = {};
      if (profilo && 'nome' in profilo) payload.nome = name || null;
      if (profilo && 'bio' in profilo) payload.bio = bio || null;
      if (profilo && 'interessi' in profilo) payload.interessi = interests || null;
      if (profilo && 'foto_url' in profilo) payload.foto_url = photo || null;

      // fallback minimo: almeno il nome
      if (!profilo || Object.keys(payload).length === 0) {
        payload.nome = name || null;
      }

      const { error } = await supabase.from('profili').update(payload).eq('id', userId);
      if (error) throw error;

      toast.success('✅ Profilo aggiornato!');
      setProfilo((p) => (p ? { ...p, ...payload } : p));
    } catch (e) {
      console.error('Errore salvataggio profilo:', e?.message);
      toast.error('Salvataggio non riuscito.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={containerStyle}>
      <Toaster position="top-right" />
      <style>{`
        @media (max-width: 600px) {
          .profile-input { font-size: 1rem !important; padding: 1rem !important; }
          .profile-img { max-width: 100% !important; }
        }
        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>

      <h2 style={titleStyle}>
        👤 Il tuo profilo{' '}
        {isPremium && (
          <span style={premiumBadgeAnim} aria-label="Premium">
            🌟
          </span>
        )}
      </h2>

      {loading ? (
        <p style={{ opacity: 0.8 }}>⏳ Caricamento profilo…</p>
      ) : (
        <>
          <PremiumStatusBox ruolo={profilo?.ruolo} premium_fine={profilo?.premium_fine} />

          {!isPremium && (
            <button type="button" style={paywallBtn} onClick={() => navigate('/premium')}>
              💎 Diventa Premium
            </button>
          )}

          {/* Nome */}
          <label style={labelStyle}>Nome</label>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            className="profile-input"
          />

          {/* Bio (se presente a DB) */}
          {'bio' in (profilo || {}) && (
            <>
              <label style={labelStyle}>Bio</label>
              <textarea
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ ...inputStyle, height: 110 }}
                className="profile-input"
              />
            </>
          )}

          {/* Interessi (se presente a DB) */}
          {'interessi' in (profilo || {}) && (
            <>
              <label style={labelStyle}>Interessi</label>
              <input
                type="text"
                placeholder="Interessi (es: musica, lettura)"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                style={inputStyle}
                className="profile-input"
              />
            </>
          )}

          {/* Foto profilo (se presente a DB) */}
          {'foto_url' in (profilo || {}) && (
            <>
              <label style={labelStyle}>Foto profilo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                style={inputStyle}
                className="profile-input"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Anteprima immagine profilo"
                  className="profile-img"
                  style={{ maxWidth: 220, borderRadius: 8, marginTop: 12 }}
                />
              )}
            </>
          )}

          <button
            type="button"
            style={{ ...saveBtn, opacity: saving ? 0.7 : 1 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '💾 Salvataggio…' : '💾 Salva modifiche'}
          </button>

          <p style={{ opacity: 0.6, marginTop: 18 }}>💾 I dati vengono sincronizzati</p>

          {userId && <StoricoAbbonamenti userId={userId} />}
        </>
      )}
    </div>
  );
}

/* STILI */
const containerStyle = {
  padding: '2rem',
  backgroundColor: '#121212',
  color: '#fff',
  minHeight: '100vh',
  fontFamily: "'Segoe UI', sans-serif",
};
const titleStyle = { color: '#f08fc0', textShadow: '0 0 10px #f08fc0', marginBottom: '1rem' };
const labelStyle = {
  display: 'block',
  marginTop: '0.6rem',
  marginBottom: '0.2rem',
  opacity: 0.85,
  fontSize: '0.95rem',
};
const inputStyle = {
  display: 'block',
  width: '100%',
  margin: '0.4rem 0 0.8rem',
  padding: '0.8rem',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#1e1e1e',
  color: '#fff',
  fontSize: '1.05rem',
};
const premiumBadgeAnim = {
  display: 'inline-block',
  marginLeft: 8,
  animation: 'shimmer 2s infinite',
};
const paywallBtn = {
  backgroundColor: '#f08fc0',
  color: '#fff',
  padding: '0.7rem 1.4rem',
  border: 'none',
  borderRadius: 6,
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  margin: '0.6rem 0 1.2rem',
  boxShadow: '0 0 10px #f08fc0',
};
const saveBtn = {
  backgroundColor: '#1e88e5',
  color: '#fff',
  border: 'none',
  padding: '0.85rem 1.6rem',
  fontSize: '1rem',
  borderRadius: 8,
  fontWeight: 'bold',
  marginTop: '1rem',
  cursor: 'pointer',
};
