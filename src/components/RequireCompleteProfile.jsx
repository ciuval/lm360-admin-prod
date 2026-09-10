import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { calculateProfileCompletion } from "../lib/profileCompletion";

export default function RequireCompleteProfile({ children }) {
  const location = useLocation();
  const [state, setState] = useState({ loading: true, complete: false });
  const from = location.pathname + location.search + location.hash;

  useEffect(() => {
    let alive = true;

    async function verifyProfile() {
      try {
        setState({ loading: true, complete: false });

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user?.id) {
          if (alive) setState({ loading: false, complete: false });
          return;
        }

        const [{ data: profile, error: profileError }, { data: photos, error: photosError }] =
          await Promise.all([
            supabase
              .from("profili")
              .select("nome, bio, interessi, foto_url, avatar_url")
              .eq("id", user.id)
              .maybeSingle(),
            supabase
              .from("profili_foto")
              .select("foto_url")
              .eq("profilo_id", user.id)
              .limit(1),
          ]);

        if (profileError || photosError) {
          if (alive) setState({ loading: false, complete: false });
          return;
        }

        const completion = calculateProfileCompletion({
          profile: profile || {},
          photos: (photos || []).map((photo) => ({ url: photo.foto_url })),
        });

        if (alive) setState({ loading: false, complete: completion.isComplete });
      } catch {
        if (alive) setState({ loading: false, complete: false });
      }
    }

    verifyProfile();

    return () => {
      alive = false;
    };
  }, [from]);

  if (state.loading) {
    return <p role="status" aria-live="polite">Controllo del profilo…</p>;
  }

  if (!state.complete) {
    return (
      <Navigate
        to="/profilo"
        replace
        state={{ from, reason: "profile_required" }}
      />
    );
  }

  return children;
}
