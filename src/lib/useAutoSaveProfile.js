import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import { track } from "./analytics";

export function useAutoSaveProfile(values) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const t = useRef(null);
  const lastSig = useRef("");

  useEffect(() => {
    if (!window.location.hash.includes("/profile")) return;
    clearTimeout(t.current);

    t.current = setTimeout(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) return;

        const payload = {
          _display_name: values?.display_name?.trim() || "",
          _bio:          values?.bio?.trim() || "",
          _avatar_url:   values?.avatar_url ?? null
        };

        const sig = JSON.stringify(payload);
        if (sig === lastSig.current) return;
        lastSig.current = sig;

        setSaving(true); setError(null);
        const { error: rpcErr } = await supabase.rpc("save_profile", payload);
        if (rpcErr) throw rpcErr;

        setSaving(false);
        track("profile_saved");
        window.dispatchEvent(new CustomEvent("soft-toast", { detail: { type: "success", text: "Salvato" } }));
      } catch (e) {
        setSaving(false); setError(true);
        window.dispatchEvent(new CustomEvent("soft-toast", { detail: { type: "error", text: "Errore salvataggio" } }));
      }
    }, 700);

    return () => clearTimeout(t.current);
  }, [values?.display_name, values?.bio, values?.avatar_url]);

  return { saving, error };
}

export default useAutoSaveProfile;
