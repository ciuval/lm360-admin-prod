// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');
  const [photo, setPhoto] = useState('');
  const [preview, setPreview] = useState('');

useEffect(() => {
  const registraVisita = async () => {
    if (!user?.id || !profilo?.id || user.id === profilo.id) return;
    await supabase.from("visite_profili").insert({
      visitatore_id: user.id,
      visitato_id: profilo.id,
    });
  };
  registraVisita();
}, [user, profilo]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('userProfile'));
    if (saved) {
      setName(saved.name);
      setBio(saved.bio);
      setInterests(saved.interests);
      setPhoto(saved.photo);
      setPreview(saved.photo);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify({ name, bio, 
interests, photo }));
  }, [name, bio, interests, photo]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>👤 Il tuo profilo</h2>
      <input type="text" placeholder="Nome" value={name} onChange={(e) => 
setName(e.target.value)} style={inputStyle} />
      <textarea placeholder="Bio" value={bio} onChange={(e) => 
setBio(e.target.value)} style={{ ...inputStyle, height: "100px" }} />
      <input type="text" placeholder="Interessi (es: musica, lettura)" 
value={interests} onChange={(e) => setInterests(e.target.value)} 
style={inputStyle} />
      <input type="file" accept="image/*" onChange={handlePhoto} 
style={inputStyle} />
      {preview && <img src={preview} alt="Anteprima" style={{ maxWidth: 
"200px", borderRadius: "8px", marginTop: "1rem" }} />}
      <p style={{ opacity: 0.6, marginTop: "2rem" }}>💾 I dati sono 
salvati in locale</p>
    </div>
  );
}

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
  fontSize: "1rem",
};

