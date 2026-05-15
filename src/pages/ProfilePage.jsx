import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import PremiumStatusBox from "../components/PremiumStatusBox";
import StoricoAbbonamenti from "../components/StoricoAbbonamenti";
import ProfilePhotoGallery from "../components/profile/ProfilePhotoGallery";
import ProfileCompletionCard from "../components/profile/ProfileCompletionCard";
import { calculateProfileCompletion } from "../lib/profileCompletion";

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

function normalizePhotos(rows = []) {
  const ordered = [...rows].sort((a, b) => {
    if (a.is_primary === b.is_primary) {
      return (a.ordine ?? 99) - (b.ordine ?? 99);
    }
    return a.is_primary ? -1 : 1;
  });

  return ordered.slice(0, 5).map((row, index) => ({
    id: row.id,
    url: row.foto_url,
    isPrimary: index === 0,
    alt: index === 0 ? "Foto principale del profilo" : `Foto profilo ${index + 1}`,
    order: row.ordine ?? index,
  }));
}

export default function ProfilePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profilo, setProfilo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState("");
  const [photos, setPhotos] = useState([]);

  const profileCompletion = useMemo(
    () =>
      calculateProfileCompletion({
        profile: {
          ...(profilo || {}),
          nome: name,
          bio,
          interessi: interests,
        },
        photos,
      }),
    [profilo, name, bio, interests, photos]
  );

  useEffect(() => {
    let alive = true;

    async function fetchProfile() {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!alive) return;

        if (!user?.id) {
          setUserId(null);
          setUserEmail("");
          setProfilo(null);
          setName("");
          setBio("");
          setInterests("");
          setPhotos([]);
          return;
        }

        setUserId(user.id);
        setUserEmail(user.email || "");

        const { data: profileData, error: profileError } = await supabase
          .from("profili")
          .select(
            "id, nome, email, bio, interessi, foto_url, avatar_url, ruolo, premium, premium_start, premium_fine, tipo_abbonamento, status_account"
          )
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!alive) return;

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

        setProfilo(safeProfile);
        setName(safeProfile.nome || "");
        setBio(safeProfile.bio || "");
        setInterests(
          Array.isArray(safeProfile.interessi)
            ? safeProfile.interessi.join(", ")
            : safeProfile.interessi || ""
        );

        const { data: photoRows, error: photoError } = await supabase
          .from("profili_foto")
          .select("id, foto_url, ordine, is_primary, created_at")
          .eq("profilo_id", user.id)
          .order("ordine", { ascending: true });

        if (photoError) {
          console.error("Errore caricamento foto profilo:", photoError);
          toast.error("Errore nel caricamento delle foto.");
        }

        const normalized = normalizePhotos(photoRows || []);
        setPhotos(normalized);
      } catch (error) {
        console.error("ProfilePage fetch error:", error);
        if (!alive) return;
        toast.error("Errore temporaneo nel profilo.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchProfile();

    return () => {
      alive = false;
    };
  }, []);

  const isPremium = useMemo(() => hasCommercialPremium(profilo), [profilo]);

  const ensureProfileRow = async () => {
    if (!userId) {
      throw new Error("Utente non autenticato.");
    }

    const payload = {
      id: userId,
      email: profilo?.email || userEmail || "",
      nome: name.trim(),
      bio: bio.trim(),
      interessi: interests.trim(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("profili")
      .upsert(payload, { onConflict: "id" })
      .select("id, nome, email, bio, interessi, foto_url, avatar_url, ruolo, premium, premium_start, premium_fine, tipo_abbonamento, status_account")
      .maybeSingle();

    if (error) {
      throw error;
    }

    const nextProfile = data || {
      ...(profilo || {}),
      ...payload,
    };

    setProfilo(nextProfile);

    return nextProfile;
  };

  const handleAddPhoto = () => {
    const input = document.getElementById("profile-photo-input");
    input?.click();
  };

  const handlePhoto = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!userId || files.length === 0) return;

    if (photos.length >= 5) {
      toast.error("Puoi caricare massimo 5 foto.");
      event.target.value = "";
      return;
    }

    const availableSlots = Math.max(0, 5 - photos.length);
    const filesToUse = files.slice(0, availableSlots);

    try {
      setUploading(true);

      await ensureProfileRow();



      const currentPhotos = [...photos];


      const rowsToInsert = [];

      for (const file of filesToUse) {
        const value = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(String(reader.result || ""));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        rowsToInsert.push({
          profilo_id: userId,
          foto_url: value,
          ordine: currentPhotos.length + rowsToInsert.length,
          is_primary: currentPhotos.length === 0 && rowsToInsert.length === 0,
        });
      }

      const { error } = await supabase.from("profili_foto").insert(rowsToInsert);

      if (error) {
        console.error("Errore caricamento foto:", error);
        toast.error("Impossibile caricare le foto.");
        return;
      }

      const { data: refreshed, error: refreshError } = await supabase
        .from("profili_foto")
        .select("id, foto_url, ordine, is_primary, created_at")
        .eq("profilo_id", userId)
        .order("ordine", { ascending: true });

      if (refreshError) {
        console.error("Errore refresh foto:", refreshError);
        toast.error("Foto caricate, ma elenco non aggiornato.");
        return;
      }

      const normalized = normalizePhotos(refreshed || []);
      setPhotos(normalized);
      toast.success("📸 Foto caricate");
    } catch (error) {
      console.error("Profile photo upload error:", error);
      toast.error("Errore temporaneo durante il caricamento.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSetPrimaryPhoto = async (photoId) => {
    if (!userId) return;

    try {
      setSaving(true);

      const reordered = photos.map((item, index) => {
        if (item.id === photoId) {
          return { ...item, isPrimary: true, order: 0 };
        }
        return { ...item, isPrimary: false, order: index + 1 };
      });

      const primary = reordered.find((item) => item.id === photoId);
      const rest = reordered.filter((item) => item.id !== photoId);
      const normalizedOrder = [primary, ...rest].filter(Boolean).map((item, index) => ({
        ...item,
        isPrimary: index === 0,
        order: index,
      }));

      const tempOrderOffset = 1000;

      for (const [index, item] of normalizedOrder.entries()) {
        const { error } = await supabase
          .from("profili_foto")
          .update({
            is_primary: false,
            ordine: tempOrderOffset + index,
          })
          .eq("id", item.id)
          .eq("profilo_id", userId);

        if (error) throw error;
      }

      for (const item of normalizedOrder) {
        const { error } = await supabase
          .from("profili_foto")
          .update({
            is_primary: item.isPrimary,
            ordine: item.order,
          })
          .eq("id", item.id)
          .eq("profilo_id", userId);

        if (error) throw error;
      }

      setPhotos(normalizedOrder);
      toast.success("✨ Foto principale aggiornata");
    } catch (error) {
      console.error("Errore foto principale:", error);
      toast.error("Impossibile aggiornare la foto principale.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemovePhoto = async (photoId) => {
    if (!userId) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from("profili_foto")
        .delete()
        .eq("id", photoId)
        .eq("profilo_id", userId);

      if (error) throw error;

      const { data: refreshed, error: refreshError } = await supabase
        .from("profili_foto")
        .select("id, foto_url, ordine, is_primary, created_at")
        .eq("profilo_id", userId)
        .order("ordine", { ascending: true });

      if (refreshError) throw refreshError;

      const normalized = normalizePhotos(refreshed || []);

      if (normalized.length > 0 && !normalized.some((item) => item.isPrimary)) {
        normalized[0] = { ...normalized[0], isPrimary: true, order: 0 };
      }

      setPhotos(normalized);
      toast.success("🗑️ Foto rimossa");
    } catch (error) {
      console.error("Errore rimozione foto:", error);
      toast.error("Impossibile rimuovere la foto.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("Devi essere autenticato.");
      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      const primaryPhoto = photos.find((item) => item.isPrimary)?.url || null;

      const payload = {
        id: userId,
        email: profilo?.email || userEmail || "",
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
      toast.success("✅ Profilo aggiornato!");
    } catch (error) {
      console.error("ProfilePage save error:", error);
      toast.error("Errore temporaneo durante il salvataggio.");
    } finally {
      setSaving(false);
    }
  };

  const handleProfileCompletionAction = () => {
    if (profileCompletion.isComplete) {
      navigate("/scopri");
      return;
    }

    const firstMissing = profileCompletion.missingKeys[0];

    if (firstMissing === "photos") {
      document.getElementById("profile-photo-input")?.click();
      return;
    }

    const fieldByKey = {
      name: "profile-name-input",
      bio: "profile-bio-input",
      interests: "profile-interests-input",
    };

    const targetId = fieldByKey[firstMissing] || "profile-name-input";
    document.getElementById(targetId)?.focus();
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

      <ProfileCompletionCard
        completion={profileCompletion}
        onPrimaryAction={handleProfileCompletionAction}
        disabled={loading || saving || uploading}
      />

      <ProfilePhotoGallery
        photos={photos}
        onSetPrimary={handleSetPrimaryPhoto}
        onRemove={handleRemovePhoto}
        onAdd={handleAddPhoto}
        disabled={loading || saving || uploading}
      />

      <input
        id="profile-photo-input"
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhoto}
        style={hiddenFileInputStyle}
        disabled={loading || saving || uploading}
      />

      <input
        id="profile-name-input"
        type="text"
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
        className="profile-input"
        disabled={loading || saving}
      />

      <textarea
        id="profile-bio-input"
        placeholder="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        style={{ ...inputStyle, height: "100px" }}
        className="profile-input"
        disabled={loading || saving}
      />

      <input
        id="profile-interests-input"
        type="text"
        placeholder="Interessi (es: musica, lettura)"
        value={interests}
        onChange={(e) => setInterests(e.target.value)}
        style={inputStyle}
        className="profile-input"
        disabled={loading || saving}
      />

      <button style={saveBtn} onClick={handleSave} disabled={loading || saving || uploading}>
        {saving ? "Salvataggio..." : uploading ? "Caricamento foto..." : "💾 Salva modifiche"}
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

const hiddenFileInputStyle = {
  display: "none",
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