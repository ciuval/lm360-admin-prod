// ✅ File: src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import PremiumStatusBox from "../components/PremiumStatusBox";
import StoricoAbbonamenti from "../components/StoricoAbbonamenti";

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [photo, setPhoto] = useState('');
  const [preview, setPreview] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [profilo, setProfilo] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: profile, error } = await supabase
        .from("profili")
        .select("nome, bio, interessi, foto_url, ruolo, premium_fine, premium_start, tipo_abbonamento")
        .eq("id", user.id)
        .single();

      if (profile) {
        setProfilo(profile);
        setName(profile.nome || '');
        setBio(profile.bio || '');
        setInterests(profile.interessi || '');
        setPhoto(profile.foto_url || '');
        setPreview(profile.foto_url || '');
        setIsPremium(profile.ruolo === "premium");
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'userProfile',
      JSON.stringify({ name, bio, interests, photo, premium: isPremium })
    );
  }, [name, bio, interests, photo, isPremium]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        setPreview(reader.result);
        toast.success("📸 Foto caricata");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!userId) return;
    const { error } = await supabase
      .from("profili")
      .update({ nome: name, bio, interessi: interests, foto_url: photo })
      .eq("id", userId);
    if (!error) toast.success("✅ Profilo aggiornato!");
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

      <h2 style={titleStyle}>👤 Il tuo profilo {isPremium && <span style={premiumBadgeAnim}>🌟</span>}</h2>

      <PremiumStatusBox ruolo={profilo?.ruolo} premium_fine={profilo?.premium_fine} />

      {profilo?.tipo_abbonamento && (
        <p style={{ opacity: 0.7 }}>🧾 Tipo: <strong>{profilo.tipo_abbonamento}</strong></p>
      )}
      {profilo?.premium_start && (
        <p style={{ opacity: 0.7 }}>📅 Inizio: {new Date(profilo.premium_start).toLocaleDateString()}</p>
      )}
      {profilo?.premium_fine && (
        <p style={{ opacity: 0.7 }}>⏳ Scade il: {new Date(profilo.premium_fine).toLocaleDateString()}</p>
      )}

      {!isPremium && (
        <button style={paywallBtn} onClick={() => navigate("/paywall")}>💎 Diventa Premium</button>
      )}

      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
        className="profile-input"
      />
      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        style={{ ...inputStyle, height: "100px" }}
        className="profile-input"
      />
      <input
        type="text"
        placeholder="Interessi (es: musica, lettura)"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
        style={inputStyle}
        className="profile-input"
      />
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
          alt="Anteprima"
          className="profile-img"
          style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "1rem" }}
        />
      )}

      <button style={saveBtn} onClick={handleSave}>💾 Salva modifiche</button>
      <p style={{ opacity: 0.6, marginTop: "2rem" }}>💾 I dati vengono sincronizzati</p>

      {userId && <StoricoAbbonamenti userId={userId} />}
    </div>
  );
}

// STILI
const containerStyle = {
  padding: "2rem",
  backgroundColor: "#121212",
  color: "white",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', sans-serif",
};

const titleStyle = {
  color: "#f08fc0",
  textShadow: "0 0 10px #f08fc0",
};

const inputStyle = {
  display: "block",
  width: "100%",
  margin: "1rem 0",
  padding: "0.8rem",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#1e1e1e",
  color: "#fff",
  fontSize: "1.1rem",
};

const premiumBadgeAnim = {
  display: "inline-block",
  marginLeft: "0.5rem",
  animation: "shimmer 2s infinite",
};

const paywallBtn = {
  backgroundColor: "#f08fc0",
  color: "#fff",
  padding: "0.7rem 1.4rem",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
  marginBottom: "1rem",
  boxShadow: "0 0 10px #f08fc0"
};

const saveBtn = {
  backgroundColor: "#1e88e5",
  color: "#fff",
  border: "none",
  padding: "0.8rem 1.6rem",
  fontSize: "1rem",
  borderRadius: "8px",
  fontWeight: "bold",
  marginTop: "1rem",
  cursor: "pointer"
};

