import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import PremiumStatusBox from "../components/PremiumStatusBox";
import StoricoAbbonamenti from "../components/StoricoAbbonamenti";
import ProfilePhotoGallery from "../components/profile/ProfilePhotoGallery";

function normalizeRole(value) {
  return String(value || "").trim().toLowerCase();
}

function isFutureDate(value) {
  if (!value) return false;
  const time = new Date(value).getTime();
  return Number.isFinite(time) && time > Date.now();
}

function hasCommercialPremium(profile) {
  const role = normalizeRole(profile?.ruolo);

  return (
    role === "premium" ||
    role === "super" ||
    Boolean(profile?.premium) ||
    isFutureDate(profile?.premium_fine)
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profilo, setProfilo] = useState(null);
  const [userId, setUserId] = useState(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [photo, setPhoto] = useState("");
  const [preview, setPreview] = useState("");
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    let alive = true;

    async function fetchProfile() {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!alive) return;

        if (!user?.id) {
          setUserId(null);
          setProfilo(null);
          setName("");
          setBio("");
          setInterests("");
          setPhoto("");
          setPreview("");
          setPhotos([]);
          return;
        }

        setUserId(user.id);

        const { data: profileData, error: profileError } = await supabase
          .from("profili")
          .select(
            "id, nome, email, bio, interessi, foto_url, avatar_url, ruolo, premium, premium_start, premium_fine, tipo_abbonamento, status_account"
          )
          .eq("id", user.id)
          .maybeSingle();

        if (!alive) return;

        if (profileError) {
          console.error("Errore caricamento profilo:", profileError);
          toast.error("Errore nel caricamento del profilo.");
          return;
        }

        const safeProfile = profileData || {
          id: user.id,
          email: user.email || "",
          nome: "",
          bio: "",
          interessi: "",
          foto_url: "",
          avatar_url: "",
          ruolo: "free",
          premium: false,
          premium_start: null,
          premium_fine: null,
          tipo_abbonamento: null,
          status_account: "attivo",
        };

        const initialPhoto = safeProfile.foto_url || safeProfile.avatar_url || "";

        setProfilo(safeProfile);
        setName(safeProfile.nome || "");
        setBio(safeProfile.bio || "");
        setInterests(
          Array.isArray(safeProfile.interessi)
            ? safeProfile.interessi.join(", ")
            : safeProfile.interessi || ""
        );
        setPhoto(initialPhoto);
        setPreview(initialPhoto);
        setPhotos(
          initialPhoto
            ? [
                {
                  id: "main",
                  url: initialPhoto,
                  isPrimary: true,
                  alt: "Foto principale del profilo",
                },
              ]
            : []
        );
      } catch (error) {
        console.error("ProfilePage fetch error:", error);
        if (!alive) return;
        toast.error("Errore temporaneo nel profilo.");
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!photo) {
      setPhotos((prev) => prev.filter((item) => item.id !== "main"));
      return;
    }

    setPhotos((prev) => {
      const withoutMain = prev.filter((item) => item.id !== "main");
      return [
        {
          id: "main",
          url: photo,
          isPrimary: true,
          alt: "Foto principale del profilo",
        },
        ...withoutMain.slice(0, 4).map((item) => ({
          ...item,
          isPrimary: false,
        })),
      ];
    });
  }, [photo]);

  const isPremium = useMemo(() => {
    return hasCommercialPremium(profilo);
  }, [profilo]);

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const value = String(reader.result || "");

      setPhotos((prev) => {
        const withoutSame = prev.filter((item) => item.url !== value);
        const othersWithoutMain = withoutSame.filter((item) => item.id !== "main");

        const next = [
          {
            id: "main",
            url: value,
            isPrimary: true,
            alt: "Foto principale del profilo",
          },
          ...othersWithoutMain.slice(0, 4).map((item) => ({
            ...item,
            isPrimary: false,
          })),
        ];

        return next.slice(0, 5);
      });

      setPhoto(value);
      setPreview(value);
      toast.success("📸 Foto caricata");
    };

    reader.readAsDataURL(file);
  };

  const handleAddPhoto = () => {
    toast("Per ora usa il campo upload qui sotto: collegheremo il multi-upload reale nel prossimo passo.");
  };

  const handleSetPrimaryPhoto = (photoId) => {
    setPhotos((prev) => {
      const selected = prev.find((item) => item.id === photoId);
      if (!selected) return prev;

      const others = prev.filter((item) => item.id !== photoId);

      const next = [
        {
          ...selected,
          id: "main",
          isPrimary: true,
          alt: selected.alt || "Foto principale del profilo",
        },
        ...others
          .filter((item) => item.id !== "main")
          .slice(0, 4)
          .map((item, index) => ({
            ...item,
            id: item.id === "main" ? `photo-${Date.now()}-${index}` : item.id,
            isPrimary: false,
          })),
      ];

      const primary = next[0];
      setPhoto(primary.url);
      setPreview(primary.url);

      return next;
    });
  };

  const handleRemovePhoto = (photoId) => {
    setPhotos((prev) => {
      const next = prev.filter((item) => item.id !== photoId);

      if (next.length === 0) {
        setPhoto("");
        setPreview("");
        return [];
      }

      const normalized = next.map((item, index) => ({
        ...item,
        id: index === 0 ? "main" : item.id,
        isPrimary: index === 0,
      }));

      setPhoto(normalized[0].url);
      setPreview(normalized[0].url);

      return normalized.slice(0, 5);
    });
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("Devi essere autenticato.");
      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      const primaryPhoto = photos.find((item) => item.isPrimary)?.url || photo || null;

      const payload = {
        id: userId,
        nome: name.trim(),
        bio: bio.trim(),
        interessi: interests.trim(),
        foto_url: primaryPhoto,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profili")
        .upsert(payload, { onConflict: "id" })
        .select(
          "id, nome, email, bio, interessi, foto_url, avatar_url, ruolo, premium, premium_start, premium_fine, tipo_abbonamento, status_account"
        )
        .maybeSingle();

      if (error) {
        console.error("Errore salvataggio profilo:", error);
        toast.error("Impossibile salvare il profilo.");
        return;
      }

      const nextProfile = data || {
        ...(profilo || {}),
        ...payload,
      };

      setProfilo(nextProfile);
      setPhoto(nextProfile.foto_url || "");
      setPreview(nextProfile.foto_url || "");
      toast.success("✅ Profilo aggiornato!");
    } catch (error) {
      console.error("ProfilePage save error:", error);
      toast.error("Errore temporaneo durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={containerStyle}>
      <Toaster position="top-right" />

      <style>{`
        @media (max-width: 600px) {
          .profile-input {
            font-size: 1rem !important;
            padding: 1rem !important;
          }

          .profile-img {
            max-width: 100% !important;
          }
        }

        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>

      <h2 style={titleStyle}>
        👤 Il tuo profilo {isPremium && <span style={premiumBadgeAnim}>🌟</span>}
      </h2>

      <PremiumStatusBox
        ruolo={profilo?.ruolo}
        premium={profilo?.premium}
        premium_fine={profilo?.premium_fine}
      />

      {profilo?.tipo_abbonamento && (
        <p style={{ opacity: 0.7 }}>
          🧾 Tipo: <strong>{profilo.tipo_abbonamento}</strong>
        </p>
      )}

      {profilo?.premium_start && (
        <p style={{ opacity: 0.7 }}>
          📅 Inizio: {new Date(profilo.premium_start).toLocaleDateString()}
        </p>
      )}

      {profilo?.premium_fine && (
        <p style={{ opacity: 0.7 }}>
          ⏳ Scade il: {new Date(profilo.premium_fine).toLocaleDateString()}
        </p>
      )}

      {!isPremium && (
        <button style={paywallBtn} onClick={() => navigate("/premium")}>
          💎 Diventa Premium
        </button>
      )}

      <ProfilePhotoGallery
        photos={photos}
        onSetPrimary={handleSetPrimaryPhoto}
        onRemove={handleRemovePhoto}
        onAdd={handleAddPhoto}
        disabled={loading || saving}
      />

      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
        className="profile-input"
        disabled={loading || saving}
      />

      <textarea
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        style={{ ...inputStyle, height: "100px" }}
        className="profile-input"
        disabled={loading || saving}
      />

      <input
        type="text"
        placeholder="Interessi (es: musica, lettura)"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
        style={inputStyle}
        className="profile-input"
        disabled={loading || saving}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handlePhoto}
        style={inputStyle}
        className="profile-input"
        disabled={loading || saving}
      />

      {preview && (
        <img
          src={preview}
          alt="Anteprima"
          className="profile-img"
          style={{ maxWidth: "200px", borderRadius: "8px", marginTop: "1rem" }}
        />
      )}

      <button style={saveBtn} onClick={handleSave} disabled={loading || saving}>
        {saving ? "Salvataggio..." : "💾 Salva modifiche"}
      </button>

      <p style={{ opacity: 0.6, marginTop: "2rem" }}>
        {loading ? "Caricamento profilo..." : "💾 I dati vengono sincronizzati"}
      </p>

      {userId && <StoricoAbbonamenti userId={userId} />}
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
  boxShadow: "0 0 10px #f08fc0",
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
  cursor: "pointer",
};